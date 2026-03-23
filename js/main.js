/**
 * main.js — エントリーポイント
 * 各スライダーをインスタンス化する
 */

/* ── No.01 タブ連動 + Peek型 ── */
document.querySelectorAll('.slider-mitsubishi').forEach(el => {
  new SliderTabPeek(el);
});

/* ── No.02 フェードスライダー ── */
document.querySelectorAll('.slider-ronherman').forEach(el => {
  new SliderFadeMinimal(el);
});

/* ── No.03 2カラム テキスト＋画像 ── */
document.querySelectorAll('.slider-tsukuba').forEach(el => {
  new Slider2ColText(el);
});

/* ── No.04 2カラム 画像＋テキスト ── */
document.querySelectorAll('.slider-toyota').forEach(el => {
  new Slider2ColImage(el);
});

/* ── No.05 ランキング カルーセル ── */
document.querySelectorAll('.slider-ranking').forEach(el => {
  new SliderCarousel(el);
});

/* ── No.06 センターPeek型 ── */
document.querySelectorAll('.slider-ebisu').forEach(el => {
  new SliderPeekCenter(el);
});
