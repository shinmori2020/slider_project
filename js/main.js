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
