# slider-spec.md — スライダー仕様定義

---

## 共通仕様

すべてのスライダーに以下を実装すること。

| 項目 | 仕様 |
|------|------|
| autoplay | デフォルト ON、interval: 4000ms |
| pause | hover / focus で一時停止 |
| ループ | 無限ループ（最後→最初に戻る） |
| キーボード | ←→キーで操作、Tabでボタンフォーカス |
| レスポンシブ | PC・SP両対応 |
| アクセシビリティ | aria属性・role・aria-live対応 |

---

## パターン 1 — フェードイン切り替え（`slider-fade`）

**動作**: スライドがフェードイン/アウトで切り替わる。位置移動なし。

```
[img A] → opacity: 0 → [img B] opacity: 1
```

**HTML構造**:
```html
<section class="slider-fade" role="region" aria-label="フェードスライダー">
  <div class="slider-fade__track">
    <div class="slider-fade__item is-active">...</div>
    <div class="slider-fade__item">...</div>
  </div>
  <div class="slider-fade__nav">
    <button class="slider-fade__btn slider-fade__btn--prev" aria-label="前へ">←</button>
    <button class="slider-fade__btn slider-fade__btn--next" aria-label="次へ">→</button>
  </div>
  <div class="slider-fade__dots" role="tablist" aria-label="スライド選択"></div>
</section>
```

**アニメーション**: `opacity` のみ、`position: absolute` で重ねる

---

## パターン 2 — スライド（横スクロール）（`slider-slide`）

**動作**: スライドが横方向にスライドして切り替わる。

```
[img A][img B][img C] → translateX(-100%) で移動
```

**HTML構造**:
```html
<section class="slider-slide" role="region" aria-label="スライドスライダー">
  <div class="slider-slide__wrapper">
    <div class="slider-slide__track">
      <div class="slider-slide__item">...</div>
      <div class="slider-slide__item">...</div>
    </div>
  </div>
  <button class="slider-slide__btn--prev" aria-label="前へ">←</button>
  <button class="slider-slide__btn--next" aria-label="次へ">→</button>
  <div class="slider-slide__dots" role="tablist"></div>
</section>
```

**アニメーション**: `transform: translateX()` + `transition`

---

## パターン 3 — サムネイル付き（`slider-thumb`）

**動作**: メイン画像 + 下部サムネイル一覧。サムネイルクリックで切り替え。

```
┌────────────────┐
│   メイン画像    │
└────────────────┘
[t1][t2][t3][t4]  ← サムネイル（activeは枠・opacity変化）
```

**HTML構造**:
```html
<section class="slider-thumb" role="region" aria-label="サムネイルスライダー">
  <div class="slider-thumb__main">
    <div class="slider-thumb__item is-active">...</div>
  </div>
  <div class="slider-thumb__thumbnails" role="tablist">
    <button class="slider-thumb__thumb is-active" aria-current="true" aria-label="スライド1"></button>
  </div>
</section>
```

**アニメーション**: メインはフェードまたはスライド（選択制でもよい）

---

## パターン 4 — フルスクリーン型（`slider-full`）

**動作**: ビューポート全体を覆うスライダー。背景画像として展開。

```
┌──────────────────────────────┐ ← 100vw × 100vh
│                              │
│   テキストオーバーレイ        │
│                              │
│        [← prev] [next →]    │
└──────────────────────────────┘
```

**HTML構造**:
```html
<section class="slider-full" role="region" aria-label="フルスクリーンスライダー">
  <div class="slider-full__track">
    <div class="slider-full__item is-active" style="background-image: url(...)">
      <div class="slider-full__content">
        <h2 class="slider-full__title">タイトル</h2>
      </div>
    </div>
  </div>
  <button class="slider-full__btn--prev" aria-label="前へ">←</button>
  <button class="slider-full__btn--next" aria-label="次へ">→</button>
  <div class="slider-full__dots" role="tablist"></div>
</section>
```

**アニメーション**: フェード推奨（スライドでも可）  
**注意**: `height: 100vh`、背景は `background-size: cover`

---

## オプション引数（共通）

```js
{
  autoplay: true,       // 自動再生
  interval: 4000,       // 自動再生間隔(ms)
  loop: true,           // 無限ループ
  pauseOnHover: true,   // hover時停止
}
```
