# slider-reference-spec.md — リファレンス別スライダー制作詳細

参考画像: `references/` フォルダに格納済み

---

## No.01 ── 三菱自動車「カーラインアップ」
**参照画像**: `references/ref-01-mitsubishi.png`

### レイアウト構造
```
┌─────────────────────────────────────┐
│  Line Up  /  カーラインアップ（見出し）    │
│  [EV/PHEV][SUV][ミニバン]..（タブナビ）  │
│ ┌──┐  ┌───────────────┐  ┌──┐      │
│ │車│  │   メイン車両画像  │  │車│      │
│ └──┘  └───────────────┘  └──┘      │
│  ← prev           next →           │
│     OUTLANDER PHEV（車名テキスト）      │
│  ┌──────────────────────────┐       │
│  │  カーラインアップから探す →  │       │
│  └──────────────────────────┘       │
└─────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | `#2a2a2a`（ダークチャコール） |
| 見出し色 | ホワイト（英語大文字） + 日本語サブ |
| タブ背景（active） | 透明＋赤枠線（`#cc0000`） |
| タブアイコン | 車種シルエットSVG |
| 矢印ボタン | 菱形（◇）、赤（`#cc0000`）、枠線スタイル |
| CTAボタン | 透明背景＋白枠線、右矢印付き |
| フォント（見出し） | セリフ系 or 細めサンセリフ |

### スライド動作
- **方式**: 横スクロール（translateX）
- **peek表示**: 左右に前後スライドを約150px表示
- **タブ連動**: タブクリックで該当スライドへジャンプ
- **ドット**: なし（タブが代替）
- **autoplay**: あり（車名テキストも連動切り替え）

### HTML骨格
```html
<section class="slider-mitsubishi">
  <div class="slider-mitsubishi__header">
    <h2>Line Up</h2>
    <nav class="slider-mitsubishi__tabs">
      <button class="slider-mitsubishi__tab is-active" data-index="0">
        <svg><!-- 車アイコン --></svg>EV/PHEV
      </button>
      <!-- ... -->
    </nav>
  </div>
  <div class="slider-mitsubishi__viewport">
    <div class="slider-mitsubishi__track">
      <div class="slider-mitsubishi__item">
        <img src="" alt="EV/PHEV車両">
      </div>
    </div>
    <button class="slider-mitsubishi__btn--prev">◇</button>
    <button class="slider-mitsubishi__btn--next">◇</button>
  </div>
  <p class="slider-mitsubishi__caption">OUTLANDER PHEV</p>
  <a class="slider-mitsubishi__cta" href="#">カーラインアップから探す →</a>
</section>
```

### 実装ポイント
- `overflow: hidden` のviewportの中でtrackを `translateX` で動かす
- 両端peekは viewport に `padding: 0 150px` + `overflow: visible` で実現
- タブのactive状態とスライドindexを同期させる

---

## No.02 ── Ron Herman「メインビジュアル」
**参照画像**: `references/ref-02-ronherman.png`

### レイアウト構造
```
┌────────────────────────────────────────┐
│                                        │
│   ┌──────────────── 画像フルワイド ───┐  │
│   │ 2024 SS COLLECTION               │  │
│   │ Ron Herman LIVING（左下テキスト）  │  │
│   └───────────────────────────────────┘  │
│            ● ○ ○ ○ ○ ○ ○（ドット）     │
└────────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | ライトグレー（`#f5f5f0`） |
| 画像 | フルワイド、アスペクト比 約16:7 |
| テキスト位置 | 画像内 左下、白文字 |
| テキストサイズ | 小さめ（12〜14px） |
| ドット色 | グレー / active は濃いグレー |
| 矢印 | **なし** |
| フォント | サンセリフ、細め（weight: 300） |

### スライド動作
- **方式**: フェードイン/アウト（opacity切り替え）または横スライド
- **autoplay**: あり（ゆっくり、4〜5秒間隔）
- **操作**: ドットのみ（矢印なし）
- **トランジション**: `ease` 0.6〜0.8s

### HTML骨格
```html
<section class="slider-ronherman" role="region" aria-label="メインビジュアル">
  <div class="slider-ronherman__track">
    <div class="slider-ronherman__item is-active">
      <img src="" alt="2024 SS Collection">
      <div class="slider-ronherman__caption">
        <p>2024 SS COLLECTION</p>
        <p>Ron Herman LIVING</p>
      </div>
    </div>
  </div>
  <div class="slider-ronherman__dots" role="tablist"></div>
</section>
```

### 実装ポイント
- アイテムを `position: absolute` で重ねて `opacity` で切り替え
- ドットは細め、active時にのみ色を変える
- テキストは画像内に `position: absolute; bottom: 24px; left: 24px`

---

## No.03 ── 新つくば「テキスト＋画像 2カラム」
**参照画像**: `references/ref-03-tsukuba.png`

### レイアウト構造
```
┌──────────────────────────────────────────┐
│ ┌─────────────────────┐  ┌────────────┐  │
│ │  新！つくばスタイル   │  │            │  │
│ │  地域と住環境（H2）  │  │   写真     │  │
│ │  ......（ドット）    │  │            │  │
│ │  本文テキスト        │  │            │  │
│ │  RECOMMEND >        │  │            │  │
│ │  移住ステップ        │  └────────────┘  │
│ └──────────────────────┘                  │
│              ← prev   next →             │
└──────────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | ホワイト（`#ffffff`） |
| アクセントカラー | グリーン（`#4caf50`系） |
| テキスト | 左カラム固定、各スライドで内容が変わる |
| 矢印ボタン | 緑の丸型（`border-radius: 50%`）、白矢印 |
| ドットライン | テキスト下の点線（装飾） |
| フォント | サンセリフ、日本語 |

### スライド動作
- **方式**: 横スクロール（テキスト＋画像がセットで切り替わる）
- **操作**: 丸型矢印ボタン（左右）
- **ドット**: なし（矢印のみ）
- **autoplay**: 任意（あってもなくてもOK）

### HTML骨格
```html
<section class="slider-tsukuba">
  <div class="slider-tsukuba__track">
    <div class="slider-tsukuba__item is-active">
      <div class="slider-tsukuba__content">
        <span class="slider-tsukuba__label">新！つくばスタイル</span>
        <h2 class="slider-tsukuba__title">地域と住環境</h2>
        <p>テキスト...</p>
      </div>
      <div class="slider-tsukuba__image">
        <img src="" alt="">
      </div>
    </div>
  </div>
  <div class="slider-tsukuba__nav">
    <button class="slider-tsukuba__btn--prev" aria-label="前へ">←</button>
    <button class="slider-tsukuba__btn--next" aria-label="次へ">→</button>
  </div>
</section>
```

### 実装ポイント
- 2カラムレイアウトは `display: grid; grid-template-columns: 1fr 1fr`
- スライド全体（テキスト＋画像）をtrackでtranslateX
- 矢印ボタンは `border-radius: 50%` の緑丸ボタン

---

## No.04 ── TOYOTA「PRIUS 2カラム」
**参照画像**: `references/ref-04-toyota.png`

### レイアウト構造
```
┌───────────────────────────────────────┐
│ ┌────────────────────┐ セダン          │
│ │                    │ PRIUS（大見出し）│
│ │    車両画像         │               │
│ │  （ダークトーン）   │ ・特徴1        │
│ │                    │ ・特徴2        │
│ └────────────────────┘ ・特徴3        │
│ ● ○ ○ ○（ドット）    │               │
│                       │ [詳細はこちら] │
│                       │ 見積りシミュ > │
└───────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | ホワイト（`#ffffff`） |
| 画像背景 | ダーク（画像自体が暗め） |
| ドット | 赤（`#cc0000`）、active時 |
| CTAボタン | 黒背景、白文字 |
| テキストリンク | 下線なし、グレー |
| フォント（車名） | 大きめ・太め（weight: 700） |

### スライド動作
- **方式**: 横スクロール（画像エリアのみスライド、右テキストは切り替わる）
- **操作**: 矢印（不可視に近い）＋ドット
- **ドット**: 左下、小さめ
- **autoplay**: なし（手動操作中心）

### HTML骨格
```html
<section class="slider-toyota">
  <div class="slider-toyota__track">
    <div class="slider-toyota__item is-active">
      <div class="slider-toyota__image">
        <img src="" alt="PRIUS">
      </div>
      <div class="slider-toyota__info">
        <span class="slider-toyota__category">セダン</span>
        <h2 class="slider-toyota__name">PRIUS</h2>
        <ul class="slider-toyota__features">
          <li>感性に磨くスタイリッシュデザイン</li>
          <li>走りのワクワク感と上質を両立した空間</li>
          <li>PHEVとHEVの優れる走行性能</li>
        </ul>
        <a class="slider-toyota__cta" href="#">詳細はこちら</a>
        <a class="slider-toyota__sub-link" href="#">見積りシミュレーション</a>
      </div>
    </div>
  </div>
  <div class="slider-toyota__dots" role="tablist"></div>
</section>
```

### 実装ポイント
- 左右2カラム全体をスライドとして持つ
- ドットは画像エリアの左下に `position: absolute` で配置
- 画像は `object-fit: cover` でトリミング

---

## No.05 ── あまから手帖「Ranking カルーセル」
**参照画像**: `references/ref-05-amarakara.png`

### レイアウト構造
```
┌──────────────────────────────────────────────┐
│  ┌──────────┐  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──(一部)┐ │
│  │ Ranking  │  │1 │ │2 │ │3 │ │4 │ │  ...  │ │
│  │ /注目記事│  │🏆 │ │🏆 │ │🏆 │ │🏆 │        │ │
│  │ ランキング│  │画 │ │画 │ │画 │ │画 │        │ │
│  │          │  │像 │ │像 │ │像 │ │像 │        │ │
│  │ ← PREV   │  │タ │ │タ │ │タ │ │タ │        │ │
│  │ NEXT →   │  │イ │ │イ │ │イ │ │イ │        │ │
│  └──────────┘  └──┘ └──┘ └──┘ └──┘ └────────┘ │
└──────────────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | ホワイト（`#ffffff`） |
| 見出し「Ranking」 | 大きめ・ライトウェイト、左カラム固定 |
| カードサイズ | 約220〜250px幅 |
| 順位バッジ | 王冠アイコン（`👑`）＋番号 |
| 矢印テキスト | `← PREV` / `NEXT →`（テキスト型） |
| 日付 | グレー、小さめ |
| アクセント | レッド（`#e53935`系） |

### スライド動作
- **方式**: カルーセル（複数枚同時表示、1枚ずつスクロール）
- **同時表示枚数**: PC: 4枚、SP: 1〜2枚
- **操作**: PREV/NEXTテキストボタン（矢印付き）
- **ドット**: なし
- **左カラム（見出し）は固定**、右のカード群のみスライド

### HTML骨格
```html
<section class="slider-ranking">
  <div class="slider-ranking__header">
    <h2 class="slider-ranking__title">Ranking</h2>
    <p>/ 注目の記事ランキング</p>
    <div class="slider-ranking__nav">
      <button class="slider-ranking__btn--prev">← PREV</button>
      <button class="slider-ranking__btn--next">NEXT →</button>
    </div>
  </div>
  <div class="slider-ranking__viewport">
    <div class="slider-ranking__track">
      <div class="slider-ranking__card">
        <span class="slider-ranking__rank">👑 1</span>
        <img src="" alt="">
        <p class="slider-ranking__card-title">タイトル</p>
        <time>2023.03.14</time>
      </div>
      <!-- カード繰り返し -->
    </div>
  </div>
</section>
```

### 実装ポイント
- 左カラムは `position: sticky` または固定幅で分離
- trackは `display: flex` + `gap` でカードを並べる
- `translateX` で1カード分ずつ移動（card width + gap を計算）
- SP時はカード幅を変更してレスポンシブ対応

---

## No.06 ── 恵比寿ガーデンプレイス「メインビジュアル peek型」
**参照画像**: `references/ref-06-ebisu.png`

### レイアウト構造
```
┌──────────────────────────────────────────┐
│ ┌──────┐  ┌──────────────────┐  ┌──────┐ │
│ │前スラ│  │                  │  │次スラ│ │
│ │ イド │  │   メイン画像      │  │ イド │ │
│ │（暗）│  │  ロゴ＋テキスト   │  │（暗）│ │
│ │      │  │  オーバーレイ     │  │      │ │
│ └──────┘  └──────────────────┘  └──────┘ │
│  ←                        →             │
│       ○ ● ○ ○ ○（ドット）              │
└──────────────────────────────────────────┘
```

### スタイル仕様
| 項目 | 値 |
|------|----|
| 背景色 | ライトグレー（`#f0f0f0`） |
| メイン画像幅 | 約60〜65%（両端にpeekを見せる） |
| 両端スライド | `opacity: 0.5〜0.6`（暗め表示） |
| オーバーレイ | 白枠ボックス＋ロゴ＋テキスト（中央配置） |
| 矢印 | 細いシェブロン（`<` `>`）、両端に配置 |
| ドット | 細め・小さめ、active時は濃いグレー |
| フォント | サンセリフ、英語大文字 |

### スライド動作
- **方式**: 横スクロール（peek型・センタリング）
- **peek幅**: 左右それぞれ約150〜180px
- **両端スライド**: active以外は `opacity` を落として表示
- **操作**: 矢印ボタン＋ドット
- **クリック**: 両端スライドをクリックでも切り替え可能（任意）
- **autoplay**: あり

### HTML骨格
```html
<section class="slider-ebisu" role="region" aria-label="メインビジュアル">
  <div class="slider-ebisu__viewport">
    <div class="slider-ebisu__track">
      <div class="slider-ebisu__item is-active">
        <img src="" alt="Blue Note Place">
        <div class="slider-ebisu__overlay">
          <div class="slider-ebisu__overlay-inner">
            <img src="" alt="BNP ロゴ">
            <p class="slider-ebisu__overlay-title">BLUE NOTE PLACE</p>
            <p class="slider-ebisu__overlay-sub">GRAND OPEN — DECEMBER 6, 2022</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="slider-ebisu__btn--prev" aria-label="前へ">‹</button>
  <button class="slider-ebisu__btn--next" aria-label="次へ">›</button>
  <div class="slider-ebisu__dots" role="tablist"></div>
</section>
```

### 実装ポイント
- viewportに `overflow: visible` + 外側wrapperに `overflow: hidden` でpeek実現
- activeスライドのみ `opacity: 1`、他は `opacity: 0.55` をtransitionで切り替え
- オーバーレイは白背景の半透明ボックス（`background: rgba(255,255,255,0.9)`）
- メイン画像の中央配置は `translateX` の計算で調整

---

## ファイル対応表

| No. | 参照画像 | 実装ファイル（予定） | 主な技術 |
|-----|---------|-------------------|---------|
| 01 | ref-01-mitsubishi.png | slider-tab-peek.js / .css | peek + タブ連動 |
| 02 | ref-02-ronherman.png | slider-fade-minimal.js / .css | フェード + ドットのみ |
| 03 | ref-03-tsukuba.png | slider-2col-text.js / .css | 2カラム横スライド |
| 04 | ref-04-toyota.png | slider-2col-image.js / .css | 2カラム + ドット |
| 05 | ref-05-amarakara.png | slider-carousel.js / .css | カルーセル複数表示 |
| 06 | ref-06-ebisu.png | slider-peek-center.js / .css | センターpeek型 |
