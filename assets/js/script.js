window.addEventListener("load", () => {
  document.body.classList.add("is-show");

  /**
   * スムーススクロール
   */
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /**
   * ページ遷移前にフェードアウトさせる処理
   */
  function link() {
    document.querySelectorAll(".c-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        const url = this.getAttribute("href");
        if (!url || url === "#") return;
        e.preventDefault();
        document.body.classList.remove("is-show");
        setTimeout(() => {
          window.location.href = url;
        }, 500);
      });
    });
  }

  /**
   * ハンバーガーメニューコンテンツボタン制御処理
   */
  function changeButtonText() {
    const openBtn = document.querySelector(".js-menu-open");
    const closeBtn = document.querySelector(".js-menu-close");
    const nav = document.querySelector(".js-menu-content");

    openBtn.addEventListener("click", function () {
      nav.classList.add("is-open");
    });

    closeBtn.addEventListener("click", function () {
      nav.classList.remove("is-open");
    });
  }

  /**
   * スクロールで画像拡大
   */
  function scrollZoom() {
    const heroWrapper = document.querySelector(".js-scrollWrapper");
    const hero = heroWrapper.querySelector(".js-scroll-image");
    const heroText = heroWrapper.querySelector(".js-scroll-text");
    const heroLogo = heroWrapper.querySelector(".js-scroll-logo");

    const subWrapper = document.querySelector(".js-subHeroWrapper");
    const subHero = document.querySelector(".js-subHeroImage");

    function update() {
      // ===== hero =====
      const wrapperTop = heroWrapper.getBoundingClientRect().top;
      const heroProgress = Math.min(Math.max(-wrapperTop / window.innerHeight, 0), 1);

      // PC
      if (window.innerWidth >= 1025) {
        const width = 50 + heroProgress * 50;
        const scale = 0.6 + heroProgress * 0.4;
        hero.style.width = `${width}%`;
        hero.style.transform = `scale(${scale})`;
      } else {
        // SP
        const width = 80 + heroProgress * 20;
        const scale = 0.8 + heroProgress * 0.2;
        hero.style.width = `${width}%`;
        hero.style.transform = `scale(${scale})`;
      }
      // 少し下へ
      const moveY = Math.min(heroProgress * 80, 30);
      if (heroText) heroText.style.transform = `translate(-50%, -50%) translateY(${moveY}px)`;
      if (heroLogo) heroLogo.style.transform = `translate(-50%, -30%) translateY(${moveY}px)`;

      // ロゴフェードアウト
      const opacity = Math.max(1 - heroProgress * 2, 0);
      if (heroLogo) heroLogo.style.opacity = opacity;

      // ===== subHero =====
      const subTop = subWrapper.getBoundingClientRect().top;
      const subProgress = Math.min(Math.max(-subTop / window.innerHeight, 0), 1);

      // width: 50 → 100
      const subWidth = 50 + subProgress * 50;
      // scale: 0.9 → 1.1
      const subScale = 0.9 + subProgress * 0.2;

      subHero.style.width = `${subWidth}%`;
      subHero.style.transform = `scale(${subScale})`;
    }

    update(); // 初期表示時に即適用
    lenis.on("scroll", update);
  }


  /**
   * スクロールに応じて画像内容を上下させるパララックス
   */
  function parallaxImage() {
    const images = document.querySelectorAll(".js-parallaxImage");

    images.forEach((image) => {
      const rect = image.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const move = (scrollPercent - 0.5) * 320;
      image.style.setProperty("--parallax", `${move}px`);
    });
  }

  lenis.on("scroll", () => {
    parallaxImage();
  });

  /**
   * フッターの画像
   */
  function slideImage() {
    const track = document.querySelectorAll(".js-footerImage__row");

    track.forEach((item, index) => {
      item.innerHTML += item.innerHTML;

      const isReverse = index % 2 === 1;
      let y = isReverse ? item.scrollHeight / 2 : 0;
      const speed = 1;

      function animate() {
        if (isReverse) {
          y -= speed;
          if (y <= 0) y = item.scrollHeight / 2;
        } else {
          y += speed;
          if (y >= item.scrollHeight / 2) y = 0;
        }

        item.style.transform = `translateY(-${y}px)`;
        requestAnimationFrame(animate);
      }
      animate();
    });
  }

  /**
   * トップページへ飛ぶ
   */
  const backTop = document.querySelector(".c-backTop");

  backTop.addEventListener("click", (e) => {
    e.preventDefault();

    if (typeof lenis !== "undefined") {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });

  slideImage();
  scrollZoom();
  link();
  changeButtonText();
  parallaxImage();
});
