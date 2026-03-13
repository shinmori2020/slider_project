# CLAUDE.md — Slider Demo Site

このファイルはClaude Codeへのプロジェクト全体の指示書です。
コードを書く前に必ず参照してください。

---

## ⚠️ 作業開始前に必ず読み込むこと

**いかなる作業も、以下のファイルをすべて読み込んでから開始すること。**
コードの記述・修正・追加、すべての作業が対象です。

### 必須読み込みファイル（順番通りに読むこと）

1. `.claude/commands/design-ui.md` ← デザイン・カラー・フォント方針
2. `.claude/commands/coding-rules.md` ← BEM命名・HTML/CSS/JS規約
3. `.claude/commands/slider-spec.md` ← スライダー共通仕様
4. `.claude/commands/slider-reference-spec.md` ← 参照画像別の制作詳細

### スラッシュコマンド使用時も同様

`/implement-slider` `/build-page` `/add-feature` を使う場合も、
上記4ファイルを読み込んだ上でコマンドの手順に従うこと。

### skillsフォルダがある場合

`.claude/skills/` 内のファイルも作業前に読み込むこと。

---

## プロジェクト概要

- **目的**: ポートフォリオ用スライダーデモサイト
- **実装**: Vanilla JS（ライブラリ・フレームワーク不使用）
- **対象ブラウザ**: モダンブラウザ（Chrome / Firefox / Safari / Edge 最新版）
- **対応デバイス**: PC・SP両対応（レスポンシブ）

---

## ディレクトリ構成

```
project/
├── CLAUDE.md
├── index.html
├── css/
│   ├── base.css          # リセット・変数・共通スタイル
│   ├── layout.css        # ページレイアウト
│   └── slider/
│       ├── fade.css
│       ├── slide.css
│       ├── thumbnail.css
│       └── fullscreen.css
├── js/
│   ├── main.js           # エントリーポイント
│   └── slider/
│       ├── fade.js
│       ├── slide.js
│       ├── thumbnail.js
│       └── fullscreen.js
└── .claude/
    └── commands/
        ├── design-ui.md
        ├── coding-rules.md
        └── slider-spec.md
```

---

## Skillsの参照指示

コードを書く際は以下を必ず参照すること。

| タスク | 参照ファイル |
|--------|-------------|
| デザイン・見た目の実装 | `.claude/commands/design-ui.md` |
| HTML・CSS・JSの記述 | `.claude/commands/coding-rules.md` |
| スライダー共通仕様 | `.claude/commands/slider-spec.md` |
| 各スライダーの詳細仕様 | `.claude/commands/slider-reference-spec.md` |
| スライダー1つを実装する | `.claude/commands/implement-slider.md` |
| ページ全体を組み立てる | `.claude/commands/build-page.md` |
| 既存スライダーに機能追加 | `.claude/commands/add-feature.md` |
| UI・デザイン実装の知識 | `.claude/skills/frontend-design/` |
| アクセシビリティ対応 | `.claude/skills/accessibility/` |

---

## 絶対に守るルール

- ライブラリ（jQuery・Swiper等）は使用しない
- CSSクラス命名はBEMに従う
- すべてのスライダーにキーボード操作・aria属性を実装する
- autoplayにはpause on hover/focus を必ず実装する
- JSはモジュール分割し、1ファイル1スライダーを原則とする
