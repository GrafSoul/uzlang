# UzLang

[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg?style=flat-square)](https://github.com/your-org/uzlang/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/your-org/uzlang?style=flat-square)](https://github.com/your-org/uzlang/issues)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![Local SQL](https://img.shields.io/badge/Storage-Local%20SQL-0f766e?style=flat-square)
![No Auth](https://img.shields.io/badge/Auth-None-334155?style=flat-square)
![Themes](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-7c3aed?style=flat-square)
![TTS](https://img.shields.io/badge/TTS-Enabled-1d4ed8?style=flat-square)
![Progress](https://img.shields.io/badge/Progress-Local%20Tracking-16a34a?style=flat-square)

UzLang is a practical self-study web app for Russian-speaking learners who want to build real Uzbek communication skills for everyday life.

## Overview

UzLang focuses on practical communication instead of grammar-heavy theory.
The learning flow is simple and effective:

1. Learn core words by level.
2. Reinforce with short phrase drills.
3. Pass tests and track progress.

## Features

- Progressive vocabulary learning by levels
- Phrase practice for daily city and neighborhood scenarios
- Spaced repetition for long-term retention
- Quiz progression with success/fail statistics
- Uzbek TTS for pronunciation practice
- Local-first progress storage with export/import backup
- Light and dark themes with persistent preference

## Tech Stack

- Frontend: React + Vite + MUI
- Data layer: `sql.js` (SQLite in browser)
- Persistence: browser local storage
- UX: responsive, mobile-first layout

## Quality Status

- Linting: passing
- Production build: passing

## TODO

- [ ] Добавить авто-режим темы: `Системная тема` (по настройке ОС).
- [ ] Добавить ежедневные цели: например `20 слов`, `1 тест 10/10`, и трекинг выполнения.
- [ ] Добавить `streak` (серия дней без пропуска) и визуальную мотивацию за серию.
- [ ] Добавить отдельный режим `Разбор ошибок` после теста.
- [ ] Добавить более продвинутый тест фраз: сборка фразы из слов и ввод пропущенного слова.
- [ ] Добавить графики прогресса по дням/неделям и по уровням.
- [ ] Добавить авто-бэкап прогресса (локальный JSON) с напоминанием пользователю.
- [ ] Расширить набор диалогов реальных сценариев (базар, такси, соседи, магазин).
- [ ] Провести редакторскую вычитку словаря и фраз с носителем языка.
- [ ] Оптимизировать размер бандла (code-splitting, lazy loading модулей).
