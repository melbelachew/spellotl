# Spellotl

A React + TypeScript spelling practice app for grades 5–12.

## Project Structure

```
spellotl/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── words.json          # ← All word lists live here
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── hooks/
│   │   ├── useWords.ts         # Word list & grade state
│   │   └── useStreak.ts        # Streak tracking
│   ├── components/
│   │   ├── GradeTabs.tsx       # Grade selector tabs
│   │   ├── CustomPanel.tsx     # My List paste panel
│   │   ├── MainMenu.tsx        # Game mode cards
│   │   ├── GameHeader.tsx      # Shared game header
│   │   ├── ProgressBar.tsx     # Shared progress bar
│   │   ├── Results.tsx         # Results screen
│   │   ├── SpellingBee.tsx     # 🐝 Spelling Bee game
│   │   ├── WhichWord.tsx       # 🎯 Which Word? game
│   │   ├── FlashCards.tsx      # ⚡ Flash Cards
│   │   └── MatchUp.tsx         # 🃏 Match Up game
│   ├── utils/
│   │   └── index.ts            # Helpers: shuffle, speak, fetch defs
│   ├── styles/
│   │   └── global.css          # All styles + CSS variables
│   ├── App.tsx                 # Root component
│   └── index.tsx               # Entry point
├── package.json
└── tsconfig.json
```

## Getting Started

```bash
npm install
npm start
```

## Updating Word Lists

Edit `src/data/words.json`. Each grade is a key with an array of `{ w, d }` objects:

```json
{
  "5th": [
    { "w": "journey", "d": "A long trip or travel" }
  ]
}
```

## Deploying to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/spellotl",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then run:
```bash
npm run deploy
```
