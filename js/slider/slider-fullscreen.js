/**
 * slider-fullscreen.js — No.07 縦スクロール型フルスクリーンスライダー
 * フェード切替 + Ken Burns + 縦ドットナビ + スクロール連動（sticky方式）
 */

class SliderFullscreen {
  constructor(el, options = {}) {
    this.el = el;
    this.options = Object.assign({
      autoplay:     false,
      interval:     6000,
      pauseOnHover: true,
    }, options);

    this.current  = 0;
    this.timer    = null;
    this.isMoving = false;

    this.init();
  }

  /* ── 初期化 ── */
  init() {
    this.track      = this.el.querySelector('.slider-fullscreen__track');
    this.items      = Array.from(this.el.querySelectorAll('.slider-fullscreen__item'));
    this.dotsWrap   = this.el.querySelector('.slider-fullscreen__dots');
    this.counter    = this.el.querySelector('.slider-fullscreen__counter');
    this.liveRegion = this.el.querySelector('.slider-fullscreen__live');

    this.total = this.items.length;
    if (!this.total) return;

    /* 親セクションの高さをスライド数 × 100vh に設定 */
    this.section = this.el.closest('.demo-section');
    if (this.section) {
      this.section.style.height = (this.total * 100) + 'vh';
    }

    this.buildDots();
    this.goTo(0, false);
    this.bindEvents();
  }

  /* ── ドット生成 ── */
  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';

    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-fullscreen__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        this.goTo(i);
      });
      this.dotsWrap.appendChild(dot);
    }

    this.dots = Array.from(this.dotsWrap.querySelectorAll('.slider-fullscreen__dot'));
  }

  /* ── スライド移動（フェード切替） ── */
  goTo(index, animate = true) {
    if (index < 0) index = 0;
    if (index >= this.total) index = this.total - 1;
    if (index === this.current && animate) return;

    this.current = index;

    /* activeクラスの切替 */
    this.items.forEach((item, i) => {
      item.classList.toggle('is-active', i === this.current);
    });

    this.updateDots();
    this.updateCounter();
    this.announce();
  }

  /* ── ドット更新 ── */
  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.current);
      dot.setAttribute('aria-selected', i === this.current ? 'true' : 'false');
    });
  }

  /* ── カウンター更新 ── */
  updateCounter() {
    if (!this.counter) return;
    const cur = this.counter.querySelector('.slider-fullscreen__counter-current');
    if (cur) cur.textContent = String(this.current + 1).padStart(2, '0');
  }

  /* ── スクリーンリーダー通知 ── */
  announce() {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = `スライド ${this.current + 1} / ${this.total} を表示中`;
  }

  /* ── イベントバインド ── */
  bindEvents() {
    /* スクロール連動：セクション内のスクロール位置でスライドを決定 */
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        this.onScroll();
        ticking = false;
      });
    });

    /* キーボード操作 */
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goTo(this.current - 1);
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.goTo(this.current + 1);
      }
    });

    /* タッチスワイプ（縦方向） — ページスクロールと連動するため軽量に */
    this.bindSwipe();
  }

  /* ── スクロール位置からスライドを計算 ── */
  onScroll() {
    if (!this.section) return;

    const rect = this.section.getBoundingClientRect();
    /* セクション上端からの進行距離 */
    const scrolled = -rect.top;
    /* 1スライドあたりのスクロール距離 */
    const perSlide = window.innerHeight;
    /* 現在のスライドインデックス */
    const index = Math.floor(scrolled / perSlide);
    const clamped = Math.max(0, Math.min(this.total - 1, index));

    if (clamped !== this.current) {
      this.goTo(clamped);
    }
  }

  /* ── タッチスワイプ（縦方向） ── */
  bindSwipe() {
    let startY = 0;

    this.el.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.el.addEventListener('touchend', (e) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.goTo(this.current + 1) : this.goTo(this.current - 1);
      }
    }, { passive: true });
  }
}

/* file:// 対応 */
window.SliderFullscreen = SliderFullscreen;
