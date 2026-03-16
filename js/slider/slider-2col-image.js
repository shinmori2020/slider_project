/**
 * slider-2col-image.js — No.04 TOYOTA風 2カラム 画像＋テキストスライダー
 * 左画像スライド + 右テキスト連動切り替え（クローン無限ループ）
 * Vanilla JS / class構成
 */

class Slider2ColImage {
  constructor(el, options = {}) {
    this.el = el;
    this.options = Object.assign({
      autoplay:     false,
      interval:     5000,
      pauseOnHover: true,
    }, options);

    this.current  = 0;
    this.timer    = null;
    this.isMoving = false;

    this.init();
  }

  /* ── 初期化 ── */
  init() {
    this.viewport   = this.el.querySelector('.slider-toyota__viewport');
    this.track      = this.el.querySelector('.slider-toyota__track');
    this.items      = Array.from(this.el.querySelectorAll('.slider-toyota__item'));
    this.infoItems  = Array.from(this.el.querySelectorAll('.slider-toyota__info-item'));
    this.btnPrev    = this.el.querySelector('.slider-toyota__btn--prev');
    this.btnNext    = this.el.querySelector('.slider-toyota__btn--next');
    this.dotsWrap   = this.el.querySelector('.slider-toyota__dots');
    this.liveRegion = this.el.querySelector('.slider-toyota__live');

    this.total = this.items.length;
    if (!this.total) return;

    this.buildDots();
    this.buildClones();

    this.current = 0;
    this.setPosition(1, false);
    this.updateInfo();
    this.updateDots();

    this.bindEvents();

    if (this.options.autoplay) this.startAutoplay();
  }

  /* ── クローン生成 ── */
  buildClones() {
    const firstClone = this.items[0].cloneNode(true);
    const lastClone  = this.items[this.total - 1].cloneNode(true);

    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');

    this.track.appendChild(firstClone);
    this.track.insertBefore(lastClone, this.track.firstChild);
  }

  /* ── ドット生成 ── */
  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';
    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-toyota__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      dot.addEventListener('click', () => {
        this.stopAutoplay();
        this.goTo(i);
      });
      this.dotsWrap.appendChild(dot);
    }
    this.dots = Array.from(this.dotsWrap.querySelectorAll('.slider-toyota__dot'));
  }

  /* ── 位置セット ── */
  setPosition(trackIndex, animate = true) {
    if (!animate) {
      this.track.classList.add('no-transition');
    } else {
      this.track.classList.remove('no-transition');
    }

    const offset = -trackIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    if (!animate) {
      void this.track.offsetHeight;
    }
  }

  /* ── スライド切り替え ── */
  goTo(index) {
    if (this.isMoving) return;
    this.isMoving = true;

    this.current = index;

    const trackIndex = this.current + 1;
    this.setPosition(trackIndex, true);

    const display = ((this.current % this.total) + this.total) % this.total;
    this.updateInfo(display);
    this.updateDots(display);
    this.announce();

    setTimeout(() => {
      if (this.current >= this.total) {
        this.current = 0;
        this.setPosition(1, false);
      }
      if (this.current < 0) {
        this.current = this.total - 1;
        this.setPosition(this.total, false);
      }
      this.isMoving = false;
    }, 620);
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  /* ── テキスト切り替え ── */
  updateInfo(idx) {
    const display = idx !== undefined ? idx : ((this.current % this.total) + this.total) % this.total;
    this.infoItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === display);
    });
  }

  /* ── ドット更新 ── */
  updateDots(idx) {
    if (!this.dots) return;
    const display = idx !== undefined ? idx : ((this.current % this.total) + this.total) % this.total;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === display);
      dot.setAttribute('aria-selected', i === display ? 'true' : 'false');
    });
  }

  /* ── スクリーンリーダー通知 ── */
  announce() {
    if (!this.liveRegion) return;
    const display = ((this.current % this.total) + this.total) % this.total;
    this.liveRegion.textContent = `スライド ${display + 1} / ${this.total}`;
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

    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this.stopAutoplay(); this.prev(); }
      if (e.key === 'ArrowRight') { this.stopAutoplay(); this.next(); }
    });

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

    this.bindSwipe();
  }

  /* ── タッチスワイプ ── */
  bindSwipe() {
    let startX = 0;
    this.viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.viewport.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        this.stopAutoplay();
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

/* file:// 対応のため window に登録 */
window.Slider2ColImage = Slider2ColImage;
