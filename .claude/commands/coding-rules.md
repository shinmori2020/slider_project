# coding-rules.md — コーディング規約

---

## HTML

- セマンティックなタグを使う（`<section>`, `<nav>`, `<button>` など）
- スライダーのラッパーには `role="region"` と `aria-label` を付与
- 画像には必ず `alt` 属性を記述

```html
<!-- 例 -->
<section class="slider" role="region" aria-label="フェードスライダー">
  <div class="slider__track">
    <div class="slider__item is-active">
      <img src="..." alt="説明テキスト">
    </div>
  </div>
</section>
```

---

## CSS — BEM命名規則

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

- Blockはスライダー種別で命名: `slider-fade`, `slider-slide`, `slider-thumb`, `slider-full`
- 状態クラスは `is-` プレフィックス: `is-active`, `is-animating`, `is-paused`
- JS用フックは `js-` プレフィックス（スタイルは当てない）: `js-slider-next`

```css
/* 例 */
.slider-fade {}
.slider-fade__track {}
.slider-fade__item {}
.slider-fade__item--active {}  /* または .is-active */
.slider-fade__nav {}
.slider-fade__nav-btn {}
.slider-fade__dots {}
.slider-fade__dot {}
```

---

## JavaScript

- `class` 構文でスライダーを定義する
- コンストラクタで要素取得・初期化を行う
- イベントはまとめて `init()` メソッドで登録する
- `const` / `let` を使用、`var` は禁止

```js
// 例: ファイル構造
class FadeSlider {
  constructor(el, options = {}) {
    this.el = el;
    this.options = { autoplay: true, interval: 4000, ...options };
    this.current = 0;
    // ...
    this.init();
  }

  init() {
    this.bindEvents();
    if (this.options.autoplay) this.startAutoplay();
  }

  bindEvents() {
    // キーボード・クリック・スワイプ
  }

  goTo(index) { /* ... */ }
  next() { /* ... */ }
  prev() { /* ... */ }
  startAutoplay() { /* ... */ }
  stopAutoplay() { /* ... */ }
}
```

---

## アクセシビリティ必須項目

| 対応 | 内容 |
|------|------|
| キーボード操作 | `←` `→` キーで前後スライド、`Tab` でナビゲーションフォーカス |
| aria-live | `aria-live="polite"` でスライド切り替えをアナウンス |
| aria-current | 現在のドット/サムネイルに `aria-current="true"` |
| autoplay制御 | hover・focus時に一時停止（`mouseenter` / `focusin`） |
| ボタン | `<button>` タグを使用し、`aria-label` を付与 |

---

## コメントルール

- ファイル先頭に概要コメントを書く
- セクション区切りに `/* ── セクション名 ── */` を使う
- 複雑なロジックには必ず処理の意図をコメントする
