/**
 * slider-peek-center.js — No.06 恵比寿ガーデンプレイス風 センターPeek型
 * 中央にメインスライド、左右に前後スライドを覗かせるpeek型スライダー
 * 無限ループ（クローン方式）対応
 */

class SliderPeekCenter {
  constructor(el, options = {}) {
    this.el = el;
    this.options = Object.assign({
      autoplay:     true,
      interval:     4000,
      pauseOnHover: true,
    }, options);

    this.current  = 0;
    this.timer    = null;
    this.isMoving = false;

    this.init();
  }

  /* ── 初期化 ── */
  init() {
    this.clip       = this.el.querySelector('.slider-ebisu__clip');
    this.track      = this.el.querySelector('.slider-ebisu__track');
    this.items      = Array.from(this.el.querySelectorAll('.slider-ebisu__item:not(.is-clone)'));
    this.btnPrev    = this.el.querySelector('.slider-ebisu__btn--prev');
    this.btnNext    = this.el.querySelector('.slider-ebisu__btn--next');
    this.dotsWrap   = this.el.querySelector('.slider-ebisu__dots');
    this.liveRegion = this.el.querySelector('.slider-ebisu__live');

    this.total = this.items.length;
    if (!this.total) return;

    this.setupClones();
    this.buildDots();
    this.calcDimensions();
    this.goTo(0, false);
    this.bindEvents();

    if (this.options.autoplay) this.startAutoplay();
  }

  /* ── クローン作成（無限ループ用） ── */
  setupClones() {
    /* 前方クローン（末尾のスライドを先頭にコピー） */
    for (let i = this.total - 1; i >= 0; i--) {
      const clone = this.items[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      this.track.insertBefore(clone, this.track.firstChild);
    }

    /* 後方クローン（先頭のスライドを末尾にコピー） */
    for (let i = 0; i < this.total; i++) {
      const clone = this.items[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      this.track.appendChild(clone);
    }

    this.allItems = Array.from(this.track.querySelectorAll('.slider-ebisu__item'));
    this.clonesBefore = this.total;
  }

  /* ── ドット生成 ── */
  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';

    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-ebisu__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        this.stopAutoplay();
        this.goTo(i);
      });
      this.dotsWrap.appendChild(dot);
    }

    this.dots = Array.from(this.dotsWrap.querySelectorAll('.slider-ebisu__dot'));
  }

  /* ── サイズ計算 ── */
  calcDimensions() {
    if (!this.clip) return;
    /* clientWidth でボーダーを除いた内側の幅を取得 */
    this.slideWidth = this.clip.clientWidth;
    /* 各スライドの幅を明示的にセット */
    this.allItems.forEach(item => {
      item.style.width = this.slideWidth + 'px';
    });
  }

  /* ── スライド移動 ── */
  goTo(index, animate = true) {
    if (this.isMoving && animate) return;

    this.current = index;
    const offset = (this.clonesBefore + this.current) * this.slideWidth;

    if (animate) {
      this.isMoving = true;
      this.track.style.transition = `transform ${this.options.interval ? '0.6s' : '0.6s'} cubic-bezier(0.4,0,0.2,1)`;
    } else {
      this.track.style.transition = 'none';
    }

    this.track.style.transform = `translateX(-${offset}px)`;

    /* active クラスの更新 */
    this.updateActive();

    if (animate) {
      const onEnd = () => {
        this.track.removeEventListener('transitionend', onEnd);
        this.isMoving = false;
        this.checkLoop();
      };
      this.track.addEventListener('transitionend', onEnd);
    }

    this.updateDots();
    this.updateBg();
    this.announce();
  }

  /* ── activeクラスの更新 ── */
  updateActive() {
    const activeIndex = this.clonesBefore + this.current;
    this.allItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === activeIndex);
    });
  }

  /* ── ループ境界チェック ── */
  checkLoop() {
    if (this.current >= this.total) {
      this.current = 0;
      this.track.style.transition = 'none';
      const offset = this.clonesBefore * this.slideWidth;
      this.track.style.transform = `translateX(-${offset}px)`;
      this.updateActive();
      this.updateDots();
    } else if (this.current < 0) {
      this.current = this.total - 1;
      this.track.style.transition = 'none';
      const offset = (this.clonesBefore + this.current) * this.slideWidth;
      this.track.style.transform = `translateX(-${offset}px)`;
      this.updateActive();
      this.updateDots();
    }
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  /* ── ドット更新 ── */
  updateDots() {
    if (!this.dots) return;
    const real = ((this.current % this.total) + this.total) % this.total;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === real);
      dot.setAttribute('aria-selected', i === real ? 'true' : 'false');
    });
  }

  /* ── 背景色の更新 ── */
  updateBg() {
    const real = ((this.current % this.total) + this.total) % this.total;
    const bg = this.items[real].dataset.bg;
    if (bg) this.el.style.backgroundColor = bg;
  }

  /* ── スクリーンリーダー通知 ── */
  announce() {
    if (!this.liveRegion) return;
    const real = ((this.current % this.total) + this.total) % this.total;
    this.liveRegion.textContent = `スライド ${real + 1} / ${this.total} を表示中`;
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
    /* 矢印ボタン */
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        this.stopAutoplay();
        this.prev();
      });
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        this.stopAutoplay();
        this.next();
      });
    }

    /* キーボード操作 */
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this.stopAutoplay(); this.prev(); }
      if (e.key === 'ArrowRight') { this.stopAutoplay(); this.next(); }
    });

    /* hover / focus で一時停止 */
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

    /* リサイズ時の再計算 */
    window.addEventListener('resize', () => {
      this.calcDimensions();
      this.goTo(this.current, false);
    });

    /* タッチスワイプ */
    this.bindSwipe();
  }

  /* ── タッチスワイプ ── */
  bindSwipe() {
    let startX = 0;
    const target = this.clip || this.el;

    target.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    target.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        this.stopAutoplay();
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

/* file:// 対応 */
window.SliderPeekCenter = SliderPeekCenter;
