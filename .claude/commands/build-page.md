# build-page — デモサイトのページ構成を組み立てる手順

## 使い方
```
/build-page
```

---

## 実装フロー

### STEP 1: 全体構成の確認
- 実装済みスライダーの一覧を `slider-reference-spec.md` で確認する
- `design-ui.md` のカラー・フォント変数が `base.css` に定義済みか確認する
- 未定義の場合はユーザーに確認してから進める

### STEP 2: index.html の骨格作成
以下の構成で `index.html` を作成する:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slider Demo</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <!-- 各スライダーCSS -->
</head>
<body>
  <header><!-- サイトタイトル + ナビ --></header>
  <main>
    <!-- 各スライダーセクション × 6 -->
  </main>
  <footer><!-- コピーライト --></footer>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### STEP 3: ナビゲーション作成
- ページ内リンクで各スライダーセクションにジャンプできるナビを作成する
- 各リンクは `#slider-01` のようなIDに対応させる

```html
<nav>
  <a href="#slider-01">01 タブ+Peek</a>
  <a href="#slider-02">02 フェード</a>
  <a href="#slider-03">03 2カラム（テキスト）</a>
  <a href="#slider-04">04 2カラム（画像）</a>
  <a href="#slider-05">05 カルーセル</a>
  <a href="#slider-06">06 センターPeek</a>
</nav>
```

### STEP 4: 各スライダーセクションの配置
- 各セクションに `id="slider-0X"` を付与する
- セクションの上部にNo.とタイトルのラベルを表示する
- 順番: No.01 → No.02 → ... → No.06

### STEP 5: base.css / layout.css の作成
`base.css` に含めるもの:
- CSS変数（`design-ui.md` の`:root`を転記）
- リセットCSS（`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`）
- `prefers-reduced-motion` 対応

`layout.css` に含めるもの:
- `header` / `main` / `footer` のレイアウト
- セクション間のスペーシング
- ナビゲーションのスタイル

### STEP 6: 確認チェックリスト
- [ ] 全スライダーがページ内に配置されているか
- [ ] ナビのリンクが正しくセクションにジャンプするか
- [ ] CSS変数がすべて定義されているか
- [ ] SP表示でレイアウトが崩れていないか
