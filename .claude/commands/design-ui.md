# design-ui.md — デザイン・UI方針

---

## テーマ・トーン

※ 未決定。以下から選択、またはカスタム指定すること。

- [ ] ダーク系（黒・グレー）― 洗練・プロフェッショナル
- [ ] ライト系（白・クリーム）― クリーン・明るい
- [ ] その他（指定があれば記述）: ___________

決定後、CSS変数に反映すること（`base.css`の`:root`を参照）。

---

## CSS変数（base.cssで定義）

```css
:root {
  /* Colors — テーマ決定後に値を埋める */
  --color-bg: ;
  --color-surface: ;
  --color-text: ;
  --color-text-muted: ;
  --color-accent: ;
  --color-border: ;

  /* Typography */
  --font-display: ;   /* 見出し用 */
  --font-body: ;      /* 本文用 */

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;

  /* Slider */
  --slider-radius: 8px;
  --slider-transition: 0.5s ease;
  --slider-nav-size: 48px;
}
```

---

## フォント方針

- Google Fontsを使用（日本語対応フォントを含めること）
- 見出し用：個性的なディスプレイフォントを選ぶ
- 本文用：可読性の高いフォントを選ぶ
- `font-weight: 300〜400` を基本とし、重くしすぎない

---

## アニメーション方針

- トランジションは `CSS transition` を優先（JSで制御する場合はclassの付け外しで行う）
- イージング: `ease` または `cubic-bezier` を適切に指定
- 過度なアニメーションは避け、UXを損なわない範囲で
- `prefers-reduced-motion` メディアクエリに対応すること

```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
```

---

## レスポンシブ方針

- モバイルファースト（`min-width`でブレイクポイントを指定）
- ブレイクポイント:
  - SP: `〜767px`
  - PC: `768px〜`
- スライダーのナビゲーション（矢印・ドット）はSPでも操作しやすいサイズに（最小44px）

---

## UIコンポーネント共通ルール

- ナビゲーション矢印: ← / → のシンプルなSVGまたはテキスト
- ドットインジケーター: 現在位置が明確にわかるデザイン
- サムネイル: active状態を明示（枠・opacity等）
- ローディング: 画像読み込み中のフォールバックを考慮
