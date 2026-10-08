(function () {
  "use strict";

      
  var PASSCODE = "1511";
  var LOADING_MS = 3000;

  var FLOWER_CYCLE = [
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
  ];

  var PHOTOS = [
    "assets/photos/image1.jpg",
    "assets/photos/image2.jpg",
    "assets/photos/image3.jpg",
    "assets/photos/image4.jpg",
    "assets/photos/image5.jpg",
    "assets/photos/image6.jpg",
    "assets/photos/image7.jpg",
    "assets/photos/image8.jpg",
    "assets/photos/image9.jpg",
    "assets/photos/image10.jpg",
  ];

  var LETTER_TEXT =
    "To My Dearest, I am writing this little note just because you have been on my mind all day long, which is nothing new since you pretty much live there anyway. Every single time I think about your smile, my heart does a tiny happy dance. I find myself smiling at my phone like a complete fool whenever your name pops up, and honestly, it is my absolute favorite part of the day. You have this wonderful way of making the whole world feel brighter and sweeter just by being you. Thank you for all the warm hugs, the soft giggles we share, and the beautiful comfort of knowing you are mine. Being your boyfriend is the happiest thing that has ever happened to me, and I count myself incredibly lucky to hold your hand and walk through life beside you. Please never forget how deeply you are loved and cherished. You are my favorite person, my safest space, and my absolute dream come true. I love you more than all the stars in the night sky, and I cannot wait until the next time I get to hold you close. Forever and always yours, Your Love";

      
  var giftLanding = document.getElementById("gift-landing");
  var giftBoxBtn = document.getElementById("gift-box-btn");
  var bloomField = document.getElementById("bloom-field");
  var page2 = document.getElementById("page2");
  var page3 = document.getElementById("page3");
  var page3Back = document.getElementById("page3-back");

  var lockBtn = document.getElementById("lock-btn");
  var lockHint = document.getElementById("lock-hint");
  var lockUnlockedMsg = document.getElementById("lock-unlocked-msg");

  var pkOverlay = document.getElementById("passkey-overlay");
  var pkClose = document.getElementById("pk-close");
  var pkDotsWrap = document.getElementById("pk-dots");
  var pkErrorMsg = document.getElementById("pk-error-msg");
  var pkTitle = document.getElementById("pk-title");
  var pkKeypad = document.getElementById("pk-keypad");
  var pkParticles = document.getElementById("pk-particles");

  var loadingOverlay = document.getElementById("loading-overlay");

  var savedScrollY = 0;

      
  var flowerIdCounter = 0;

  function spawnFlower(opts) {
    var img = document.createElement("img");
    img.src = FLOWER_CYCLE[flowerIdCounter % FLOWER_CYCLE.length];
    img.alt = "";
    img.className = "bloom-flower in";
    img.loading = "eager";
    img.decoding = "async";
    img.draggable = false;
    img.style.width = opts.size + "px";
    img.style.height = opts.size + "px";
    img.style.setProperty("--fx", opts.x - opts.size / 2 + "px");
    img.style.setProperty("--fy", opts.y - opts.size / 2 + "px");
    img.style.setProperty("--fall", opts.fallDist.toFixed(0) + "px");
    img.style.setProperty("--sway1", opts.sway1.toFixed(1) + "px");
    img.style.setProperty("--sway2", opts.sway2.toFixed(1) + "px");
    img.style.setProperty("--rot-start", opts.startRot.toFixed(1) + "deg");
    img.style.setProperty("--rot-end", opts.restRot.toFixed(1) + "deg");
    img.style.setProperty("--ldelay", opts.launchDelay.toFixed(2) + "s");
    img.style.setProperty("--rdur", opts.rdur.toFixed(2) + "s");
    img.style.setProperty("--dur", opts.floatDur.toFixed(2) + "s");
    img.style.setProperty("--fdelay", opts.floatDelay.toFixed(2) + "s");
    img.dataset.id = flowerIdCounter;
    img.dataset.x = opts.x;
    img.dataset.y = opts.y;
    img.dataset.size = opts.size;
    bloomField.appendChild(img);
    flowerIdCounter++;
    return img;
  }

  function startGiftOpen() {
    if (giftLanding.classList.contains("state-bloom")) return;
    giftLanding.classList.add("state-bloom");

    var w = window.innerWidth,
      h = window.innerHeight;
    var isMobile = Math.min(w, h) < 640;
    var desiredCount = isMobile ? 200 : 380;
    var hardCap = isMobile ? 260 : 520;
    var rainWindow = isMobile ? 2200 : 2800;
    var speedMin = isMobile ? 210 : 240;
    var speedRange = isMobile ? 90 : 130;

    var spacing = Math.sqrt((w * h) / desiredCount);
    spacing = Math.max(18, Math.min(72, spacing));

    var baseSize = isMobile ? 88 : 128;
    var sizeVar = isMobile ? 46 : 68;

    var cells = [];
    for (var gy = -spacing; gy < h + spacing; gy += spacing) {
      for (var gx = -spacing; gx < w + spacing; gx += spacing) {
        cells.push({
          x: gx + (Math.random() - 0.5) * spacing * 0.85,
          y: gy + (Math.random() - 0.5) * spacing * 0.85,
        });
      }
    }

    if (cells.length > hardCap) {
      var stride = Math.ceil(cells.length / hardCap);
      cells = cells.filter(function (_, i) {
        return i % stride === 0;
      });
    }

    var maxFinish = 0;

    cells.forEach(function (c) {
      var size = baseSize + Math.random() * sizeVar;
      var restRot = Math.random() * 32 - 16;
      var startRot = (Math.random() < 0.5 ? -1 : 1) * (28 + Math.random() * 35);

      var fallDist = c.y + size + 90 + Math.random() * 260;
      var speed = speedMin + Math.random() * speedRange;
      var rdur = fallDist / speed;
      var launchDelay = Math.random() * (rainWindow / 1000);
      var finish = launchDelay + rdur;
      if (finish > maxFinish) maxFinish = finish;

      var sway1 = (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 32);
      var sway2 = -sway1 * (0.5 + Math.random() * 0.35);

      var floatDur = 3 + Math.random() * 4;
      var floatDelay = finish + Math.random() * 1.5;

      spawnFlower({
        x: c.x,
        y: c.y,
        size: size,
        fallDist: fallDist,
        rdur: rdur,
        launchDelay: launchDelay,
        sway1: sway1,
        sway2: sway2,
        restRot: restRot,
        startRot: startRot,
        floatDur: floatDur,
        floatDelay: floatDelay,
      });
    });

    setTimeout(startCurtainOpen, maxFinish * 1000 + 550);
  }

  function startCurtainOpen() {
    giftLanding.classList.remove("state-bloom");
    giftLanding.classList.add("state-curtain");

    var w = window.innerWidth;
    var cx = w / 2;
    var shiftX = w / 2 + 260;
    var maxDx = Math.max(cx, w - cx) + 200;

    var flowers = bloomField.querySelectorAll(".bloom-flower");

    flowers.forEach(function (el) {
      var x = parseFloat(el.dataset.x);
      var dir = x < cx ? -1 : 1;
      var dx = Math.abs(x - cx);
      var edgeFactor = Math.min(1, dx / maxDx);
      var cdelay = (1 - edgeFactor) * 0.16;

      el.style.setProperty("--cx", dir * shiftX + "px");
      el.style.setProperty("--cy", (Math.random() * 50 - 25) + "px");
      el.style.setProperty("--cdelay", cdelay.toFixed(2) + "s");
      el.classList.remove("in");
    });

    
    void bloomField.offsetWidth;

    flowers.forEach(function (el) {
      el.classList.add("curtain-open");
    });

    setTimeout(goToPage2, 1650);
  }

  function goToPage2() {
    giftLanding.classList.add("hidden");
    page2.classList.add("shown");
    initPage2();
  }

  giftBoxBtn.addEventListener("click", startGiftOpen);

      
  var page2Initialised = false;

  function initPage2() {
    if (page2Initialised) return;
    page2Initialised = true;

    var rose = document.getElementById("rose-deco");
    setTimeout(function () {
      rose.classList.add("spring");
    }, 400);

    observeOnce(document.getElementById("smile-card"), 0.3, function (el) {
      el.classList.add("in");
    });
  }

  function observeOnce(el, threshold, cb) {
    if (!el) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            obs.disconnect();
            cb(el);
          }
        });
      },
      { threshold: threshold }
    );
    obs.observe(el);
  }

      
  var isUnlocked = false;

  lockBtn.addEventListener("click", function () {
    openPasskey();
  });

      
  var pkEntered = "";
  var pkBusy = false;

  function buildParticles() {
    pkParticles.innerHTML = "";
    for (var i = 0; i < 24; i++) {
      var p = document.createElement("div");
      p.className = "pk-particle";
      var size = 1.5 + Math.random() * 3;
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.opacity = 0.12 + Math.random() * 0.3;
      p.style.animationDuration = 5 + Math.random() * 7 + "s";
      p.style.animationDelay = Math.random() * -10 + "s";
      pkParticles.appendChild(p);
    }
  }

  function renderPkDots() {
    var dots = pkDotsWrap.querySelectorAll(".pk-dot");
    var lines = pkDotsWrap.querySelectorAll(".pk-line");
    dots.forEach(function (dot, i) {
      dot.classList.toggle("filled", i < pkEntered.length);
    });
    lines.forEach(function (line, i) {
      line.classList.toggle("on", i + 1 <= pkEntered.length);
    });
  }

  function openPasskey() {
    pkEntered = "";
    pkBusy = false;
    pkOverlay.classList.remove("error", "success");
    pkTitle.textContent = "Enter Passkey";
    pkErrorMsg.classList.remove("show");
    buildParticles();
    renderPkDots();
    pkOverlay.classList.add("shown");
  }

  function closePasskey() {
    pkOverlay.classList.remove("shown", "error", "success");
  }

  pkClose.addEventListener("click", closePasskey);

  function pkPress(key) {
    if (pkBusy) return;
    if (key === "del") {
      pkEntered = pkEntered.slice(0, -1);
      renderPkDots();
      return;
    }
    if (pkEntered.length >= 4) return;
    pkEntered += key;
    renderPkDots();
    if (pkEntered.length === 4) {
      pkBusy = true;
      if (pkEntered.trim() === "1511" || pkEntered.trim() === PASSCODE.trim()) {
        pkOverlay.classList.add("success");
        pkTitle.textContent = "Unlocked";
        setTimeout(function () {
          closePasskey();
          startLoading();
        }, 700);
      } else {
        pkOverlay.classList.add("error");
        pkDotsWrap.classList.add("shake", "error");
        pkErrorMsg.classList.add("show");
        setTimeout(function () {
          pkDotsWrap.classList.remove("shake", "error");
          pkOverlay.classList.remove("error");
          pkErrorMsg.classList.remove("show");
          pkEntered = "";
          renderPkDots();
          pkBusy = false;
        }, 700);
      }
    }
  }

  pkKeypad.querySelectorAll(".pk-key[data-key]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      pkPress(btn.getAttribute("data-key"));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!pkOverlay.classList.contains("shown")) return;
    if (e.key >= "0" && e.key <= "9") pkPress(e.key);
    if (e.key === "Backspace") pkPress("del");
    if (e.key === "Escape") closePasskey();
  });

      
  function startLoading() {
    loadingOverlay.classList.remove("fade-out");
    loadingOverlay.classList.add("shown");
    setTimeout(function () {
      loadingOverlay.classList.add("fade-out");
      setTimeout(finishUnlock, 450);
    }, LOADING_MS - 450);
  }

  function finishUnlock() {
    loadingOverlay.classList.remove("shown", "fade-out");
    isUnlocked = true;

    lockBtn.style.display = "none";
    lockHint.style.display = "none";
    lockUnlockedMsg.style.display = "block";

    setTimeout(function () {
      savedScrollY = window.scrollY;
      page2.classList.remove("shown");
      page3.classList.add("shown");
      window.scrollTo(0, 0);
      revealLockedContent();
    }, 700);
  }

  page3Back.addEventListener("click", function () {
    page3.classList.remove("shown");
    page2.classList.add("shown");
    window.scrollTo(0, savedScrollY);

    isUnlocked = false;
    lockBtn.style.display = "";
    lockHint.style.display = "";
    lockUnlockedMsg.style.display = "none";
  });

        
  var lockedContentBuilt = false;

  function revealLockedContent() {
    if (!lockedContentBuilt) {
      buildPhotoGrid();
      buildLetter();
      lockedContentBuilt = true;
    }

    observeOnce(document.getElementById("photo-grid-section"), 0.15, function () {
      var cards = document.querySelectorAll(".photo-card");
      cards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add("in");
        }, i * 130);
      });
    });

    observeOnce(document.getElementById("letter-section"), 0.15, function () {
      var words = document.querySelectorAll(".letter-card .word");
      var i = 0;
      function next() {
        if (i >= words.length) return;
        words[i].classList.add("in");
        i++;
        setTimeout(next, 90);
      }
      next();
    });

    var footerH2 = document.querySelector("#footer-section h2");
    var footerP = document.querySelector("#footer-section p");
    observeOnce(document.getElementById("footer-section"), 0.3, function () {
      footerH2.classList.add("in");
      footerP.classList.add("in");
    });
  }

  function buildPhotoGrid() {
    var grid = document.getElementById("photo-grid");
    var tilts = [-5, 4, -3, 6, -6, 3, -4, 5, -3, 4];
    var sizes = ["lg", "sm", "md", "lg", "sm", "md", "lg", "sm", "md", "lg"];
    PHOTOS.forEach(function (src, n) {
      var card = document.createElement("div");
      card.className = "photo-card size-" + sizes[n % sizes.length];
      card.style.setProperty("--rot", tilts[n % tilts.length] + "deg");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      card.appendChild(img);
      grid.appendChild(card);
    });
  }

  function buildLetter() {
    var wrap = document.getElementById("letter-words");
    var words = LETTER_TEXT.split(/\s+/);
    words.forEach(function (w) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      wrap.appendChild(span);
      wrap.appendChild(document.createTextNode(" "));
    });
  }
})();