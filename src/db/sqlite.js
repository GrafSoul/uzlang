import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { seedCards, seedTopics, seedWords, topicImageByKey } from '../data/seedData';

const STORAGE_KEY = 'uzlang-db-v1';

let sqlPromise;
let dbInstance;

function toDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString()
    .slice(0, 10);
}

function plusDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return toDateOnly(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getRecentDateRange(days) {
  const result = [];
  const today = new Date();
  const start = addDays(today, -(days - 1));
  for (let i = 0; i < days; i += 1) {
    result.push(toDateOnly(addDays(start, i)));
  }
  return result;
}

function getIsoWeekStart(date) {
  const day = date.getUTCDay() || 7;
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - day + 1);
  return start;
}

function toIsoWeekKey(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

function getRecentIsoWeeks(weeks) {
  const result = [];
  const now = new Date();
  const currentWeekStart = getIsoWeekStart(now);
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const weekStart = addDays(currentWeekStart, -i * 7);
    result.push({
      key: toIsoWeekKey(weekStart),
      label: weekStart.toISOString().slice(5, 10),
      startDate: weekStart.toISOString().slice(0, 10)
    });
  }
  return result;
}

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: () => wasmUrl
    });
  }
  return sqlPromise;
}

function saveDb(db) {
  const data = db.export();
  const bytes = Array.from(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bytes));
}

function runPrepared(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
}

function readRows(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function createSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      uz TEXT NOT NULL,
      reading TEXT NOT NULL,
      ru TEXT NOT NULL,
      example_uz TEXT NOT NULL,
      example_ru TEXT NOT NULL,
      image_url TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics (id)
    );

    CREATE TABLE IF NOT EXISTS progress (
      card_id INTEGER PRIMARY KEY,
      easiness REAL NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 1,
      repetitions INTEGER NOT NULL DEFAULT 0,
      next_review TEXT NOT NULL,
      last_score INTEGER,
      FOREIGN KEY (card_id) REFERENCES cards (id)
    );

    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      level INTEGER NOT NULL,
      uz TEXT NOT NULL,
      reading TEXT NOT NULL,
      ru TEXT NOT NULL,
      image_url TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics (id)
    );

    CREATE TABLE IF NOT EXISTS word_progress (
      word_id INTEGER PRIMARY KEY,
      easiness REAL NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 1,
      repetitions INTEGER NOT NULL DEFAULT 0,
      next_review TEXT NOT NULL,
      last_score INTEGER,
      FOREIGN KEY (word_id) REFERENCES words (id)
    );

    CREATE TABLE IF NOT EXISTS word_quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      is_success INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS word_review_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (word_id) REFERENCES words (id)
    );

    CREATE TABLE IF NOT EXISTS word_step_quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_index INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      is_success INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_words_unique ON words (uz, ru);
  `);
}

function seedPhrases(db) {
  db.run('BEGIN;');
  seedTopics.forEach((topic) => {
    runPrepared(
      db,
      'INSERT OR IGNORE INTO topics (topic_key, title, description) VALUES (?, ?, ?);',
      [topic.key, topic.title, topic.description]
    );
  });

  const topicRows = readRows(db, 'SELECT id, topic_key FROM topics;');
  const topicMap = new Map(topicRows.map((row) => [row.topic_key, row.id]));

  seedCards.forEach((card) => {
    runPrepared(
      db,
      `INSERT INTO cards (topic_id, uz, reading, ru, example_uz, example_ru, image_url)
       SELECT ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1
         FROM cards
         WHERE topic_id = ? AND uz = ? AND ru = ?
       );`,
      [
        topicMap.get(card.topicKey),
        card.uz,
        card.reading,
        card.ru,
        card.exampleUz,
        card.exampleRu,
        card.imageUrl || topicImageByKey[card.topicKey] || null,
        topicMap.get(card.topicKey),
        card.uz,
        card.ru
      ]
    );
  });

  db.run('COMMIT;');
}

function seedWordsData(db) {
  const topicRows = readRows(db, 'SELECT id, topic_key FROM topics;');
  const topicMap = new Map(topicRows.map((row) => [row.topic_key, row.id]));

  db.run('BEGIN;');
  seedWords.forEach((word) => {
    const topicId = topicMap.get(word.topicKey);
    if (!topicId) {
      return;
    }

    runPrepared(
      db,
      `INSERT OR IGNORE INTO words
        (topic_id, level, uz, reading, ru, image_url)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        topicId,
        Number(word.level),
        word.uz,
        word.reading,
        word.ru,
        topicImageByKey[word.topicKey] || null
      ]
    );
  });
  db.run('COMMIT;');
}

function backfillImages(db) {
  const topics = Object.entries(topicImageByKey);
  topics.forEach(([topicKey, imageUrl]) => {
    runPrepared(
      db,
      `UPDATE cards
       SET image_url = ?
       WHERE image_url IS NULL
         AND topic_id IN (SELECT id FROM topics WHERE topic_key = ?);`,
      [imageUrl, topicKey]
    );

    runPrepared(
      db,
      `UPDATE words
       SET image_url = ?
       WHERE image_url IS NULL
         AND topic_id IN (SELECT id FROM topics WHERE topic_key = ?);`,
      [imageUrl, topicKey]
    );
  });
}

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await getSql();
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    dbInstance = new SQL.Database(Uint8Array.from(JSON.parse(stored)));
  } else {
    dbInstance = new SQL.Database();
  }

  createSchema(dbInstance);
  seedPhrases(dbInstance);
  seedWordsData(dbInstance);
  backfillImages(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

export async function getTopics() {
  const db = await getDb();
  const rows = readRows(
    db,
    `SELECT t.id,
            t.topic_key AS topicKey,
            t.title,
            t.description,
            COUNT(w.id) AS totalWords,
            SUM(CASE WHEN wp.repetitions > 0 THEN 1 ELSE 0 END) AS learnedWords
     FROM topics t
     LEFT JOIN words w ON w.topic_id = t.id
     LEFT JOIN word_progress wp ON wp.word_id = w.id
     GROUP BY t.id
     ORDER BY t.id;`
  );

  return rows.map((row) => {
    const totalWords = Number(row.totalWords || 0);
    const learnedWords = Number(row.learnedWords || 0);
    return {
      id: Number(row.id),
      topicKey: row.topicKey,
      title: row.title,
      description: row.description,
      totalWords,
      learnedWords,
      unlocked: totalWords === 0 || learnedWords >= totalWords
    };
  });
}

export async function getCardsByTopic(topicId) {
  const db = await getDb();
  return readRows(
    db,
    `SELECT id, uz, reading, ru, example_uz AS exampleUz, example_ru AS exampleRu,
            image_url AS imageUrl
     FROM cards
     WHERE topic_id = ?
     ORDER BY id;`,
    [topicId]
  );
}

export async function getDueCards(limit = 20) {
  const db = await getDb();
  const today = toDateOnly();

  return readRows(
    db,
    `SELECT c.id, c.uz, c.reading, c.ru, c.example_uz AS exampleUz, c.example_ru AS exampleRu,
            c.image_url AS imageUrl,
            t.title AS topicTitle,
            p.next_review AS nextReview
     FROM cards c
     JOIN topics t ON c.topic_id = t.id
     LEFT JOIN progress p ON p.card_id = c.id
     WHERE p.next_review IS NULL OR p.next_review <= ?
     ORDER BY COALESCE(p.next_review, ?) ASC, c.id ASC
     LIMIT ?;`,
    [today, today, limit]
  );
}

export async function getQuizCards(topicId, limit = 10) {
  const db = await getDb();
  return readRows(
    db,
    `SELECT id, uz, reading, ru, example_uz AS exampleUz, example_ru AS exampleRu,
            image_url AS imageUrl
     FROM cards
     WHERE topic_id = ?
     ORDER BY RANDOM()
     LIMIT ?;`,
    [topicId, limit]
  );
}

export async function recordReview(cardId, score) {
  const db = await getDb();
  const today = toDateOnly();
  const rows = readRows(
    db,
    'SELECT easiness, interval_days AS intervalDays, repetitions FROM progress WHERE card_id = ?;',
    [cardId]
  );

  let easiness = 2.5;
  let intervalDays = 1;
  let repetitions = 0;

  if (rows.length > 0) {
    easiness = Number(rows[0].easiness);
    intervalDays = Number(rows[0].intervalDays);
    repetitions = Number(rows[0].repetitions);
  }

  if (score < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easiness));
    }
  }

  easiness = Math.max(
    1.3,
    easiness + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
  );

  const nextReview = plusDays(today, intervalDays);

  runPrepared(
    db,
    `INSERT INTO progress
      (card_id, easiness, interval_days, repetitions, next_review, last_score)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(card_id) DO UPDATE SET
      easiness = excluded.easiness,
      interval_days = excluded.interval_days,
      repetitions = excluded.repetitions,
      next_review = excluded.next_review,
      last_score = excluded.last_score;`,
    [cardId, easiness, intervalDays, repetitions, nextReview, score]
  );

  saveDb(db);

  return { nextReview, intervalDays, repetitions };
}

export async function getWordStats() {
  const db = await getDb();
  const [{ total }] = readRows(db, 'SELECT COUNT(*) AS total FROM words;');
  const levelRows = readRows(
    db,
    'SELECT level, COUNT(*) AS count FROM words GROUP BY level ORDER BY level;'
  );
  return {
    total: Number(total),
    byLevel: levelRows.map((row) => ({
      level: Number(row.level),
      count: Number(row.count)
    }))
  };
}

export async function getWordsByLevel(level, limit = 200) {
  const db = await getDb();
  return readRows(
    db,
    `SELECT w.id, w.level, w.uz, w.reading, w.ru, w.image_url AS imageUrl,
            t.title AS topicTitle
     FROM words w
     JOIN topics t ON w.topic_id = t.id
     WHERE w.level = ?
     ORDER BY w.level ASC, w.id ASC
     LIMIT ?;`,
    [level, limit]
  );
}

export async function getWordsByStep(stepIndex, stepSize = 20) {
  const db = await getDb();
  const offset = Math.max(0, Number(stepIndex) || 0) * Number(stepSize);
  return readRows(
    db,
    `SELECT w.id, w.level, w.uz, w.reading, w.ru, w.image_url AS imageUrl,
            t.title AS topicTitle
     FROM words w
     JOIN topics t ON w.topic_id = t.id
     ORDER BY w.id ASC
     LIMIT ?
     OFFSET ?;`,
    [stepSize, offset]
  );
}

export async function getDueWords(level, limit = 30) {
  const db = await getDb();
  const today = toDateOnly();

  return readRows(
    db,
    `SELECT w.id, w.level, w.uz, w.reading, w.ru, w.image_url AS imageUrl,
            t.title AS topicTitle,
            wp.next_review AS nextReview
     FROM words w
     JOIN topics t ON w.topic_id = t.id
     LEFT JOIN word_progress wp ON wp.word_id = w.id
     WHERE w.level = ?
       AND (wp.next_review IS NULL OR wp.next_review <= ?)
     ORDER BY COALESCE(wp.next_review, ?) ASC, w.level ASC, w.id ASC
     LIMIT ?;`,
    [level, today, today, limit]
  );
}

export async function getDueWordsByStep(stepIndex, stepSize = 20, limit = 30) {
  const db = await getDb();
  const today = toDateOnly();
  const offset = Math.max(0, Number(stepIndex) || 0) * Number(stepSize);

  return readRows(
    db,
    `SELECT w.id, w.level, w.uz, w.reading, w.ru, w.image_url AS imageUrl,
            t.title AS topicTitle,
            wp.next_review AS nextReview
     FROM (
       SELECT id, topic_id, level, uz, reading, ru, image_url
       FROM words
       ORDER BY id ASC
       LIMIT ?
       OFFSET ?
     ) w
     JOIN topics t ON w.topic_id = t.id
     LEFT JOIN word_progress wp ON wp.word_id = w.id
     WHERE wp.next_review IS NULL OR wp.next_review <= ?
     ORDER BY COALESCE(wp.next_review, ?) ASC, w.id ASC
     LIMIT ?;`,
    [stepSize, offset, today, today, limit]
  );
}

export async function getWordQuiz(level, limit = 10) {
  const db = await getDb();
  return readRows(
    db,
    `SELECT id, level, uz, reading, ru, image_url AS imageUrl
     FROM words
     WHERE level = ?
     ORDER BY RANDOM()
     LIMIT ?;`,
    [level, limit]
  );
}

export async function getWordQuizByStep(stepIndex, stepSize = 20, limit = 10) {
  const db = await getDb();
  const offset = Math.max(0, Number(stepIndex) || 0) * Number(stepSize);
  return readRows(
    db,
    `SELECT id, level, uz, reading, ru, image_url AS imageUrl
     FROM (
       SELECT id, level, uz, reading, ru, image_url
       FROM words
       ORDER BY id ASC
       LIMIT ?
       OFFSET ?
     )
     ORDER BY RANDOM()
     LIMIT ?;`,
    [stepSize, offset, limit]
  );
}

export async function recordWordReview(wordId, score) {
  const db = await getDb();
  const today = toDateOnly();
  const rows = readRows(
    db,
    'SELECT easiness, interval_days AS intervalDays, repetitions FROM word_progress WHERE word_id = ?;',
    [wordId]
  );

  let easiness = 2.5;
  let intervalDays = 1;
  let repetitions = 0;

  if (rows.length > 0) {
    easiness = Number(rows[0].easiness);
    intervalDays = Number(rows[0].intervalDays);
    repetitions = Number(rows[0].repetitions);
  }

  if (score < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easiness));
    }
  }

  easiness = Math.max(
    1.3,
    easiness + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
  );

  const nextReview = plusDays(today, intervalDays);

  runPrepared(
    db,
    `INSERT INTO word_progress
      (word_id, easiness, interval_days, repetitions, next_review, last_score)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(word_id) DO UPDATE SET
      easiness = excluded.easiness,
      interval_days = excluded.interval_days,
      repetitions = excluded.repetitions,
      next_review = excluded.next_review,
      last_score = excluded.last_score;`,
    [wordId, easiness, intervalDays, repetitions, nextReview, score]
  );

  runPrepared(
    db,
    'INSERT INTO word_review_events (word_id, score, created_at) VALUES (?, ?, ?);',
    [wordId, score, new Date().toISOString()]
  );

  saveDb(db);

  return { nextReview, intervalDays, repetitions };
}

export async function getDashboardStats(level) {
  const db = await getDb();
  const today = toDateOnly();

  const [{ totalWordsLevel }] = readRows(
    db,
    'SELECT COUNT(*) AS totalWordsLevel FROM words WHERE level = ?;',
    [level]
  );

  const [{ learnedWordsLevel }] = readRows(
    db,
    `SELECT COUNT(*) AS learnedWordsLevel
     FROM words w
     JOIN word_progress wp ON wp.word_id = w.id
     WHERE w.level = ? AND wp.repetitions > 0;`,
    [level]
  );

  const [{ masteredWordsLevel }] = readRows(
    db,
    `SELECT COUNT(*) AS masteredWordsLevel
     FROM words w
     JOIN word_progress wp ON wp.word_id = w.id
     WHERE w.level = ? AND wp.repetitions >= 2;`,
    [level]
  );

  const [{ dueWordsLevel }] = readRows(
    db,
    `SELECT COUNT(*) AS dueWordsLevel
     FROM words w
     LEFT JOIN word_progress wp ON wp.word_id = w.id
     WHERE w.level = ?
       AND (wp.next_review IS NULL OR wp.next_review <= ?);`,
    [level, today]
  );

  const [{ learnedWordsTotal }] = readRows(
    db,
    'SELECT COUNT(*) AS learnedWordsTotal FROM word_progress WHERE repetitions > 0;'
  );

  const [{ masteredWordsTotal }] = readRows(
    db,
    'SELECT COUNT(*) AS masteredWordsTotal FROM word_progress WHERE repetitions >= 2;'
  );

  const [{ totalPhrases }] = readRows(db, 'SELECT COUNT(*) AS totalPhrases FROM cards;');

  const [{ learnedPhrases }] = readRows(
    db,
    'SELECT COUNT(*) AS learnedPhrases FROM progress WHERE repetitions > 0;'
  );

  const [{ masteredPhrases }] = readRows(
    db,
    'SELECT COUNT(*) AS masteredPhrases FROM progress WHERE repetitions >= 2;'
  );

  const [{ duePhrases }] = readRows(
    db,
    `SELECT COUNT(*) AS duePhrases
     FROM cards c
     LEFT JOIN progress p ON p.card_id = c.id
     WHERE p.next_review IS NULL OR p.next_review <= ?;`,
    [today]
  );

  const [{ quizSuccess }] = readRows(
    db,
    'SELECT COUNT(*) AS quizSuccess FROM word_quiz_results WHERE level = ? AND is_success = 1;',
    [level]
  );

  const [{ quizFail }] = readRows(
    db,
    'SELECT COUNT(*) AS quizFail FROM word_quiz_results WHERE level = ? AND is_success = 0;',
    [level]
  );

  const unlockRows = readRows(
    db,
    'SELECT level, SUM(is_success) AS successCount FROM word_quiz_results GROUP BY level;'
  );

  const levelRows = readRows(
    db,
    'SELECT DISTINCT level FROM words ORDER BY level ASC;'
  );

  const successMap = new Map(
    unlockRows.map((row) => [Number(row.level), Number(row.successCount)])
  );

  let unlockedLevel = levelRows.length ? Number(levelRows[0].level) : 1;
  for (let i = 0; i < levelRows.length; i += 1) {
    const current = Number(levelRows[i].level);
    if (i === 0) {
      unlockedLevel = current;
    }

    const next = levelRows[i + 1] ? Number(levelRows[i + 1].level) : current;
    if ((successMap.get(current) || 0) > 0) {
      unlockedLevel = next;
    } else {
      break;
    }
  }

  return {
    level: Number(level),
    words: {
      totalLevel: Number(totalWordsLevel),
      learnedLevel: Number(learnedWordsLevel),
      masteredLevel: Number(masteredWordsLevel),
      dueLevel: Number(dueWordsLevel),
      learnedTotal: Number(learnedWordsTotal),
      masteredTotal: Number(masteredWordsTotal)
    },
    phrases: {
      total: Number(totalPhrases),
      learned: Number(learnedPhrases),
      mastered: Number(masteredPhrases),
      due: Number(duePhrases)
    },
    quiz: {
      success: Number(quizSuccess),
      fail: Number(quizFail)
    },
    unlockedLevel: Number(unlockedLevel)
  };
}


export async function recordWordQuizResult(level, score, total) {
  const db = await getDb();
  const isSuccess = score === 10 && total === 10 ? 1 : 0;
  const createdAt = new Date().toISOString();

  runPrepared(
    db,
    'INSERT INTO word_quiz_results (level, score, total, is_success, created_at) VALUES (?, ?, ?, ?, ?);',
    [level, score, total, isSuccess, createdAt]
  );

  saveDb(db);

  return { isSuccess: Boolean(isSuccess) };
}

export async function recordWordStepQuizResult(stepIndex, score, total) {
  const db = await getDb();
  const isSuccess = score === 10 && total === 10 ? 1 : 0;
  const createdAt = new Date().toISOString();

  runPrepared(
    db,
    `INSERT INTO word_step_quiz_results
      (step_index, score, total, is_success, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [stepIndex, score, total, isSuccess, createdAt]
  );

  saveDb(db);
  return { isSuccess: Boolean(isSuccess) };
}

export async function getStepLearningStatus(stepSize = 20) {
  const db = await getDb();

  const wordRows = readRows(
    db,
    `SELECT w.id, COALESCE(wp.repetitions, 0) AS repetitions
     FROM words w
     LEFT JOIN word_progress wp ON wp.word_id = w.id
     ORDER BY w.id ASC;`
  );

  const quizRows = readRows(
    db,
    `SELECT step_index AS stepIndex, SUM(is_success) AS successCount
     FROM word_step_quiz_results
     GROUP BY step_index;`
  );

  const quizSuccessMap = new Map(quizRows.map((row) => [Number(row.stepIndex), Number(row.successCount || 0)]));
  const totalWords = wordRows.length;
  const totalSteps = Math.max(1, Math.ceil(totalWords / stepSize));
  const steps = [];

  for (let i = 0; i < totalSteps; i += 1) {
    const start = i * stepSize;
    const slice = wordRows.slice(start, start + stepSize);
    const total = slice.length;
    const learned = slice.filter((row) => Number(row.repetitions) > 0).length;
    const mastered = slice.filter((row) => Number(row.repetitions) >= 2).length;
    const quizSuccess = quizSuccessMap.get(i) || 0;
    const learnedPercent = total > 0 ? Math.round((learned / total) * 100) : 0;
    const masteredPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    const completed = total > 0 && learned === total && quizSuccess > 0;

    steps.push({
      stepIndex: i,
      total,
      learned,
      mastered,
      learnedPercent,
      masteredPercent,
      quizSuccess,
      completed
    });
  }

  const firstIncomplete = steps.find((step) => !step.completed);
  const activeStepIndex = firstIncomplete ? firstIncomplete.stepIndex : Math.max(0, totalSteps - 1);
  const completedSteps = steps.filter((step) => step.completed).length;

  return {
    stepSize: Number(stepSize),
    totalWords,
    totalSteps,
    activeStepIndex,
    completedSteps,
    steps
  };
}

export async function exportProgressBackup() {
  const db = await getDb();
  saveDb(db);

  const raw = localStorage.getItem(STORAGE_KEY);
  const bytes = raw ? JSON.parse(raw) : [];

  return {
    app: 'UzLang',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: bytes
  };
}

export async function getDailyGoalsStats() {
  const db = await getDb();
  const today = toDateOnly();
  const wordsTarget = 20;
  const perfectTestsTarget = 1;

  const [{ wordsDone }] = readRows(
    db,
    `SELECT COUNT(*) AS wordsDone
     FROM word_review_events
     WHERE substr(created_at, 1, 10) = ?;`,
    [today]
  );

  const [{ perfectTestsDone }] = readRows(
    db,
    `SELECT COUNT(*) AS perfectTestsDone
     FROM (
       SELECT is_success, created_at FROM word_quiz_results
       UNION ALL
       SELECT is_success, created_at FROM word_step_quiz_results
     )
     WHERE is_success = 1
       AND substr(created_at, 1, 10) = ?;`,
    [today]
  );

  const words = Number(wordsDone);
  const tests = Number(perfectTestsDone);
  const todayCompleted = words >= wordsTarget && tests >= perfectTestsTarget;

  const wordByDayRows = readRows(
    db,
    `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
     FROM word_review_events
     GROUP BY day
     ORDER BY day;`
  );

  const testsByDayRows = readRows(
    db,
    `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
     FROM (
       SELECT is_success, created_at FROM word_quiz_results
       UNION ALL
       SELECT is_success, created_at FROM word_step_quiz_results
     )
     WHERE is_success = 1
     GROUP BY day
     ORDER BY day;`
  );

  const wordsByDay = new Map(wordByDayRows.map((row) => [String(row.day), Number(row.count)]));
  const testsByDay = new Map(testsByDayRows.map((row) => [String(row.day), Number(row.count)]));

  const allDays = new Set([...wordsByDay.keys(), ...testsByDay.keys()]);
  const completedDays = new Set();
  allDays.forEach((day) => {
    const dayWords = wordsByDay.get(day) || 0;
    const dayTests = testsByDay.get(day) || 0;
    if (dayWords >= wordsTarget && dayTests >= perfectTestsTarget) {
      completedDays.add(day);
    }
  });

  let currentStreak = 0;
  for (let i = 0; i < 3650; i += 1) {
    const day = toDateOnly(addDays(new Date(today), -i));
    if (completedDays.has(day)) {
      currentStreak += 1;
      continue;
    }
    break;
  }

  let longestStreak = 0;
  let running = 0;
  if (allDays.size > 0) {
    const sortedDays = Array.from(allDays).sort();
    const firstDay = sortedDays[0];
    for (let cursor = new Date(firstDay); toDateOnly(cursor) <= today; cursor = addDays(cursor, 1)) {
      const dayKey = toDateOnly(cursor);
      if (completedDays.has(dayKey)) {
        running += 1;
        if (running > longestStreak) {
          longestStreak = running;
        }
      } else {
        running = 0;
      }
    }
  }

  const streakMilestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone =
    streakMilestones.find((value) => value > currentStreak) || streakMilestones[streakMilestones.length - 1];
  const streakProgressPercent = Math.min(
    100,
    Math.round((Math.max(0, currentStreak) / Math.max(1, nextMilestone)) * 100)
  );

  return {
    date: today,
    wordsTarget,
    wordsDone: words,
    wordsCompleted: words >= wordsTarget,
    perfectTestsTarget,
    perfectTestsDone: tests,
    perfectTestsCompleted: tests >= perfectTestsTarget,
    allCompleted: todayCompleted,
    streak: {
      current: currentStreak,
      longest: longestStreak,
      nextMilestone,
      progressPercent: streakProgressPercent
    }
  };
}

export async function getProgressCharts(days = 14, weeks = 8) {
  const db = await getDb();
  const dayRange = getRecentDateRange(days);
  const fromDay = dayRange[0];

  const dailyRows = readRows(
    db,
    `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
     FROM word_review_events
     WHERE substr(created_at, 1, 10) >= ?
     GROUP BY day
     ORDER BY day;`,
    [fromDay]
  );

  const dailyMap = new Map(dailyRows.map((row) => [String(row.day), Number(row.count)]));
  const dailyReviews = dayRange.map((day) => ({
    day,
    label: day.slice(5),
    count: dailyMap.get(day) || 0
  }));

  const recentWeeks = getRecentIsoWeeks(weeks);
  const fromWeekDate = recentWeeks[0]?.startDate || toDateOnly();
  const weeklyRows = readRows(
    db,
    `SELECT created_at
     FROM (
       SELECT is_success, created_at FROM word_quiz_results
       UNION ALL
       SELECT is_success, created_at FROM word_step_quiz_results
     )
     WHERE is_success = 1 AND substr(created_at, 1, 10) >= ?;`,
    [fromWeekDate]
  );

  const weeklyMap = new Map();
  weeklyRows.forEach((row) => {
    const date = new Date(String(row.created_at));
    const key = toIsoWeekKey(date);
    weeklyMap.set(key, (weeklyMap.get(key) || 0) + 1);
  });

  const weeklyPerfectTests = recentWeeks.map((week) => ({
    weekKey: week.key,
    label: week.label,
    count: weeklyMap.get(week.key) || 0
  }));

  const stepStatus = await getStepLearningStatus(20);
  const levelProgress = stepStatus.steps.map((step) => ({
    level: step.stepIndex + 1,
    total: step.total,
    learned: step.learned,
    mastered: step.mastered,
    learnedPercent: step.learnedPercent,
    masteredPercent: step.masteredPercent
  }));

  return {
    dailyReviews,
    weeklyPerfectTests,
    levelProgress
  };
}

export async function importProgressBackup(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Неверный формат файла');
  }

  if (payload.app !== 'UzLang' || payload.version !== 1) {
    throw new Error('Файл не является бэкапом UzLang v1');
  }

  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error('В файле нет данных прогресса');
  }

  const values = payload.data;
  if (!values.every((value) => Number.isInteger(value) && value >= 0 && value <= 255)) {
    throw new Error('Поврежденные данные прогресса');
  }

  const SQL = await getSql();
  const db = new SQL.Database(Uint8Array.from(values));

  const requiredTables = [
    'topics',
    'cards',
    'progress',
    'words',
    'word_progress',
    'word_quiz_results'
  ];

  const tableRows = db.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table';"
  );

  const found = new Set();
  if (tableRows.length > 0) {
    const names = tableRows[0].values || [];
    names.forEach((row) => {
      if (Array.isArray(row) && row[0]) {
        found.add(String(row[0]));
      }
    });
  }

  const missing = requiredTables.filter((name) => !found.has(name));
  db.close();

  if (missing.length > 0) {
    throw new Error('В бэкапе отсутствуют обязательные таблицы: ' + missing.join(', '));
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  dbInstance = null;
}
