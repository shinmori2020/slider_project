/**
 * slider-fade-minimal.js — No.02 Ron Herman 風フェードスライダー
 * Vanilla JS / class構成
 */

class SliderFadeMinimal {
  constructor(el, options = {}) {
    this.el = el;
    this.options = Object.assign({
      autoplay:     true,
      interval:     4500,
      pauseOnHover: true,
    }, options);

    this.current  = 0;
    this.timer    = null;
    this.isMoving = false;

    this.init();
  }

  /* ── 初期化 ── */
  init() {
    this.track         = this.el.querySelector('.slider-ronherman__track');
    this.items         = Array.from(this.el.querySelectorAll('.slider-ronherman__item'));
    this.dotsContainer = this.el.querySelector('.slider-ronherman__dots');
    this.liveRegion    = this.el.querySelector('.slider-ronherman__live');

    if (!this.items.length) return;

    this.buildDots();
    this.goTo(0, false);
    this.bindEvents();

    if (this.options.autoplay) this.startAutoplay();
  }

  /* ── ドット生成 ── */
  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.items.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className  = 'slider-ronherman__dot';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', `スライド ${i + 1}`);
      btn.addEventListener('click', () => this.goTo(i, true));
      this.dotsContainer.appendChild(btn);
    });

    this.dots = Array.from(this.dotsContainer.querySelectorAll('.slider-ronherman__dot'));
  }

  /* ── スライド切り替え ── */
  goTo(index, userInitiated = false) {
    if (this.isMoving) return;

    const total = this.items.length;
    this.current = ((index % total) + total) % total;
    this.isMoving = true;

    /* 画像の切り替え */
    this.items.forEach((item, i) => {
      item.classList.toggle('is-active', i === this.current);
    });

    this.updateDots();
    this.announce();

    // フェード時間後にロック解除
    setTimeout(() => { this.isMoving = false; }, 800);
  }

  next() { this.goTo(this.current + 1, true); }
  prev() { this.goTo(this.current - 1, true); }

  /* ── ドット更新 ── */
  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((dot, i) => {
      const active = i === this.current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  /* ── スクリーンリーダー通知 ── */
  announce() {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = `スライド ${this.current + 1} / ${this.items.length}`;
  }

  /* ── オートプレイ ── */
  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => this.next(), this.options.interval);
  }

  stopAutoplay() {
    clearInterval(this.timer);
    this.timer = null;
  }

  /* ── イベントバインド ── */
  bindEvents() {
    // キーボード操作
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this.stopAutoplay(); this.prev(); }
      if (e.key === 'ArrowRight') { this.stopAutoplay(); this.next(); }
    });

    // hover で一時停止
    if (this.options.pauseOnHover) {
      this.el.addEventListener('mouseenter', () => this.stopAutoplay());
      this.el.addEventListener('mouseleave', () => {
        if (this.options.autoplay) this.startAutoplay();
      });
      this.el.addEventListener('focusin',  () => this.stopAutoplay());
      this.el.addEventListener('focusout', () => {
        if (this.options.autoplay) this.startAutoplay();
      });
    }

    // スワイプ
    this.bindSwipe();
  }

  /* ── タッチスワイプ ── */
  bindSwipe() {
    let startX = 0;
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        this.stopAutoplay();
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

/* file:// 対応のため window に登録 */
window.SliderFadeMinimal = SliderFadeMinimal;
