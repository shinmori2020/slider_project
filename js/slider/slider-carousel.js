/**
 * slider-carousel.js — No.05 あまから手帖風 Ranking カルーセル
 * 複数カード同時表示・1枚ずつスクロール・無限ループ
 */

class SliderCarousel {
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
    this.carousel   = this.el.querySelector('.slider-ranking__carousel');
    this.track      = this.el.querySelector('.slider-ranking__track');
    this.cards      = Array.from(this.el.querySelectorAll('.slider-ranking__card:not(.is-clone)'));
    this.btnPrev    = this.el.querySelector('.slider-ranking__btn--prev');
    this.btnNext    = this.el.querySelector('.slider-ranking__btn--next');
    this.liveRegion = this.el.querySelector('.slider-ranking__live');

    this.total = this.cards.length;
    if (!this.total) return;

    this.setupClones();
    this.calcDimensions();
    this.goTo(0, false);
    this.bindEvents();

    if (this.options.autoplay) this.startAutoplay();
  }

  /* ── クローン作成（無限ループ用） ── */
  setupClones() {
    /* 前方にクローン（末尾のカード群を先頭にコピー） */
    const clonesNeeded = Math.min(this.total, 5);

    for (let i = this.total - 1; i >= this.total - clonesNeeded; i--) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      this.track.insertBefore(clone, this.track.firstChild);
    }

    /* 後方にクローン（先頭のカード群を末尾にコピー） */
    for (let i = 0; i < clonesNeeded; i++) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      this.track.appendChild(clone);
    }

    this.allCards = Array.from(this.track.querySelectorAll('.slider-ranking__card'));
    this.clonesBefore = clonesNeeded;
  }

  /* ── サイズ計算 ── */
  calcDimensions() {
    const card = this.allCards[0];
    if (!card) return;
    const style = getComputedStyle(this.track);
    this.gap = parseInt(style.gap) || 20;
    this.cardWidth = card.offsetWidth;
    this.step = this.cardWidth + this.gap;
  }

  /* ── スライド移動 ── */
  goTo(index, animate = true) {
    if (this.isMoving && animate) return;

    this.current = index;
    const offset = (this.clonesBefore + this.current) * this.step;

    if (animate) {
      this.isMoving = true;
      this.track.style.transition = `transform ${this.options.interval ? '0.5s' : '0.5s'} cubic-bezier(0.4,0,0.2,1)`;
    } else {
      this.track.style.transition = 'none';
    }

    this.track.style.transform = `translateX(-${offset}px)`;

    if (animate) {
      const onEnd = () => {
        this.track.removeEventListener('transitionend', onEnd);
        this.isMoving = false;
        this.checkLoop();
      };
      this.track.addEventListener('transitionend', onEnd);
    }

    this.announce();
  }

  /* ── ループ境界チェック ── */
  checkLoop() {
    if (this.current >= this.total) {
      this.current = 0;
      this.track.style.transition = 'none';
      const offset = this.clonesBefore * this.step;
      this.track.style.transform = `translateX(-${offset}px)`;
    } else if (this.current < 0) {
      this.current = this.total - 1;
      this.track.style.transition = 'none';
      const offset = (this.clonesBefore + this.current) * this.step;
      this.track.style.transform = `translateX(-${offset}px)`;
    }
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  /* ── スクリーンリーダー通知 ── */
  announce() {
    if (!this.liveRegion) return;
    const real = ((this.current % this.total) + this.total) % this.total;
    this.liveRegion.textContent = `カード ${real + 1} / ${this.total} を表示中`;
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

    // リサイズ時の再計算
    window.addEventListener('resize', () => {
      this.calcDimensions();
      this.goTo(this.current, false);
    });

    // スワイプ
    this.bindSwipe();
  }

  /* ── タッチスワイプ ── */
  bindSwipe() {
    let startX = 0;
    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        this.stopAutoplay();
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

/* file:// 対応 */
window.SliderCarousel = SliderCarousel;
