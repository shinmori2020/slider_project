/**
 * slider-2col-text.js — No.03 つくば風 2カラム テキスト＋画像スライダー
 * 左テキスト固定 + 右画像のみスライド（クローン無限ループ）
 * Vanilla JS / class構成
 */

class Slider2ColText {
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
    this.viewport   = this.el.querySelector('.slider-tsukuba__viewport');
    this.track      = this.el.querySelector('.slider-tsukuba__track');
    this.items      = Array.from(this.el.querySelectorAll('.slider-tsukuba__item'));
    this.btnPrev    = this.el.querySelector('.slider-tsukuba__btn--prev');
    this.btnNext    = this.el.querySelector('.slider-tsukuba__btn--next');
    this.liveRegion = this.el.querySelector('.slider-tsukuba__live');
    this.counterCurrent = this.el.querySelector('.slider-tsukuba__counter-current');
    this.counterTotal   = this.el.querySelector('.slider-tsukuba__counter-total');

    this.total = this.items.length;
    if (!this.total) return;

    // クローンを生成して無限ループ用に配置
    this.buildClones();

    if (this.counterTotal) {
      this.counterTotal.textContent = String(this.total).padStart(2, '0');
    }

    // クローン分だけオフセット（先頭に1つクローンがあるので index=1 が実質スライド1）
    this.current = 0;
    this.setPosition(1, false);

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

  /* ── 位置セット（trackIndex = クローン含むインデックス） ── */
  setPosition(trackIndex, animate = true) {
    if (!animate) {
      this.track.classList.add('no-transition');
    } else {
      this.track.classList.remove('no-transition');
    }

    const offset = -trackIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    if (!animate) {
      // 強制リフロー後にクラスを戻す
      void this.track.offsetHeight;
    }
  }

  /* ── スライド切り替え ── */
  goTo(index) {
    if (this.isMoving) return;
    this.isMoving = true;

    this.current = index;

    // trackIndex: クローン分の先頭1つ分を加算
    const trackIndex = this.current + 1;
    this.setPosition(trackIndex, true);

    this.updateCounter();
    this.announce();

    // トランジション完了後にクローン境界を処理
    setTimeout(() => {
      // 最後のスライドの次（= firstClone）に移動した場合 → 実体の先頭へジャンプ
      if (this.current >= this.total) {
        this.current = 0;
        this.setPosition(1, false);
        this.updateCounter();
      }
      // 最初のスライドの前（= lastClone）に移動した場合 → 実体の末尾へジャンプ
      if (this.current < 0) {
        this.current = this.total - 1;
        this.setPosition(this.total, false);
        this.updateCounter();
      }
      this.isMoving = false;
    }, 620);
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  /* ── 番号更新 ── */
  updateCounter() {
    if (!this.counterCurrent) return;
    const display = ((this.current % this.total) + this.total) % this.total;
    this.counterCurrent.textContent = String(display + 1).padStart(2, '0');
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
window.Slider2ColText = Slider2ColText;
