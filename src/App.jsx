import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import {
  getCardsByTopic,
  getDailyGoalsStats,
  getProgressCharts,
  exportProgressBackup,
  getDashboardStats,
  getDueCards,
  getDueWordsByStep,
  getQuizCards,
  getStepLearningStatus,
  getTopics,
  getWordQuizByStep,
  getWordStats,
  getWordsByStep,
  importProgressBackup,
  recordReview,
  recordWordStepQuizResult,
  recordWordReview
} from './db/sqlite';

const AUTO_BACKUP_INDEX_KEY = 'uzlang-auto-backup-index-v1';
const AUTO_BACKUP_PREFIX = 'uzlang-auto-backup-v1-';
const LAST_AUTO_BACKUP_DATE_KEY = 'uzlang-last-auto-backup-date-v1';
const LAST_MANUAL_EXPORT_DATE_KEY = 'uzlang-last-manual-export-date-v1';
const LAST_BACKUP_REMINDER_DATE_KEY = 'uzlang-last-backup-reminder-date-v1';
const STEP_SIZE = 20;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOptions(correctAnswer, pool) {
  const options = new Set([correctAnswer]);
  const candidates = shuffle(pool.filter((item) => item !== correctAnswer));
  for (let i = 0; i < candidates.length && options.size < 4; i += 1) {
    options.add(candidates[i]);
  }
  while (options.size < 4) {
    options.add('Не знаю');
  }
  return shuffle(Array.from(options));
}

function tokenizeUzText(text) {
  return (text.match(/[A-Za-z\u00c0-\u024f\u0400-\u04ffʻ’'`-]+/g) || []).map((item) =>
    item.trim()
  );
}

function normalizeUzToken(token) {
  return token
    .toLowerCase()
    .replace(/[’`]/g, 'ʻ')
    .replace(/[^a-z\u00c0-\u024f\u0400-\u04ffʻ'-]/g, '');
}

function normalizeUzPhrase(text) {
  return tokenizeUzText(text).map(normalizeUzToken).join(' ');
}

function pickMissingWordIndex(words) {
  const preferred = words
    .map((word, index) => ({ word, index }))
    .filter((item) => normalizeUzToken(item.word).length > 2);

  if (preferred.length > 0) {
    return preferred[Math.floor(Math.random() * preferred.length)].index;
  }
  return Math.max(0, words.length - 1);
}

function buildPhraseQuizItem(card, type, pool) {
  if (type === 'translate') {
    return {
      type,
      card,
      options: buildOptions(card.ru, pool)
    };
  }

  const phraseWords = tokenizeUzText(card.exampleUz || card.uz);
  if (phraseWords.length < 2) {
    return {
      type: 'translate',
      card,
      options: buildOptions(card.ru, pool)
    };
  }

  if (type === 'assemble') {
    return {
      type,
      card,
      pieces: shuffle(
        phraseWords.map((word, index) => ({
          id: card.id + '-w-' + index,
          word
        }))
      ),
      correctWords: phraseWords
    };
  }

  const missingIndex = pickMissingWordIndex(phraseWords);
  return {
    type: 'missing',
    card,
    missingWord: phraseWords[missingIndex],
    maskedPhrase: phraseWords
      .map((word, index) => (index === missingIndex ? '____' : word))
      .join(' ')
  };
}

function getRank(score) {
  if (score >= 50000) return 'Наставник (Ustoz)';
  if (score >= 20000) return 'Мастер (Usta)';
  if (score >= 8000) return 'Активный (Faol)';
  if (score >= 2000) return 'Ученик (O‘rganuvchi)';
  return 'Новичок (Boshlovchi)';
}

function dateDiffInDays(fromDate, toDate) {
  const from = new Date(fromDate + 'T00:00:00');
  const to = new Date(toDate + 'T00:00:00');
  return Math.floor((to.getTime() - from.getTime()) / 86400000);
}

function MiniBarChart({
  title,
  subtitle,
  data,
  valueKey = 'count',
  labelKey = 'label',
  color = 'primary.main',
  yMax = null
}) {
  const values = data.map((item) => Number(item[valueKey] || 0));
  const maxValue = yMax || Math.max(1, ...values);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle1">{title}</Typography>
        {subtitle ? (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}

        <Stack direction="row" alignItems="flex-end" spacing={0.5} sx={{ minHeight: 120 }}>
          {data.map((item) => {
            const value = Number(item[valueKey] || 0);
            const barHeight = Math.max(6, Math.round((value / maxValue) * 100));
            return (
              <Tooltip key={String(item[labelKey])} title={`${item[labelKey]}: ${value}`}>
                <Stack spacing={0.4} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 18,
                      height: `${barHeight}px`,
                      borderRadius: 0.75,
                      bgcolor: color
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {item[labelKey]}
                  </Typography>
                </Stack>
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}

function StepProgressPanel({ steps, activeStepIndex }) {
  const activeStep = steps[activeStepIndex] || null;

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={1.25}>
        <Typography variant="subtitle1">Освоение по шагам</Typography>
        <Typography variant="caption" color="text.secondary">
          Компактная карта шагов без числовой шкалы
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(34px, 1fr))',
            gap: 0.6
          }}
        >
          {steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const bgColor = step.completed
              ? 'success.main'
              : isActive
                ? 'warning.main'
                : step.masteredPercent >= 50
                  ? 'info.main'
                  : 'grey.400';

            return (
              <Tooltip
                key={`step-cell-${index}`}
                title={`Шаг ${index + 1}: ${step.masteredPercent}% • тест 10/10: ${
                  step.quizSuccess > 0 ? 'да' : 'нет'
                }`}
              >
                <Box
                  sx={{
                    height: 30,
                    borderRadius: 1,
                    bgcolor: bgColor,
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    border: isActive ? '2px solid rgba(0,0,0,0.45)' : '1px solid rgba(0,0,0,0.12)'
                  }}
                >
                  {index + 1}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {activeStep ? (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="body2">
              Текущий шаг {activeStepIndex + 1}: освоено {activeStep.masteredPercent}% • тест 10/10:{' '}
              {activeStep.quizSuccess > 0 ? 'да' : 'нет'}
            </Typography>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
}

function StudyCard({ item, reveal, canSpeak, onSpeakText, isWord = false }) {
  if (!item) {
    return null;
  }

  return (
    <Card elevation={2}>
      {item.imageUrl ? (
        <CardMedia
          component="img"
          image={item.imageUrl}
          alt="Тема карточки"
          sx={{ height: 170, objectFit: 'cover' }}
        />
      ) : null}
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">{item.uz}</Typography>
            {canSpeak ? (
              <Tooltip title="Озвучить">
                <IconButton color="primary" onClick={() => onSpeakText(item.reading || item.uz)}>
                  <VolumeUpRoundedIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>

          <Typography color="text.secondary">{item.reading}</Typography>

          {reveal ? <Typography variant="h6">{item.ru}</Typography> : null}

          {!isWord && reveal ? (
            <>
              <Divider />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{item.exampleUz}</Typography>
                {canSpeak ? (
                  <Tooltip title="Озвучить пример">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onSpeakText(item.exampleReading || item.exampleUz)}
                    >
                      <VolumeUpRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Stack>
              <Typography color="text.secondary">{item.exampleRu}</Typography>
            </>
          ) : null}

          {isWord ? (
            <Typography variant="body2" color="text.secondary">
              {item.topicTitle ? `Тема: ${item.topicTitle}` : 'Слово шага'}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function App({ colorMode = "light", onToggleColorMode = () => {} }) {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('words');
  const [helpOpen, setHelpOpen] = useState(false);
  const [backupReminderOpen, setBackupReminderOpen] = useState(false);
  const [autoBackupStatus, setAutoBackupStatus] = useState({ date: '', count: 0 });
  const importInputRef = useRef(null);
  const skipFirstWordSyncRef = useRef(true);

  const [phraseTab, setPhraseTab] = useState(0);
  const [wordTab, setWordTab] = useState(0);

  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState(null);

  const [lessonCards, setLessonCards] = useState([]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [dueCards, setDueCards] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [phraseQuizItems, setPhraseQuizItems] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [assembleAnswerIds, setAssembleAnswerIds] = useState([]);
  const [missingWordInput, setMissingWordInput] = useState('');
  const [phraseQuizMistakes, setPhraseQuizMistakes] = useState([]);
  const [phraseMistakeReviewMode, setPhraseMistakeReviewMode] = useState(false);

  const [wordStats, setWordStats] = useState({ total: 0, byLevel: [] });
  const [stepStatus, setStepStatus] = useState({
    stepSize: STEP_SIZE,
    totalWords: 0,
    totalSteps: 1,
    activeStepIndex: 0,
    completedSteps: 0,
    steps: []
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [dashboard, setDashboard] = useState({
    level: 1,
    words: {
      totalLevel: 0,
      learnedLevel: 0,
      masteredLevel: 0,
      dueLevel: 0,
      learnedTotal: 0,
      masteredTotal: 0
    },
    phrases: {
      total: 0,
      learned: 0,
      mastered: 0,
      due: 0
    },
    quiz: {
      success: 0,
      fail: 0
    },
    unlockedLevel: 1
  });
  const [dailyGoals, setDailyGoals] = useState({
    date: '',
    wordsTarget: 20,
    wordsDone: 0,
    wordsCompleted: false,
    perfectTestsTarget: 1,
    perfectTestsDone: 0,
    perfectTestsCompleted: false,
    allCompleted: false,
    streak: {
      current: 0,
      longest: 0,
      nextMilestone: 3,
      progressPercent: 0
    }
  });
  const [progressCharts, setProgressCharts] = useState({
    dailyReviews: [],
    weeklyPerfectTests: [],
    levelProgress: []
  });
  const [chartDays, setChartDays] = useState(14);
  const [chartWeeks, setChartWeeks] = useState(8);

  const [wordCards, setWordCards] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [dueWords, setDueWords] = useState([]);
  const [dueWordIndex, setDueWordIndex] = useState(0);
  const [wordQuizItems, setWordQuizItems] = useState([]);
  const [wordQuizIndex, setWordQuizIndex] = useState(0);
  const [wordQuizScore, setWordQuizScore] = useState(0);
  const [wordQuizDone, setWordQuizDone] = useState(false);
  const [wordQuizMistakes, setWordQuizMistakes] = useState([]);
  const [wordMistakeReviewMode, setWordMistakeReviewMode] = useState(false);
  const [wordQuizCelebration, setWordQuizCelebration] = useState(null);

  const canSpeak =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function';

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === topicId),
    [topics, topicId]
  );

  const activeLessonCard = lessonCards[lessonIndex];
  const activeDueCard = dueCards[reviewIndex];
  const activePhraseQuizItem = phraseQuizItems[quizIndex];

  const activeWordCard = wordCards[wordIndex];
  const activeDueWord = dueWords[dueWordIndex];
  const activeWordQuiz = wordQuizItems[wordQuizIndex];
  const currentStep = stepStatus.steps[activeStepIndex] || null;
  const maxSelectableStepIndex = Math.min(
    Math.max(0, stepStatus.totalSteps - 1),
    stepStatus.completedSteps
  );

  const learnedWordsTotal = dashboard.words.learnedTotal;
  const masteredWordsTotal = dashboard.words.masteredTotal;
  const currentStepLearnedPercent = currentStep ? currentStep.learnedPercent : 0;

  const stepQuizPassedCount = stepStatus.steps.filter((step) => step.quizSuccess > 0).length;
  const score =
    stepStatus.completedSteps * 500 +
    stepQuizPassedCount * 120 +
    (currentStep?.learnedPercent || 0) * 4;

  const rank = getRank(score);
  const earnedRewards = [
    ...(stepStatus.completedSteps >= 1 ? ['Step 1 complete'] : []),
    ...(stepStatus.completedSteps >= 3 ? ['Step 3 complete'] : []),
    ...(stepStatus.completedSteps >= 7 ? ['Step 7 complete'] : []),
    ...(stepStatus.completedSteps >= 14 ? ['Step 14 complete'] : []),
    ...(dailyGoals.streak.current >= 3 ? ['Streak 3'] : []),
    ...(dailyGoals.streak.current >= 7 ? ['Streak 7'] : []),
    ...(dailyGoals.streak.current >= 14 ? ['Streak 14'] : [])
  ];

  function speakText(text) {
    if (!canSpeak || !text) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('uz'));
    if (uzVoice) {
      utterance.voice = uzVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

  async function handleExportProgress() {
    try {
      const backup = await exportProgressBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const fileName = 'uzlang-progress-' + new Date().toISOString().slice(0, 10) + '.json';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      localStorage.setItem(LAST_MANUAL_EXPORT_DATE_KEY, new Date().toISOString().slice(0, 10));
      localStorage.setItem(LAST_BACKUP_REMINDER_DATE_KEY, new Date().toISOString().slice(0, 10));
    } catch (error) {
      alert('Не удалось экспортировать прогресс: ' + error.message);
    }
  }

  async function ensureAutoBackupAndReminder() {
    const today = new Date().toISOString().slice(0, 10);
    const lastAutoBackupDate = localStorage.getItem(LAST_AUTO_BACKUP_DATE_KEY);
    let index;

    try {
      index = JSON.parse(localStorage.getItem(AUTO_BACKUP_INDEX_KEY) || '[]');
      if (!Array.isArray(index)) {
        index = [];
      }
    } catch {
      index = [];
    }

    if (lastAutoBackupDate !== today) {
      try {
        const backup = await exportProgressBackup();
        const key = AUTO_BACKUP_PREFIX + today;
        localStorage.setItem(key, JSON.stringify(backup));

        const nextIndex = [today, ...index.filter((item) => item !== today)].slice(0, 14);
        const obsolete = index.filter((item) => !nextIndex.includes(item));
        obsolete.forEach((item) => localStorage.removeItem(AUTO_BACKUP_PREFIX + item));

        localStorage.setItem(AUTO_BACKUP_INDEX_KEY, JSON.stringify(nextIndex));
        localStorage.setItem(LAST_AUTO_BACKUP_DATE_KEY, today);
        index = nextIndex;
      } catch {
        // Ignore auto-backup failures to avoid blocking the main flow.
      }
    }

    setAutoBackupStatus({
      date: localStorage.getItem(LAST_AUTO_BACKUP_DATE_KEY) || '',
      count: index.length
    });

    const lastManualExportDate = localStorage.getItem(LAST_MANUAL_EXPORT_DATE_KEY);
    const lastReminderDate = localStorage.getItem(LAST_BACKUP_REMINDER_DATE_KEY);
    const shouldRemind =
      !lastManualExportDate ||
      dateDiffInDays(lastManualExportDate, today) >= 3;

    if (shouldRemind && lastReminderDate !== today) {
      setBackupReminderOpen(true);
    }
  }

  async function handleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      await importProgressBackup(payload);
      alert('Прогресс импортирован. Страница будет обновлена.');
      window.location.reload();
    } catch (error) {
      alert('Ошибка импорта: ' + error.message);
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  }

  function triggerImport() {
    if (importInputRef.current) {
      importInputRef.current.click();
    }
  }

  async function refreshDashboard(level) {
    const data = await getDashboardStats(level);
    setDashboard(data);
  }

  async function refreshDailyGoals() {
    const data = await getDailyGoalsStats();
    setDailyGoals(data);
  }

  async function refreshStepProgram(options = {}) {
    const { preserveActiveStep = false } = options;
    const data = await getStepLearningStatus(STEP_SIZE);
    setStepStatus(data);
    if (preserveActiveStep) {
      setActiveStepIndex((prev) => {
        const maxIndex = Math.max(0, data.totalSteps - 1);
        return Math.min(Math.max(0, prev), maxIndex);
      });
    } else {
      setActiveStepIndex(data.activeStepIndex);
    }
    return data;
  }

  const refreshProgressCharts = useCallback(async (days = chartDays, weeks = chartWeeks) => {
    const data = await getProgressCharts(days, weeks);
    setProgressCharts(data);
  }, [chartDays, chartWeeks]);

  async function refreshDueCards() {
    const items = await getDueCards(30);
    setDueCards(items);
    setReviewIndex(0);
  }

  function resolveAvailableTopicId(topicRows, currentId = null) {
    const current = topicRows.find((topic) => topic.id === currentId);
    if (current && current.unlocked) {
      return current.id;
    }
    const firstUnlocked = topicRows.find((topic) => topic.unlocked);
    return firstUnlocked ? firstUnlocked.id : null;
  }

  async function loadTopicCards(id) {
    const cards = await getCardsByTopic(id);
    setLessonCards(cards);
    setLessonIndex(0);
  }

  async function startPhraseQuiz(id) {
    const cards = await getQuizCards(id, 10);
    const pool = cards.map((card) => card.ru);
    const questionTypes = ['translate', 'assemble', 'missing'];
    const items = cards.map((card, index) =>
      buildPhraseQuizItem(card, questionTypes[index % questionTypes.length], pool)
    );
    setPhraseQuizItems(items);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
    setAssembleAnswerIds([]);
    setMissingWordInput('');
    setPhraseQuizMistakes([]);
    setPhraseMistakeReviewMode(false);
  }

  async function refreshDueWords(stepIndex) {
    const items = await getDueWordsByStep(stepIndex, STEP_SIZE, 30);
    setDueWords(items);
    setDueWordIndex(0);
    return items;
  }

  async function restartStepReview(stepIndex) {
    const words = await getWordsByStep(stepIndex, STEP_SIZE);
    setDueWords(words);
    setDueWordIndex(0);
  }

  async function startWordQuiz(stepIndex, wordsPool = null) {
    const cards = await getWordQuizByStep(stepIndex, STEP_SIZE, 10);
    const poolRows = wordsPool || await getWordsByStep(stepIndex, STEP_SIZE);
    const pool = poolRows.map((item) => item.ru);
    const items = cards.map((card) => ({
      ...card,
      options: buildOptions(card.ru, pool)
    }));

    setWordQuizItems(items);
    setWordQuizIndex(0);
    setWordQuizScore(0);
    setWordQuizDone(false);
    setWordQuizMistakes([]);
    setWordMistakeReviewMode(false);
    setWordQuizCelebration(null);
  }

  const syncStepSession = useCallback(async (stepIndex) => {
    const words = await getWordsByStep(stepIndex, STEP_SIZE);
    setWordCards(words);
    setWordIndex(0);

    const dueItems = await getDueWordsByStep(stepIndex, STEP_SIZE, 30);
    setDueWords(dueItems);
    setDueWordIndex(0);

    const cards = await getWordQuizByStep(stepIndex, STEP_SIZE, 10);
    const pool = words.map((item) => item.ru);
    const items = cards.map((card) => ({
      ...card,
      options: buildOptions(card.ru, pool)
    }));

    setWordQuizItems(items);
    setWordQuizIndex(0);
    setWordQuizScore(0);
    setWordQuizDone(false);
    setWordQuizMistakes([]);
    setWordMistakeReviewMode(false);
  }, []);

  useEffect(() => {
    async function init() {
      const [topicRows, stats] = await Promise.all([getTopics(), getWordStats()]);
      setTopics(topicRows);
      setWordStats(stats);

      const firstAvailableTopicId = resolveAvailableTopicId(topicRows);
      if (firstAvailableTopicId) {
        setTopicId(firstAvailableTopicId);
        await loadTopicCards(firstAvailableTopicId);
        await startPhraseQuiz(firstAvailableTopicId);
      } else {
        setTopicId(null);
        setLessonCards([]);
        setPhraseQuizItems([]);
      }

      await refreshDueCards();
      const initialStep = await refreshStepProgram();
      await syncStepSession(initialStep.activeStepIndex);
      await refreshDashboard(1);
      await refreshDailyGoals();
      const initialCharts = await getProgressCharts(14, 8);
      setProgressCharts(initialCharts);
      await ensureAutoBackupAndReminder();
      setLoading(false);
    }

    init();

    return () => {
      if (canSpeak) {
        window.speechSynthesis.cancel();
      }
    };
  }, [canSpeak, syncStepSession]);

  useEffect(() => {
    if (!topicId) {
      return;
    }
    const selected = topics.find((topic) => topic.id === topicId);
    if (!selected || !selected.unlocked) {
      return;
    }
    loadTopicCards(topicId);
    startPhraseQuiz(topicId);
  }, [topicId, topics]);

  useEffect(() => {
    if (topics.length === 0) {
      return;
    }
    const nextTopicId = resolveAvailableTopicId(topics, topicId);
    if (nextTopicId !== topicId) {
      setTopicId(nextTopicId);
    }
  }, [topics, topicId]);

  useEffect(() => {
    if (loading) {
      return;
    }
    refreshProgressCharts(chartDays, chartWeeks);
  }, [loading, chartDays, chartWeeks, refreshProgressCharts]);

  useEffect(() => {
    if (skipFirstWordSyncRef.current) {
      skipFirstWordSyncRef.current = false;
      return;
    }

    async function syncWords() {
      await syncStepSession(activeStepIndex);
      await refreshDashboard(1);
    }

    syncWords();
  }, [activeStepIndex, refreshProgressCharts, syncStepSession]);

  async function handleReview(scoreValue) {
    if (!activeDueCard) {
      return;
    }
    await recordReview(activeDueCard.id, scoreValue);
    const next = reviewIndex + 1;
    if (next < dueCards.length) {
      setReviewIndex(next);
    } else {
      await refreshDueCards();
    }
    await refreshDashboard(1);
    await refreshDailyGoals();
    await refreshProgressCharts();
  }

  async function handleWordReview(scoreValue) {
    if (!activeDueWord) {
      return;
    }
    await recordWordReview(activeDueWord.id, scoreValue);
    const next = dueWordIndex + 1;
    if (next < dueWords.length) {
      setDueWordIndex(next);
    } else {
      await refreshDueWords(activeStepIndex);
    }
    await refreshDashboard(1);
    await refreshDailyGoals();
    await refreshProgressCharts();
    await refreshStepProgram({ preserveActiveStep: true });
    const refreshedTopics = await getTopics();
    setTopics(refreshedTopics);
  }

  function addPhraseMistake(item, userAnswer) {
    if (!item) {
      return;
    }

    const prompt = item.type === 'translate' ? item.card.uz : item.card.exampleRu;
    const correctAnswer =
      item.type === 'translate'
        ? item.card.ru
        : item.type === 'assemble'
          ? item.correctWords.join(' ')
          : item.missingWord;

    setPhraseQuizMistakes((prev) => [
      ...prev,
      {
        id: item.card.id + '-' + item.type + '-' + quizIndex,
        type: item.type,
        prompt,
        correctAnswer,
        userAnswer: userAnswer || '—'
      }
    ]);
  }

  function handlePhraseQuizAnswer(correct, userAnswer = '') {
    if (!correct) {
      addPhraseMistake(activePhraseQuizItem, userAnswer);
    }

    const nextScore = correct ? quizScore + 1 : quizScore;
    setQuizScore(nextScore);

    if (quizIndex + 1 >= phraseQuizItems.length) {
      setQuizDone(true);
      return;
    }

    setQuizIndex((index) => index + 1);
    setAssembleAnswerIds([]);
    setMissingWordInput('');
  }

  function addAssembleWord(id) {
    setAssembleAnswerIds((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }

  function removeAssembleWord(id) {
    setAssembleAnswerIds((prev) => prev.filter((item) => item !== id));
  }

  function resetAssembleAnswer() {
    setAssembleAnswerIds([]);
  }

  function submitAssembleAnswer() {
    if (!activePhraseQuizItem || activePhraseQuizItem.type !== 'assemble') {
      return;
    }

    const byId = new Map(activePhraseQuizItem.pieces.map((piece) => [piece.id, piece.word]));
    const answer = assembleAnswerIds.map((id) => byId.get(id)).filter(Boolean).join(' ');
    const expected = activePhraseQuizItem.correctWords.join(' ');
    handlePhraseQuizAnswer(normalizeUzPhrase(answer) === normalizeUzPhrase(expected), answer);
  }

  function submitMissingWordAnswer() {
    if (!activePhraseQuizItem || activePhraseQuizItem.type !== 'missing') {
      return;
    }
    const userWord = normalizeUzToken(missingWordInput);
    const expectedWord = normalizeUzToken(activePhraseQuizItem.missingWord);
    handlePhraseQuizAnswer(Boolean(userWord) && userWord === expectedWord, missingWordInput);
  }

  async function handleWordQuizAnswer(correct, selectedOption = '') {
    if (!correct && activeWordQuiz) {
      setWordQuizMistakes((prev) => [
        ...prev,
        {
          id: activeWordQuiz.id + '-' + wordQuizIndex,
          prompt: activeWordQuiz.uz,
          correctAnswer: activeWordQuiz.ru,
          userAnswer: selectedOption || '—'
        }
      ]);
    }

    const nextScore = correct ? wordQuizScore + 1 : wordQuizScore;
    const isLast = wordQuizIndex + 1 >= wordQuizItems.length;

    setWordQuizScore(nextScore);

    if (isLast) {
      const total = wordQuizItems.length || 10;
      const previousUnlockedTopicIds = new Set(topics.filter((topic) => topic.unlocked).map((topic) => topic.id));

      setWordQuizDone(true);
      await recordWordStepQuizResult(activeStepIndex, nextScore, total);
      await refreshDashboard(1);
      await refreshDailyGoals();
      await refreshProgressCharts();
      const nextProgram = await refreshStepProgram({ preserveActiveStep: true });
      const refreshedTopics = await getTopics();
      setTopics(refreshedTopics);

      if (nextScore === total) {
        const unlockedTopics = refreshedTopics.filter((topic) => topic.unlocked);
        const newlyUnlockedTopics = unlockedTopics.filter(
          (topic) => !previousUnlockedTopicIds.has(topic.id)
        );

        setWordQuizCelebration({
          completedSteps: nextProgram.completedSteps,
          newlyUnlockedTitles: newlyUnlockedTopics.map((topic) => topic.title),
          unlockedTitles: unlockedTopics.map((topic) => topic.title)
        });
      } else {
        setWordQuizCelebration(null);
      }

      return;
    }

    setWordQuizIndex((index) => index + 1);
  }

  if (loading) {
    return (
      <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Container maxWidth="md">
          <Box
            py={1.5}
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            gap={1}
          >
            <Stack spacing={0.25}>
              <Typography variant="h6" lineHeight={1.1}>
                UzLang
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                Самоучитель узбекского языка
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  textAlign: { xs: 'left', sm: 'right' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Сначала слова, потом фразы:<br />
                короткие повторения каждый день
              </Typography>
              <IconButton
                size="small"
                color="inherit"
                onClick={onToggleColorMode}
                sx={{ mt: { xs: 0.25, sm: 0 }, ml: { xs: 0, sm: 0.5 } }}
              >
                {colorMode === 'dark' ? (
                  <LightModeRoundedIcon fontSize="small" />
                ) : (
                  <DarkModeRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  value={mode}
                  onChange={(_, value) => {
                    if (value) {
                      setMode(value);
                    }
                  }}
                >
                  <ToggleButton value="words">Слова</ToggleButton>
                  <ToggleButton value="phrases">Фразы</ToggleButton>
                </ToggleButtonGroup>

                {mode === 'words' ? (
                  <>
                    <Chip label={`Слов в базе: ${wordStats.total}`} color="secondary" />
                    <Chip
                      label={`Шаг ${activeStepIndex + 1} / ${stepStatus.totalSteps}`}
                      color="primary"
                    />
                  </>
                ) : null}
              </Stack>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: { xs: 'nowrap', sm: 'wrap' },
                  gap: 1,
                  justifyContent: { xs: 'stretch', sm: 'flex-end' }
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleExportProgress}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Экспорт прогресса
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={triggerImport}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Импорт прогресса
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setHelpOpen(true)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Как заниматься
                </Button>

              </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Авто-бэкап: {autoBackupStatus.date || 'нет'} • локальных копий: {autoBackupStatus.count}
            </Typography>
          </Paper>

          {mode === 'phrases' ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Темы фраз
                  </Typography>
                  <Stack spacing={1}>
                    {topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant={topic.id === topicId ? 'contained' : 'outlined'}
                        disabled={!topic.unlocked}
                        onClick={() => {
                          if (topic.unlocked) {
                            setTopicId(topic.id);
                          }
                        }}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        {topic.unlocked
                          ? topic.title
                          : `${topic.title} (${topic.learnedWords}/${topic.totalWords})`}
                      </Button>
                    ))}
                  </Stack>
                  {topics.some((topic) => !topic.unlocked) ? (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Тема откроется после изучения всех слов этой темы.
                    </Typography>
                  ) : null}
                  {selectedTopic ? (
                    <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                      {selectedTopic.description}
                    </Typography>
                  ) : null}
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 2 }}>
                  {!topicId ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Пока нет доступных тем фраз. Сначала пройдите слова текущего шага.
                    </Alert>
                  ) : (
                    <>
                      <Tabs
                        value={phraseTab}
                        onChange={(_, value) => setPhraseTab(value)}
                        variant="fullWidth"
                      >
                        <Tab label="Учить" />
                        <Tab label="Повторить" />
                        <Tab label="Тест" />
                      </Tabs>

                      <Box sx={{ mt: 2 }}>
                    {phraseTab === 0 ? (
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip label={`${lessonIndex + 1} / ${lessonCards.length || 1}`} />
                          <Button onClick={() => setShowTranslation((v) => !v)}>
                            {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
                          </Button>
                        </Stack>

                        <StudyCard
                          item={activeLessonCard}
                          reveal={showTranslation}
                          canSpeak={canSpeak}
                          onSpeakText={speakText}
                        />

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            disabled={lessonIndex === 0}
                            onClick={() => {
                              setLessonIndex((i) => Math.max(0, i - 1));
                            }}
                          >
                            Назад
                          </Button>
                          <Button
                            variant="contained"
                            disabled={lessonCards.length === 0}
                            onClick={() => {
                              setLessonIndex((i) =>
                                lessonCards.length === 0
                                  ? 0
                                  : Math.min(lessonCards.length - 1, i + 1)
                              );
                            }}
                          >
                            Дальше
                          </Button>
                        </Stack>
                      </Stack>
                    ) : null}

                    {phraseTab === 1 ? (
                      <Stack spacing={2}>
                        <Typography variant="subtitle1">
                          Карточек к повторению: {dueCards.length}
                        </Typography>

                        {activeDueCard ? (
                          <>
                            <StudyCard
                              item={activeDueCard}
                              reveal
                              canSpeak={canSpeak}
                              onSpeakText={speakText}
                            />
                            <Typography color="text.secondary">Насколько легко вспомнили?</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button color="error" variant="outlined" onClick={() => handleReview(1)}>
                                Тяжело
                              </Button>
                              <Button
                                color="warning"
                                variant="outlined"
                                onClick={() => handleReview(3)}
                              >
                                Нормально
                              </Button>
                              <Button
                                color="success"
                                variant="contained"
                                onClick={() => handleReview(5)}
                              >
                                Легко
                              </Button>
                            </Stack>
                          </>
                        ) : (
                          <Alert severity="success">Сегодня всё повторено. Отлично.</Alert>
                        )}
                      </Stack>
                    ) : null}

                    {phraseTab === 2 ? (
                      <Stack spacing={2}>
                        {!quizDone && activePhraseQuizItem ? (
                          <>
                            <Chip label={`Вопрос ${quizIndex + 1} / ${phraseQuizItems.length || 1}`} />

                            {activePhraseQuizItem.type === 'translate' ? (
                              <>
                                <StudyCard
                                  item={activePhraseQuizItem.card}
                                  reveal={false}
                                  canSpeak={canSpeak}
                                  onSpeakText={speakText}
                                />
                                <Typography>Что это значит?</Typography>
                                <Stack spacing={1}>
                                  {activePhraseQuizItem.options.map((option) => (
                                    <Button
                                      key={option}
                                      variant="outlined"
                                      onClick={() =>
                                        handlePhraseQuizAnswer(
                                          option === activePhraseQuizItem.card.ru,
                                          option
                                        )
                                      }
                                      sx={{ justifyContent: 'flex-start' }}
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </Stack>
                              </>
                            ) : null}

                            {activePhraseQuizItem.type === 'assemble' ? (
                              <Stack spacing={1.5}>
                                <Typography color="text.secondary">
                                  Соберите фразу на узбекском по переводу:
                                </Typography>
                                <Alert severity="info">{activePhraseQuizItem.card.exampleRu}</Alert>

                                <Paper variant="outlined" sx={{ p: 1.5, minHeight: 70 }}>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {assembleAnswerIds.length === 0 ? (
                                      <Typography color="text.secondary">
                                        Выберите слова в правильном порядке
                                      </Typography>
                                    ) : (
                                      assembleAnswerIds.map((id) => {
                                        const piece = activePhraseQuizItem.pieces.find((item) => item.id === id);
                                        if (!piece) {
                                          return null;
                                        }
                                        return (
                                          <Button key={id} size="small" onClick={() => removeAssembleWord(id)}>
                                            {piece.word}
                                          </Button>
                                        );
                                      })
                                    )}
                                  </Stack>
                                </Paper>

                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {activePhraseQuizItem.pieces
                                    .filter((piece) => !assembleAnswerIds.includes(piece.id))
                                    .map((piece) => (
                                      <Button
                                        key={piece.id}
                                        size="small"
                                        variant="outlined"
                                        onClick={() => addAssembleWord(piece.id)}
                                      >
                                        {piece.word}
                                      </Button>
                                    ))}
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="outlined"
                                    onClick={resetAssembleAnswer}
                                    disabled={assembleAnswerIds.length === 0}
                                  >
                                    Сбросить
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={submitAssembleAnswer}
                                    disabled={
                                      assembleAnswerIds.length !==
                                      activePhraseQuizItem.correctWords.length
                                    }
                                  >
                                    Проверить
                                  </Button>
                                </Stack>
                              </Stack>
                            ) : null}

                            {activePhraseQuizItem.type === 'missing' ? (
                              <Stack spacing={1.5}>
                                <Typography color="text.secondary">
                                  Введите пропущенное слово:
                                </Typography>
                                <Alert severity="info">{activePhraseQuizItem.card.exampleRu}</Alert>
                                <Paper variant="outlined" sx={{ p: 1.5 }}>
                                  <Typography variant="h6">{activePhraseQuizItem.maskedPhrase}</Typography>
                                </Paper>
                                <TextField
                                  label="Пропущенное слово"
                                  value={missingWordInput}
                                  onChange={(event) => setMissingWordInput(event.target.value)}
                                  size="small"
                                  autoComplete="off"
                                />
                                <Button
                                  variant="contained"
                                  onClick={submitMissingWordAnswer}
                                  disabled={!missingWordInput.trim()}
                                >
                                  Проверить
                                </Button>
                              </Stack>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <Alert severity="info">
                              Результат: {quizScore} из {phraseQuizItems.length}
                            </Alert>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button variant="contained" onClick={() => startPhraseQuiz(topicId)}>
                                Пройти ещё раз
                              </Button>
                              {phraseQuizMistakes.length > 0 ? (
                                <Button
                                  variant="outlined"
                                  onClick={() => setPhraseMistakeReviewMode((v) => !v)}
                                >
                                  {phraseMistakeReviewMode ? 'Скрыть разбор' : 'Разбор ошибок'}
                                </Button>
                              ) : null}
                            </Stack>

                            {phraseMistakeReviewMode ? (
                              <Paper variant="outlined" sx={{ p: 1.5 }}>
                                <Stack spacing={1.5}>
                                  <Typography variant="subtitle1">Ошибки в тесте фраз</Typography>
                                  {phraseQuizMistakes.map((mistake) => (
                                    <Paper key={mistake.id} variant="outlined" sx={{ p: 1.25 }}>
                                      <Stack spacing={0.5}>
                                        <Typography variant="body2" color="text.secondary">
                                          Задание: {mistake.prompt}
                                        </Typography>
                                        <Typography variant="body2">
                                          Ваш ответ: {mistake.userAnswer}
                                        </Typography>
                                        <Typography variant="body2">
                                          Правильно: {mistake.correctAnswer}
                                        </Typography>
                                      </Stack>
                                    </Paper>
                                  ))}
                                </Stack>
                              </Paper>
                            ) : null}
                          </>
                        )}
                      </Stack>
                    ) : null}
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : null}

          {mode === 'words' ? (
            <Paper sx={{ p: 2 }}>
              <Tabs value={wordTab} onChange={(_, value) => setWordTab(value)} variant="fullWidth">
                <Tab label="Учить слова" />
                <Tab label="Повтор слов" />
                <Tab label="Тест слов" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Задание на шаг: выучить {STEP_SIZE} слов, пройти повторы и сдать тест на 10/10.
                  Пока шаг не закрыт, следующий не открывается.
                </Alert>

                {wordTab === 0 ? (
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                      spacing={1}
                    >
                      <Chip label={`${wordIndex + 1} / ${wordCards.length || 1}`} />
                      <TextField
                        select
                        size="small"
                        value={activeStepIndex}
                        SelectProps={{ native: true }}
                        onChange={(event) => {
                          const index = Number(event.target.value);
                          setActiveStepIndex(index);
                          setWordTab(0);
                          setMode('words');
                        }}
                        sx={{ minWidth: 220, maxWidth: 280 }}
                      >
                        {stepStatus.steps.map((step, index) =>
                          index <= maxSelectableStepIndex ? (
                            <option key={`step-option-${index}`} value={index}>
                              {`Шаг ${index + 1}${step.completed ? ' ✓' : ''}`}
                            </option>
                          ) : null
                        )}
                      </TextField>
                      <Button onClick={() => setShowTranslation((v) => !v)}>
                        {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
                      </Button>
                    </Stack>

                    <StudyCard
                      item={activeWordCard}
                      reveal={showTranslation}
                      canSpeak={canSpeak}
                      onSpeakText={speakText}
                      isWord
                    />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        disabled={wordIndex === 0}
                        onClick={() => {
                          setWordIndex((i) => Math.max(0, i - 1));
                        }}
                      >
                        Назад
                      </Button>
                      <Button
                        variant="contained"
                        disabled={wordCards.length === 0 || wordIndex >= Math.max(0, wordCards.length - 1)}
                        onClick={() => {
                          setWordIndex((i) => {
                            if (wordCards.length === 0) {
                              return 0;
                            }
                            return Math.min(wordCards.length - 1, i + 1);
                          });
                        }}
                      >
                        Дальше
                      </Button>
                    </Stack>

                    {wordCards.length > 0 && wordIndex >= wordCards.length - 1 ? (
                      <Paper variant="outlined" sx={{ p: 1.5 }}>
                        <Stack spacing={1.25}>
                          <Typography variant="body2" color="text.secondary">
                            Слова шага закончились. Выберите действие.
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => setWordIndex(0)}>
                              Учить заново
                            </Button>
                            <Button variant="contained" onClick={() => setWordTab(1)}>
                              Перейти к повтору
                            </Button>
                          </Stack>
                        </Stack>
                      </Paper>
                    ) : null}
                  </Stack>
                ) : null}

                {wordTab === 1 ? (
                  <Stack spacing={2}>
                    <Typography variant="subtitle1">Слов к повторению: {dueWords.length}</Typography>

                    {activeDueWord ? (
                      <>
                        <StudyCard
                          item={activeDueWord}
                          reveal
                          canSpeak={canSpeak}
                          onSpeakText={speakText}
                          isWord
                        />
                        <Typography color="text.secondary">Насколько легко вспомнили?</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Button color="error" variant="outlined" onClick={() => handleWordReview(1)}>
                            Тяжело
                          </Button>
                          <Button
                            color="warning"
                            variant="outlined"
                            onClick={() => handleWordReview(3)}
                          >
                            Нормально
                          </Button>
                          <Button
                            color="success"
                            variant="contained"
                            onClick={() => handleWordReview(5)}
                          >
                            Легко
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Alert severity="info">
                          Базовые повторы шага закрыты. Можно сразу идти в тест или повторить шаг ещё раз.
                        </Alert>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Button variant="outlined" onClick={() => restartStepReview(activeStepIndex)}>
                            Повторить шаг снова
                          </Button>
                          <Button variant="contained" onClick={() => setWordTab(2)}>
                            Перейти к тесту
                          </Button>
                        </Stack>
                      </>
                    )}
                  </Stack>
                ) : null}

                {wordTab === 2 ? (
                  <Stack spacing={2}>
                    {!wordQuizDone && activeWordQuiz ? (
                      <>
                        <Chip label={`Слово ${wordQuizIndex + 1} / ${wordQuizItems.length || 1}`} />
                        <StudyCard
                          item={activeWordQuiz}
                          reveal={false}
                          canSpeak={canSpeak}
                          onSpeakText={speakText}
                          isWord
                        />
                        <Typography>Выберите перевод слова:</Typography>
                        <Stack spacing={1}>
                          {activeWordQuiz.options.map((option) => (
                            <Button
                              key={option}
                              variant="outlined"
                              onClick={() =>
                                handleWordQuizAnswer(option === activeWordQuiz.ru, option)
                              }
                              sx={{ justifyContent: 'flex-start' }}
                            >
                              {option}
                            </Button>
                          ))}
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Alert severity="info">
                          Результат: {wordQuizScore} из {wordQuizItems.length}
                        </Alert>
                        {wordQuizCelebration ? (
                          <Alert severity="success">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              Поздравляем, тест сдан на 10/10.
                            </Typography>
                            <Typography variant="body2">
                              Вы прошли шагов: {wordQuizCelebration.completedSteps}.
                            </Typography>
                            {wordQuizCelebration.newlyUnlockedTitles.length > 0 ? (
                              <Typography variant="body2">
                                Новые доступные темы фраз: {wordQuizCelebration.newlyUnlockedTitles.join(', ')}.
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                Доступные темы фраз: {wordQuizCelebration.unlockedTitles.join(', ')}.
                              </Typography>
                            )}
                          </Alert>
                        ) : null}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Button variant="contained" onClick={() => startWordQuiz(activeStepIndex, wordCards)}>
                            Пройти ещё раз
                          </Button>
                          {wordQuizMistakes.length > 0 ? (
                            <Button
                              variant="outlined"
                              onClick={() => setWordMistakeReviewMode((v) => !v)}
                            >
                              {wordMistakeReviewMode ? 'Скрыть разбор' : 'Разбор ошибок'}
                            </Button>
                          ) : null}
                        </Stack>

                        {wordMistakeReviewMode ? (
                          <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Stack spacing={1.5}>
                              <Typography variant="subtitle1">Ошибки в тесте слов</Typography>
                              {wordQuizMistakes.map((mistake) => (
                                <Paper key={mistake.id} variant="outlined" sx={{ p: 1.25 }}>
                                  <Stack spacing={0.5}>
                                    <Typography variant="body2" color="text.secondary">
                                      Слово: {mistake.prompt}
                                    </Typography>
                                    <Typography variant="body2">
                                      Ваш ответ: {mistake.userAnswer}
                                    </Typography>
                                    <Typography variant="body2">
                                      Правильно: {mistake.correctAnswer}
                                    </Typography>
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          </Paper>
                        ) : null}
                      </>
                    )}
                  </Stack>
                ) : null}
              </Box>
            </Paper>
          ) : null}

          <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Ваш прогресс</Typography>
              <Typography color="text.secondary">
                Шаг {activeStepIndex + 1} из {stepStatus.totalSteps}: изучено {currentStep?.learned || 0} из{' '}
                {currentStep?.total || STEP_SIZE}.
              </Typography>
              <LinearProgress
                variant="determinate"
                value={currentStepLearnedPercent}
                sx={{ height: 9, borderRadius: 10 }}
              />

              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Прогресс шага
                    </Typography>
                    <Typography variant="h6">{currentStepLearnedPercent}%</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Завершено шагов
                    </Typography>
                    <Typography variant="h6">{stepStatus.completedSteps} / {stepStatus.totalSteps}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Слова изучено всего
                    </Typography>
                    <Typography variant="h6">{learnedWordsTotal}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Фразы к повтору
                    </Typography>
                    <Typography variant="h6">{dashboard.phrases.due}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Тест шага 10/10
                    </Typography>
                    <Typography variant="h6">{(currentStep?.quizSuccess || 0) > 0 ? 'Да' : 'Нет'}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Слов освоено (2+)
                    </Typography>
                    <Typography variant="h6">{masteredWordsTotal}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Очки
                    </Typography>
                    <Typography variant="h6">{score}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper variant="outlined" sx={{ p: 1.25, height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Ранг
                    </Typography>
                    <Typography variant="h6">{rank}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {(currentStep?.quizSuccess || 0) > 0 ? (
                <Alert severity="success">
                  Тест шага сдан на 10/10. После полного изучения слов шаг закроется автоматически.
                </Alert>
              ) : (
                <Alert severity="warning">
                  Для закрытия шага нужно минимум один раз сдать тест на 10/10.
                </Alert>
              )}

              {currentStep?.completed ? (
                <Alert severity="success">
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Шаг завершен. Следующий шаг открыт.</Typography>
                    {activeStepIndex + 1 < stepStatus.totalSteps ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setActiveStepIndex((prev) =>
                            Math.min(stepStatus.totalSteps - 1, prev + 1)
                          );
                          setWordTab(0);
                          setMode('words');
                        }}
                      >
                        Перейти к следующему шагу
                      </Button>
                    ) : null}
                  </Stack>
                </Alert>
              ) : (
                <Alert severity="info">
                  Цель шага: пройти все слова шага и сдать тест 10/10.
                </Alert>
              )}

              {earnedRewards.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {earnedRewards.map((reward) => (
                    <Chip key={reward} label={reward} color="success" variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Награды появятся после завершения шагов и серии дней.
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Ежедневные цели</Typography>
              <Typography color="text.secondary">
                Сегодня: 20 повторов слов и 1 тест слов на 10/10.
              </Typography>

              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Слова: {dailyGoals.wordsDone} / {dailyGoals.wordsTarget}</Typography>
                  <Chip
                    size="small"
                    color={dailyGoals.wordsCompleted ? 'success' : 'default'}
                    label={dailyGoals.wordsCompleted ? 'Выполнено' : 'В процессе'}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.round((dailyGoals.wordsDone / dailyGoals.wordsTarget) * 100))}
                  sx={{ height: 8, borderRadius: 8 }}
                />
              </Stack>

              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    Тест 10/10: {dailyGoals.perfectTestsDone} / {dailyGoals.perfectTestsTarget}
                  </Typography>
                  <Chip
                    size="small"
                    color={dailyGoals.perfectTestsCompleted ? 'success' : 'default'}
                    label={dailyGoals.perfectTestsCompleted ? 'Выполнено' : 'В процессе'}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    100,
                    Math.round((dailyGoals.perfectTestsDone / dailyGoals.perfectTestsTarget) * 100)
                  )}
                  sx={{ height: 8, borderRadius: 8 }}
                />
              </Stack>

              {dailyGoals.allCompleted ? (
                <Alert severity="success">Ежедневные цели выполнены. Отличная работа.</Alert>
              ) : (
                <Alert severity="info">Закройте обе цели, чтобы завершить дневной план.</Alert>
              )}

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderColor: dailyGoals.streak.current > 0 ? 'warning.main' : 'divider',
                  background:
                    dailyGoals.streak.current > 0
                      ? 'linear-gradient(90deg, rgba(255,167,38,0.10) 0%, rgba(255,152,0,0.04) 100%)'
                      : 'transparent'
                }}
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WhatshotRoundedIcon color={dailyGoals.streak.current > 0 ? 'warning' : 'disabled'} />
                      <Typography variant="subtitle1">
                        Серия: {dailyGoals.streak.current} дн.
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      icon={<EmojiEventsRoundedIcon />}
                      label={`Рекорд: ${dailyGoals.streak.longest} дн.`}
                      color={dailyGoals.streak.longest > 0 ? 'secondary' : 'default'}
                    />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    До следующей отметки: {dailyGoals.streak.nextMilestone} дней подряд.
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={dailyGoals.streak.progressPercent}
                    color="warning"
                    sx={{ height: 8, borderRadius: 8 }}
                  />

                  {dailyGoals.streak.current >= 30 ? (
                    <Alert severity="success">Мощная серия. Вы идете в очень стабильном ритме.</Alert>
                  ) : dailyGoals.streak.current >= 7 ? (
                    <Alert severity="success">Отличная динамика. Серия уже крепкая.</Alert>
                  ) : dailyGoals.streak.current >= 1 ? (
                    <Alert severity="info">Серия запущена. Не прерывайте ритм завтра.</Alert>
                  ) : (
                    <Alert severity="warning">Сегодня можно начать новую серию.</Alert>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Аналитика</Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Дни:
                  </Typography>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={chartDays}
                    onChange={(_, value) => {
                      if (value) {
                        setChartDays(Number(value));
                      }
                    }}
                  >
                    <ToggleButton value={7}>7</ToggleButton>
                    <ToggleButton value={14}>14</ToggleButton>
                    <ToggleButton value={30}>30</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Недели:
                  </Typography>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={chartWeeks}
                    onChange={(_, value) => {
                      if (value) {
                        setChartWeeks(Number(value));
                      }
                    }}
                  >
                    <ToggleButton value={4}>4</ToggleButton>
                    <ToggleButton value={8}>8</ToggleButton>
                    <ToggleButton value={12}>12</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <MiniBarChart
                    title="Повторы по дням"
                    subtitle={`Последние ${chartDays} дней`}
                    data={progressCharts.dailyReviews}
                    valueKey="count"
                    labelKey="label"
                    color="primary.main"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <MiniBarChart
                    title="Тесты 10/10 по неделям"
                    subtitle={`Последние ${chartWeeks} недель`}
                    data={progressCharts.weeklyPerfectTests}
                    valueKey="count"
                    labelKey="label"
                    color="secondary.main"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <StepProgressPanel steps={stepStatus.steps} activeStepIndex={activeStepIndex} />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Как заниматься без хаоса</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography>
              1. Проходи текущий шаг слов по порядку во вкладке «Учить слова».
            </Typography>
            <Typography>
              2. После 20 слов переходи в «Повтор слов», затем в «Тест слов».
            </Typography>
            <Typography>
              3. Шаг закрывается только когда слова шага закреплены и тест сдан на 10/10.
            </Typography>
            <Typography>
              4. Пока шаг не закрыт, следующий шаг не открывается.
            </Typography>
            <Typography>
              5. Рекомендуемый ритм: 20-30 минут в день, без длинных пауз.
            </Typography>
            <Typography color="text.secondary">
              Прогресс и очки сохраняются автоматически на этом устройстве.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} variant="contained">
            Понятно
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={backupReminderOpen} onClose={() => setBackupReminderOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Напоминание о бэкапе</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.25}>
            <Typography>
              Прогресс автоматически сохраняется в локальные JSON-снимки. Рекомендуется также скачать резервную копию.
            </Typography>
            <Typography color="text.secondary">
              Если устройство или браузер очистит хранилище, только вручную скачанный файл поможет восстановить данные.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              localStorage.setItem(LAST_BACKUP_REMINDER_DATE_KEY, new Date().toISOString().slice(0, 10));
              setBackupReminderOpen(false);
            }}
          >
            Позже
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              await handleExportProgress();
              setBackupReminderOpen(false);
            }}
          >
            Скачать сейчас
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
