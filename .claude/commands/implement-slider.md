# implement-slider — スライダー1つを実装する手順

## 使い方
```
/implement-slider No.XX（例: No.01 三菱）
```

---

## 実装フロー

### STEP 1: 仕様確認
- `slider-reference-spec.md` で対象No.のレイアウト・スタイル・動作仕様を確認する
- `references/` フォルダの対応画像を参照する
- 不明点があれば実装前にユーザーに確認する

### STEP 2: HTML作成
- `index.html` に対象スライダーのセクションを追加する
- `slider-reference-spec.md` のHTML骨格をベースに記述する
- `coding-rules.md` のBEM命名規則に従うこと
- aria属性・role・aria-labelを必ず付与する

### STEP 3: CSS作成
- `css/slider/` 内の対応ファイルに記述する（例: `slider-tab-peek.css`）
- `design-ui.md` のCSS変数（`:root`）を使用する
- `coding-rules.md` のBEM命名に従う
- レスポンシブ対応（SP: 〜767px / PC: 768px〜）を必ず実装する
- `prefers-reduced-motion` 対応を入れる

### STEP 4: JS作成
- `js/slider/` 内の対応ファイルに記述する（例: `slider-tab-peek.js`）
- `coding-rules.md` のclassベースの構造で書く
- 以下を必ず実装する:
  - `init()` / `bindEvents()` / `goTo()` / `next()` / `prev()`
  - `startAutoplay()` / `stopAutoplay()`
  - キーボード操作（← →キー）
  - hover/focus時のautoplay一時停止

### STEP 5: main.jsへの登録
- `js/main.js` で対象スライダーをインスタンス化する
```js
import SliderXxx from './slider/slider-xxx.js';
document.querySelectorAll('.slider-xxx').forEach(el => new SliderXxx(el));
```

### STEP 6: 動作確認チェックリスト
- [ ] PC表示で正常にスライドするか
- [ ] SP表示でレイアウトが崩れていないか
- [ ] キーボード（← →）で操作できるか
- [ ] autoplayが動作し、hoverで止まるか
- [ ] ドット/矢印のaria属性が正しいか
- [ ] `slider-reference-spec.md` の参照画像と見た目が近いか
