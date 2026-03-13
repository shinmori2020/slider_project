/**
 * slider-tab-peek.js
 * No.01 三菱風 — タブ連動 + Peek型横スライダー
 *
 * 無限ループ: 最初・最後にクローンスライドを配置し、
 * クローン位置に達したら瞬間移動で本物の位置に戻す。
 */

class SliderTabPeek {
  constructor(el, options = {}) {
    this.el = el;

    this.options = {
      autoplay:     true,
      interval:     4000,
      pauseOnHover: true,
      gapPC:        240,
      gapSP:        96,
      breakpoint:   768,
      ...options,
    };

    /* ── State ── */
    this.current     = 0;   // 実スライドのインデックス (0 〜 total-1)
    this.isAnimating = false;
    this.autoplayTimer = null;
    this.resizeTimer   = null;

    /* ── Elements ── */
    this.stage      = el.querySelector('.slider-mitsubishi__stage');
    this.track      = el.querySelector('.slider-mitsubishi__track');
    this.items      = [...el.querySelectorAll('.slider-mitsubishi__item')]; // クローン前の実アイテム
    this.tabs       = [...el.querySelectorAll('.slider-mitsubishi__tab')];
    this.btnPrev    = el.querySelector('.slider-mitsubishi__btn--prev');
    this.btnNext    = el.querySelector('.slider-mitsubishi__btn--next');
    this.captionEl  = el.querySelector('.slider-mitsubishi__caption');
    this.liveRegion = el.querySelector('.slider-mitsubishi__live');

    this.total    = this.items.length;
    this.captions = this.items.map(item => item.dataset.caption || '');

    /* クローン数（前後2枚ずつ：中央用1枚 + peek用1枚） */
    this.clonesBefore = 2;
    this.clonesAfter  = 2;

    this.init();
  }

  /* ────────────────────────────────────────────────────────
     Init
  ──────────────────────────────────────────────────────── */
  init() {
    this.setupClones();
    this.allTrackItems = [...this.track.querySelectorAll('.slider-mitsubishi__item')];
    this.calcDimensions();
    this.positionAt(this.vIndex, false);
    this.updateItemStyles();
    this.bindEvents();
    if (this.options.autoplay) this.startAutoplay();
  }

  /* ────────────────────────────────────────────────────────
     Clone Setup
     先頭に末尾スライドのクローン、末尾に先頭スライドのクローンを追加
  ──────────────────────────────────────────────────────── */
  setupClones() {
    /* 先頭に末尾のクローンを追加（prev方向ループ用） */
    for (let i = this.clonesBefore - 1; i >= 0; i--) {
      const srcIdx = (this.total - 1 - i + this.total) % this.total;
      const clone  = this.items[srcIdx].cloneNode(true);
      clone.classList.add('is-clone');
      clone.classList.remove('is-active');
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('id');
      this.track.insertBefore(clone, this.track.firstChild);
    }

    /* 末尾に先頭のクローンを追加（next方向ループ用） */
    for (let i = 0; i < this.clonesAfter; i++) {
      const srcIdx = i % this.total;
      const clone  = this.items[srcIdx].cloneNode(true);
      clone.classList.add('is-clone');
      clone.classList.remove('is-active');
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('id');
      this.track.appendChild(clone);
    }
  }

  /* ────────────────────────────────────────────────────────
     Virtual Index
     クローンを含むトラック内での実際の位置
  ──────────────────────────────────────────────────────── */
  get vIndex() {
    return this.current + this.clonesBefore;
  }

  /* ────────────────────────────────────────────────────────
     Dimensions
  ──────────────────────────────────────────────────────── */
  get isSP() {
    return window.innerWidth < this.options.breakpoint;
  }

  calcDimensions() {
    const stageW = this.stage.offsetWidth;
    this.gap     = this.isSP ? this.options.gapSP : this.options.gapPC;

    /* 中央スライドがステージの約半幅 → 隣接スライドが約半分見切れるレイアウト */
    this.itemW = Math.round((stageW - this.gap * 2) / 2);

    /* peek: 中央スライドの左端が置かれる位置（対称配置） */
    this.peek = Math.round((stageW - this.itemW) / 2);

    /* CSS変数を更新（header / footer のパディングを合わせる） */
    this.el.style.setProperty('--sm-peek', `${this.peek}px`);
    this.el.style.setProperty('--sm-gap',  `${this.gap}px`);

    /* クローン含む全アイテムに幅を適用 */
    this.allTrackItems.forEach(item => {
      item.style.width = `${this.itemW}px`;
    });
  }

  /* ────────────────────────────────────────────────────────
     Position-based item styling
     中央からの距離に応じて scale / opacity を連続的に変化させる
  ──────────────────────────────────────────────────────── */
  getTrackX() {
    const style = window.getComputedStyle(this.track);
    const matrix = new DOMMatrix(style.transform);
    return matrix.m41;
  }

  updateItemStyles() {
    const trackX  = this.getTrackX();
    const centerX = this.peek;
    const step    = this.itemW + this.gap;

    this.allTrackItems.forEach((item, i) => {
      const itemLeft = i * step + trackX;
      const dist     = Math.abs(itemLeft - centerX);
      const t        = Math.min(dist / step, 1);

      item.style.transform = `scale(${1 - t * 0.07})`;
      item.style.opacity   = 1 - t * 0.45;
    });
  }

  startStyleLoop() {
    const loop = () => {
      this.updateItemStyles();
      if (this.isAnimating) {
        this._rafId = requestAnimationFrame(loop);
      }
    };
    this._rafId = requestAnimationFrame(loop);
  }

  stopStyleLoop() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /* ────────────────────────────────────────────────────────
     Position
  ──────────────────────────────────────────────────────── */
  positionAt(vIdx, animate) {
    this.track.style.transition = animate
      ? 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';

    const offset = this.peek - vIdx * (this.itemW + this.gap);
    this.track.style.transform = `translateX(${offset}px)`;

    if (!animate) {
      /* transition: none を即座に反映させるためリフロー強制 */
      // eslint-disable-next-line no-unused-expressions
      this.track.offsetHeight;
    }
  }

  /* ────────────────────────────────────────────────────────
     Navigation
     realTarget は real index の範囲外（-1 や total）も許容する
     → クローンを経由して無限ループを実現
  ──────────────────────────────────────────────────────── */
  goTo(realTarget, userInitiated = false) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    /* 表示用の正規化インデックス（タブ・キャプション更新に使用） */
    const displayReal = ((realTarget % this.total) + this.total) % this.total;

    /* タブの付け替え */
    this.tabs[this.current]?.classList.remove('is-active');
    this.tabs[this.current]?.setAttribute('aria-selected', 'false');

    this.current = displayReal;

    this.tabs[this.current]?.classList.add('is-active');
    this.tabs[this.current]?.setAttribute('aria-selected', 'true');

    const vTarget = realTarget + this.clonesBefore;
    const isClone = realTarget < 0 || realTarget >= this.total;

    /* スライドアニメーション開始 */
    this.positionAt(vTarget, true);

    /* rAF ループで scale / opacity を位置に連動して更新 */
    this.startStyleLoop();

    this.updateCaption();
    this.announce();

    /* transition完了後の処理 */
    let settled = false;

    const settle = (e) => {
      if (e && e.target !== this.track) return;
      if (settled) return;
      settled = true;
      this.track.removeEventListener('transitionend', settle);
      this.stopStyleLoop();

      if (isClone) {
        /* 実位置へ瞬間移動（transition: none） */
        this.positionAt(this.vIndex, false);
      }

      /* 最終位置での scale / opacity を確定 */
      this.updateItemStyles();
      this.isAnimating = false;
    };

    this.track.addEventListener('transitionend', settle);
    setTimeout(() => settle(), 750);

    if (userInitiated) {
      this.stopAutoplay();
      if (this.options.autoplay) this.startAutoplay();
    }
  }

  next() { this.goTo(this.current + 1, true); }
  prev() { this.goTo(this.current - 1, true); }

  /* ────────────────────────────────────────────────────────
     Caption
  ──────────────────────────────────────────────────────── */
  updateCaption() {
    if (!this.captionEl) return;
    this.captionEl.classList.add('is-animating');
    setTimeout(() => {
      this.captionEl.textContent = this.captions[this.current];
      this.captionEl.classList.remove('is-animating');
    }, 220);
  }

  /* ────────────────────────────────────────────────────────
     Announce
  ──────────────────────────────────────────────────────── */
  announce() {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = '';
    requestAnimationFrame(() => {
      this.liveRegion.textContent =
        `スライド ${this.current + 1} / ${this.total}: ${this.captions[this.current]}`;
    });
  }

  /* ────────────────────────────────────────────────────────
     Autoplay
  ──────────────────────────────────────────────────────── */
  startAutoplay() {
    if (!this.options.autoplay) return;
    this.stopAutoplay();
    this.autoplayTimer = setInterval(
      () => this.goTo(this.current + 1),
      this.options.interval
    );
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /* ────────────────────────────────────────────────────────
     Events
  ──────────────────────────────────────────────────────── */
  bindEvents() {
    this.btnPrev?.addEventListener('click', () => this.prev());
    this.btnNext?.addEventListener('click', () => this.next());

    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        if (i !== this.current) this.goTo(i, true);
      });
    });

    /* 非activeアイテムクリックで移動 */
    this.items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== this.current) this.goTo(i, true);
      });
    });

    /* キーボード ← → */
    this.el.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this.prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
    });

    /* Pause on hover / focus */
    if (this.options.pauseOnHover) {
      this.el.addEventListener('mouseenter', () => this.stopAutoplay());
      this.el.addEventListener('mouseleave', () => this.startAutoplay());
      this.el.addEventListener('focusin',   () => this.stopAutoplay());
      this.el.addEventListener('focusout',  () => this.startAutoplay());
    }

    this.bindSwipe();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.calcDimensions();
        this.positionAt(this.vIndex, false);
        this.updateItemStyles();
      }, 200);
    });
  }

  /* ────────────────────────────────────────────────────────
     Swipe
  ──────────────────────────────────────────────────────── */
  bindSwipe() {
    let startX = 0, startY = 0, dragging = false;

    this.el.addEventListener('touchstart', e => {
      startX   = e.touches[0].clientX;
      startY   = e.touches[0].clientY;
      dragging = true;
    }, { passive: true });

    this.el.addEventListener('touchend', e => {
      if (!dragging) return;
      dragging = false;
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = Math.abs(startY - e.changedTouches[0].clientY);
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        diffX > 0 ? this.next() : this.prev();
      }
    });
  }
}

/* グローバルに公開 */
window.SliderTabPeek = SliderTabPeek;
