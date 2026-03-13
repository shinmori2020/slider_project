# add-feature — 既存スライダーに機能追加する手順

## 使い方
```
/add-feature No.XX 機能名（例: No.02 スワイプ対応）
```

---

## 対応できる機能一覧

| 機能名 | 内容 |
|--------|------|
| `swipe` | タッチ・スワイプ操作対応（SP向け） |
| `progress` | 自動再生の進行をバー表示 |
| `counter` | 「1 / 4」のようなスライド番号表示 |
| `pause-btn` | 自動再生の一時停止ボタン |
| `lazy-load` | 画像の遅延読み込み対応 |
| `transition-change` | トランジション種別の変更 |

---

## 実装フロー

### STEP 1: 対象スライダーの現状確認
- 対象No.のJSファイルを読み込み、現在の実装を把握する
- 追加する機能が既に実装されていないか確認する
- `slider-reference-spec.md` で元の仕様を再確認する

### STEP 2: 機能別の実装方針

#### swipe（スワイプ対応）
```js
// bindEvents() 内に追加
bindSwipe() {
  let startX = 0;
  this.el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  this.el.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
  });
}
```

#### progress（進行バー）
```html
<!-- HTML追加 -->
<div class="slider-xxx__progress">
  <div class="slider-xxx__progress-bar"></div>
</div>
```
```js
// startAutoplay() 内でbarのwidthをアニメーション
// スライド切り替え時にリセット
```

#### counter（番号表示）
```html
<div class="slider-xxx__counter" aria-live="polite">
  <span class="slider-xxx__counter-current">1</span>
  <span> / </span>
  <span class="slider-xxx__counter-total">4</span>
</div>
```
```js
// goTo() 内でcurrentの数値を更新
```

#### pause-btn（停止ボタン）
```html
<button class="slider-xxx__pause-btn" aria-label="自動再生を停止">⏸</button>
```
```js
// クリックで stopAutoplay() / startAutoplay() をトグル
// aria-label も「再生」「停止」で切り替える
```

### STEP 3: CSS追加
- 機能に対応するスタイルを対象CSSファイルの末尾に追記する
- BEM命名に従い既存クラスと命名を統一する

### STEP 4: 動作確認チェックリスト
- [ ] 追加機能が正常に動作するか
- [ ] 既存のスライド動作が壊れていないか
- [ ] SP・PCの両方で確認したか
- [ ] アクセシビリティ（aria属性）が適切か
- [ ] 追加機能がautoplayと競合していないか
