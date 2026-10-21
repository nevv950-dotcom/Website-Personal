/**
 * ============================================================
 * NELSEN VERIAN - PERSONAL PORTFOLIO & INTERACTIVE SCRIPT
 * Features: Web Audio Synth, Cursor Spark Trail, Random Meme Pop,
 * Evasive Runaway Button, Easter Egg System (6 Memes),
 * Floating Photo Spawner, and Grand Signature Finale.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. WEB AUDIO API SYNTHESIZER ====================
  // Generates real-time sound effects without requiring external audio files
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Cute bubble pop sound for meme click
    pop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }

    // Whoosh / dodge sound for runaway button
    whoosh() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }

    // Success / Easter egg chime
    success() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.28);
      });
    }

    // Grand fanfare for Grand Signature Finale
    grandFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { freq: 440.00, delay: 0.0 },   // A4
        { freq: 554.37, delay: 0.1 },   // C#5
        { freq: 659.25, delay: 0.2 },   // E5
        { freq: 880.00, delay: 0.3 },   // A5
        { freq: 1108.73, delay: 0.45 }  // C#6
      ];

      chords.forEach(c => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.freq, now + c.delay);

        gain.gain.setValueAtTime(0.22, now + c.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.delay + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + c.delay);
        osc.stop(now + c.delay + 0.6);
      });
    }

    // UI Click tick
    clickTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  const sound = new SoundFX();

  // Audio Toggle Button
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  audioToggle.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    if (sound.enabled) {
      audioIcon.className = 'fa-solid fa-volume-high';
      audioToggle.title = 'Suara SFX: Aktif';
      showToast('🔊 Efek suara diaktifkan!');
      sound.pop();
    } else {
      audioIcon.className = 'fa-solid fa-volume-xmark';
      audioToggle.title = 'Suara SFX: Mute';
      showToast('🔇 Efek suara dibisukan');
    }
  });


  // ==================== 2. TOAST NOTIFICATION HELPER ====================
  function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }


  // ==================== 3. CUSTOM CURSOR & SPARK PARTICLES ====================
  const customCursor = document.getElementById('customCursor');
  const cursorTrail = document.getElementById('cursorTrail');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;
  let isMoving = false;
  let lastSparkTime = 0;

  // Track cursor coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    if (customCursor) {
      customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }

    // Spawn tiny glowing spark particle every 45ms while moving
    const now = Date.now();
    if (now - lastSparkTime > 45) {
      spawnCursorSpark(mouseX, mouseY);
      lastSparkTime = now;
    }

    // If Floating Photo Spawner is active, spawn floating photo occasionally
    if (photoSpawnerActive && now - lastSpawnerSpawnTime > 220) {
      spawnFloatingCursorPhoto(mouseX, mouseY);
      lastSpawnerSpawnTime = now;
    }
  });

  // Smooth trail follower animation
  function renderCursorTrail() {
    trailX += (mouseX - trailX) * 0.22;
    trailY += (mouseY - trailY) * 0.22;

    if (cursorTrail) {
      cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(renderCursorTrail);
  }
  requestAnimationFrame(renderCursorTrail);

  // Micro particle spark
  function spawnCursorSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }

  // Hover states for cursor
  const interactiveTargets = 'a, button, input, textarea, .photo-tile, .signature-text-container, .meta-chip, .clickable-nim, .egg-card';
  document.querySelectorAll(interactiveTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      customCursor.classList.add('hovering');
      cursorTrail.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      customCursor.classList.remove('hovering');
      cursorTrail.classList.remove('hovering');
    });
  });


  // ==================== 4. TYPEWRITER EFFECT ====================
  const typewriterElement = document.getElementById('typewriter');
  const typewriterPhrases = [
    'Mahasiswa FMIPA UNTAN Angkatan 2026 🎓',
    'Penggemar Web Development & UI/UX 💻',
    'Penjelajah Kreativitas Digital & Code 🚀',
    'Kurator Meme & Anti-Boring Specialist 🎨',
    'Pencipta Karya: Yang Penting Ada! ✨'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeStep() {
    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typingSpeed = 400; // Pause before new phrase
    }

    setTimeout(typeStep, typingSpeed);
  }
  typeStep();


  // ==================== 5. EASTER EGG MANAGER (MEMES 1 TO 6) ====================
  const unlockedEggs = new Set();
  const eggFoundCountEl = document.getElementById('eggFoundCount');

  const memeDetails = {
    1: {
      title: 'Meme #1: Si Klik Sembarang 🎯',
      desc: 'Kamu menemukan meme ini karena mengklik di area kosong website yang tidak terduga!',
      img: 'meme_1.jpg'
    },
    2: {
      title: 'Meme #2: Penangkap Tombol Gesit 🏃',
      desc: 'Luar biasa! Kamu berhasil menangkap tombol nakal yang berusaha kabur dari kursor!',
      img: 'meme_2.webp'
    },
    3: {
      title: 'Meme #3: Rahasia Peti Terlarang 📦',
      desc: 'Kamu nekat membobol peti misteri di bagian Tentang Saya. Keingintahuanmu berbuah meme!',
      img: 'meme_3.png'
    },
    4: {
      title: 'Meme #4: Verifikasi Identitas NIM 🕵️',
      desc: 'Klik 3x pada NIM berhasil membongkar arsip tersembunyi mahasiswa FMIPA UNTAN 2026!',
      img: 'meme_4.jpg'
    },
    5: {
      title: 'Meme #5: Tombol Jangan Ditekan 💀',
      desc: 'Sudah dibilang jangan ditekan, tapi kamu tetap menekannya! Selamat menikmati kekacauan!',
      img: 'meme_5.png'
    },
    6: {
      title: 'Meme #6: Perangkap Foto Galeri 📸',
      desc: 'Foto rahasia di galeri ternyata adalah kamuflase dari meme legendaris ke-6!',
      img: 'meme_6.png'
    }
  };

  function unlockEasterEgg(id) {
    if (!unlockedEggs.has(id)) {
      unlockedEggs.add(id);
      eggFoundCountEl.textContent = unlockedEggs.size;

      // Update egg slot card UI
      const slot = document.getElementById(`eggSlot${id}`);
      if (slot) {
        slot.classList.add('unlocked');
        const statusIcon = slot.querySelector('.egg-card-status');
        if (statusIcon) {
          statusIcon.className = 'egg-card-status unlocked';
          statusIcon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
        }
      }

      sound.success();
      showToast(`🎉 Easter Egg Ditemukan! (${unlockedEggs.size}/6) : Meme #${id}`);

      // If all 6 found, launch massive confetti!
      if (unlockedEggs.size === 6) {
        setTimeout(() => {
          showToast('🏆 LUAR BIASA! Seluruh 6 Easter Egg berhasil kamu temukan!');
          fireConfettiBurst();
        }, 1200);
      }
    }
  }

  // Egg Counter Button opens Tracker Modal
  const eggCounterBtn = document.getElementById('eggCounterBtn');
  const eggTrackerModal = document.getElementById('eggTrackerModal');
  const closeEggTrackerModal = document.getElementById('closeEggTrackerModal');
  const secretModalOpenBtn = document.getElementById('secretModalOpenBtn');

  function openEggModal() {
    eggTrackerModal.classList.add('open');
    sound.clickTick();
  }
  eggCounterBtn.addEventListener('click', openEggModal);
  secretModalOpenBtn.addEventListener('click', openEggModal);
  closeEggTrackerModal.addEventListener('click', () => {
    eggTrackerModal.classList.remove('open');
  });


  // ==================== 6. RANDOM CLICK MEME SURPRISE (MEME_1) ====================
  // Requirement: "saat klik tidak jelas di bagian manapun yang bukan merupakan button
  // akan muncul sebuah efek kejutan berupa foto meme (meme_1)"
  let emptyClickCount = 0;

  document.addEventListener('click', (e) => {
    // Check if target is an interactive or clickable element
    const isInteractive = e.target.closest(
      'button, a, input, textarea, select, .photo-tile, .signature-text-container, ' +
      '.clickable-nim, .modal-card, .nav-menu, .hamburger-btn, .icon-btn, .egg-counter-btn, ' +
      '.profile-img-box, .social-card, .meta-chip'
    );

    // If clicked on an empty, non-interactive area
    if (!isInteractive) {
      emptyClickCount++;
      sound.pop();

      // Create floating meme popup element
      const popup = document.createElement('img');
      popup.src = 'meme_1.jpg';
      popup.alt = 'Meme Kejutan 1';
      popup.className = 'meme-click-popup';
      popup.style.left = `${e.clientX}px`;
      popup.style.top = `${e.clientY}px`;

      document.body.appendChild(popup);

      // Auto remove after animation completes
      setTimeout(() => {
        popup.remove();
      }, 1600);

      // Unlock Easter Egg #1
      unlockEasterEgg(1);
    }
  });


  // ==================== 7. EVASIVE RUNAWAY BUTTON ====================
  // Requirement: "ada beberapa tombol tertentu bisa bergeser seolah menjauh dari kursor
  // tetapi menjauh hanya dalam ruang terbatas saja"
  const evasiveBtn = document.getElementById('evasiveBtn');
  const evasivePlayground = document.getElementById('evasivePlayground');
  const evasiveAttemptsEl = document.getElementById('evasiveAttempts');
  let dodgeCount = 0;

  function dodgeButton(cursorX, cursorY) {
    if (!evasivePlayground || !evasiveBtn) return;

    const playgroundRect = evasivePlayground.getBoundingClientRect();
    const btnRect = evasiveBtn.getBoundingClientRect();

    const maxLeft = playgroundRect.width - btnRect.width - 15;
    const maxTop = playgroundRect.height - btnRect.height - 10;

    // Generate random coordinates within playground boundaries
    let newLeft = Math.floor(Math.random() * Math.max(10, maxLeft));
    let newTop = Math.floor(Math.random() * Math.max(10, maxTop));

    evasiveBtn.style.left = `${newLeft}px`;
    evasiveBtn.style.top = `${newTop}px`;

    dodgeCount++;
    evasiveAttemptsEl.textContent = dodgeCount;
    sound.whoosh();
  }

  // Detect proximity to evasive button
  evasivePlayground.addEventListener('mousemove', (e) => {
    const btnRect = evasiveBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // If cursor comes within 70px radius, dodge away!
    if (distance < 70) {
      dodgeButton(e.clientX, e.clientY);
    }
  });

  // Touch support for mobile: tap triggers dodge
  evasiveBtn.addEventListener('touchstart', (e) => {
    if (dodgeCount < 4) {
      e.preventDefault();
      dodgeButton();
    }
  });

  // If user actually catches and clicks the evasive button!
  evasiveBtn.addEventListener('click', () => {
    sound.success();
    fireConfettiBurst();
    unlockEasterEgg(2);

    openGeneralEggModal(
      'Meme #2: Kamu Menangkap Tombolnya! 🏃💨',
      'Selamat! Dengan refleks secepat kilat, kamu berhasil menangkap tombol nakal ini!',
      'meme_2.webp'
    );
  });


  // ==================== 8. GENERAL EASTER EGG MODAL HELPER ====================
  const generalEggModal = document.getElementById('generalEggModal');
  const generalEggTitle = document.getElementById('generalEggTitle');
  const generalEggDesc = document.getElementById('generalEggDesc');
  const generalEggImg = document.getElementById('generalEggImg');
  const generalEggBtn = document.getElementById('generalEggBtn');
  const closeGeneralEggModal = document.getElementById('closeGeneralEggModal');

  function openGeneralEggModal(title, desc, imgSrc) {
    generalEggTitle.textContent = title;
    generalEggDesc.textContent = desc;
    generalEggImg.src = imgSrc;
    generalEggModal.classList.add('open');
  }

  function closeGeneralModal() {
    generalEggModal.classList.remove('open');
  }

  if (generalEggBtn) generalEggBtn.addEventListener('click', closeGeneralModal);
  if (closeGeneralEggModal) closeGeneralEggModal.addEventListener('click', closeGeneralModal);


  // ==================== 9. EASTER EGG #3: MYSTERY CHEST ====================
  const mysteryChestBtn = document.getElementById('mysteryChestBtn');
  const chestIcon = document.getElementById('chestIcon');

  mysteryChestBtn.addEventListener('click', () => {
    chestIcon.className = 'fa-solid fa-box-open';
    chestIcon.style.color = '#10b981';
    unlockEasterEgg(3);

    openGeneralEggModal(
      'Meme #3: Peti Rahasia Terbuka! 📦',
      'Peti misteri berhasil dibongkar! Terkandung sebuah meme tentang kehidupan seorang programmer.',
      'meme_3.png'
    );
  });


  // ==================== 10. EASTER EGG #4: TRIPLE-CLICK NIM ====================
  const nimClickable = document.getElementById('nimClickable');
  const nimChip = document.getElementById('nimChip');
  let nimClicks = 0;
  let nimTimer = null;

  function handleNimClick() {
    nimClicks++;
    sound.clickTick();

    clearTimeout(nimTimer);
    nimTimer = setTimeout(() => {
      nimClicks = 0;
    }, 1200);

    if (nimClicks === 3) {
      nimClicks = 0;
      unlockEasterEgg(4);

      openGeneralEggModal(
        'Meme #4: Identitas Mahasiswa Terverifikasi! 🎓',
        'NIM: H1101261030 terkonfirmasi asli! FMIPA Universitas Tanjungpura angkatan 2026.',
        'meme_4.jpg'
      );
    } else {
      showToast(`Klik NIM lagi (${nimClicks}/3)...`);
    }
  }

  if (nimClickable) nimClickable.addEventListener('click', handleNimClick);
  if (nimChip) nimChip.addEventListener('click', handleNimClick);


  // ==================== 11. EASTER EGG #5: CHAOS BUTTON IN FOOTER ====================
  const chaosBtn = document.getElementById('chaosBtn');
  chaosBtn.addEventListener('click', () => {
    document.body.classList.toggle('chaos-mode');
    unlockEasterEgg(5);

    openGeneralEggModal(
      'Meme #5: Mode Chaos Diaktifkan! 🌈',
      'Warna website sedang bermutasi secara liar! Klik tombol lagi untuk menenangkan situasi.',
      'meme_5.png'
    );
  });


  // ==================== 12. GALLERY INTERACTIONS ====================
  // Requirement:
  // "fotonya bisa respon atau feedback kalau diklik,
  // satunya bisa kelaurkan foto lagi dari kursor dan satunya muncul meme lagi (meme_6)"

  // 12a. Cursor Photo Spawner Mode (Triggered by photo_4)
  let photoSpawnerActive = false;
  let lastSpawnerSpawnTime = 0;
  const photoEmitterTile = document.getElementById('photoEmitterTile');

  photoEmitterTile.addEventListener('click', () => {
    photoSpawnerActive = !photoSpawnerActive;
    sound.success();

    if (photoSpawnerActive) {
      showToast('✨ Mode Emitter Kursor AKTIF! Gerakkan kursor atau klik layar untuk melontarkan foto!', 4500);
      photoEmitterTile.style.borderColor = 'var(--accent-pink)';

      // Immediate burst of 5 floating photos
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 120;
          const offsetY = (Math.random() - 0.5) * 120;
          spawnFloatingCursorPhoto(mouseX + offsetX, mouseY + offsetY);
        }, i * 90);
      }
    } else {
      showToast('Mode Emitter Kursor dimatikan.');
      photoEmitterTile.style.borderColor = '';
    }
  });

  function spawnFloatingCursorPhoto(x, y) {
    const photo = document.createElement('img');
    photo.src = 'photo_4.jpeg';
    photo.alt = 'Floating Avatar';
    photo.className = 'cursor-floating-photo';
    photo.style.left = `${x}px`;
    photo.style.top = `${y}px`;
    document.body.appendChild(photo);

    setTimeout(() => photo.remove(), 2000);
  }

  // Also spawn photo on click anywhere while spawner is active
  window.addEventListener('click', (e) => {
    if (photoSpawnerActive) {
      spawnFloatingCursorPhoto(e.clientX, e.clientY);
    }
  });

  // 12b. Secret Meme Trigger (Triggered by photo_7 -> meme_6)
  const photoMemeTriggerTile = document.getElementById('photoMemeTriggerTile');
  const meme6Modal = document.getElementById('meme6Modal');
  const closeMeme6Modal = document.getElementById('closeMeme6Modal');
  const claimMeme6Btn = document.getElementById('claimMeme6Btn');

  photoMemeTriggerTile.addEventListener('click', () => {
    unlockEasterEgg(6);
    meme6Modal.classList.add('open');
    sound.success();
  });

  function closeMeme6() {
    meme6Modal.classList.remove('open');
  }
  closeMeme6Modal.addEventListener('click', closeMeme6);
  claimMeme6Btn.addEventListener('click', closeMeme6);

  // 12c. Normal Lightbox for other gallery photos (2, 3, 5, 6, 8, 9)
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxModal = document.getElementById('closeLightboxModal');

  document.querySelectorAll('.photo-tile').forEach((tile) => {
    const photoId = tile.getAttribute('data-photo');
    // Skip 4 and 7 since they have unique interaction actions
    if (photoId !== '4' && photoId !== '7') {
      tile.addEventListener('click', () => {
        sound.clickTick();
        const img = tile.querySelector('img');
        const title = tile.querySelector('.tile-title')?.textContent || `Foto #${photoId}`;
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `Nelsen Verian — ${title}`;
        lightboxModal.classList.add('open');
      });
    }
  });

  closeLightboxModal.addEventListener('click', () => {
    lightboxModal.classList.remove('open');
  });


  // ==================== 13. HERO PROFILE PHOTO CLICK INTERACTION ====================
  const profileCard = document.getElementById('profileCard');
  const mainHeroPhoto = document.getElementById('mainHeroPhoto');
  const profileReactionBubble = document.getElementById('profileReactionBubble');
  const profileReactionText = document.getElementById('profileReactionText');

  const funnyQuotes = [
    'Aduh! Jangan diklik mulu, nanti gantengnya luntur! 😎',
    'Halo! Lagi kepoin profil Nelsen ya? Jangan lupa cek galeri! 🚀',
    'Tips rahasia: Coba cari semua 6 Easter Egg di website ini! 🕵️',
    'Mahasiswa FMIPA UNTAN 2026 siap berkarya! Yang penting ada! ✨',
    'Koding jalan, ngopi jalan, yang penting tugas kelar tepat waktu! ☕'
  ];
  let quoteIndex = 0;

  mainHeroPhoto.addEventListener('click', () => {
    sound.pop();
    profileReactionText.textContent = funnyQuotes[quoteIndex];
    quoteIndex = (quoteIndex + 1) % funnyQuotes.length;

    profileReactionBubble.classList.add('show');
    clearTimeout(profileCard._bubbleTimer);
    profileCard._bubbleTimer = setTimeout(() => {
      profileReactionBubble.classList.remove('show');
    }, 3200);
  });

  // 3D Tilt on Profile Card Hover
  const profileCardWrapper = document.getElementById('profileCardWrapper');
  profileCardWrapper.addEventListener('mousemove', (e) => {
    const rect = profileCardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 16;

    profileCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  profileCardWrapper.addEventListener('mouseleave', () => {
    profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });


  // ==================== 14. GRAND FINALE SIGNATURE INTERACTION ====================
  // Requirement:
  // "dan akhiran berisi kata "Yang Penting Ada, By *Nelsen Verian*"
  // tulisan yang mencolok dan bisa diklik akan keluar foto photo_1"
  const signatureClickable = document.getElementById('signatureClickable');
  const signatureModal = document.getElementById('signatureModal');
  const closeSignatureModal = document.getElementById('closeSignatureModal');
  const signatureCheerBtn = document.getElementById('signatureCheerBtn');

  signatureClickable.addEventListener('click', () => {
    sound.grandFanfare();
    fireConfettiBurst();
    signatureModal.classList.add('open');
  });

  closeSignatureModal.addEventListener('click', () => {
    signatureModal.classList.remove('open');
  });

  signatureCheerBtn.addEventListener('click', () => {
    sound.success();
    fireConfettiBurst();
    showToast('🎉 Terima kasih atas apresiasi dan kunjungannya!');
  });


  // ==================== 15. CONFETTI CELEBRATION HELPER ====================
  function fireConfettiBurst() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }
  }


  // ==================== 16. INSTANT GMAIL DISPATCH ====================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) return;

      // Audio & Confetti Feedback instan
      sound.success();
      fireConfettiBurst();

      // Format Subjek & Pesan rapi
      const emailSubject = encodeURIComponent(`[Website Portofolio] Pesan dari ${name}`);
      const emailBody = encodeURIComponent(
        `Halo Nelsen Verian,\n\n` +
        `${message}\n\n` +
        `===================================\n` +
        `Nama Pengirim : ${name}\n` +
        `Email Pengirim: ${email}\n` +
        `Dikirim dari  : Form Website Portofolio Nelsen Verian\n` +
        `===================================`
      );

      // URL langsung ke Gmail Web compose (Instan 0 detik)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nelsenvv950@gmail.com&su=${emailSubject}&body=${emailBody}`;

      // Buka tab Gmail baru
      const newTab = window.open(gmailUrl, '_blank');

      // Jika pop-up browser memblokir tab baru, gunakan mailto sebagai cadangan
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = `mailto:nelsenvv950@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      }

      showToast(`🚀 Membuka Gmail untuk mengirim pesan ke nelsenvv950@gmail.com!`, 4000);
      contactForm.reset();
    });
  }


  // ==================== 17. MOBILE NAVIGATION DRAWER ====================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });


  // ==================== 18. NAVBAR SCROLL EFFECT & ACTIVE LINK ====================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Observer
    let currentSection = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });


  // ==================== 19. PROJECT DETAIL MODAL / PREVIEWS ====================
  const previewBtns = document.querySelectorAll('.preview-project-btn');
  previewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pNum = btn.getAttribute('data-project');
      sound.clickTick();
      if (pNum === '1') {
        showToast('🚀 Proyek 1: Sedang kamu jelajahi saat ini secara interaktif!');
      } else if (pNum === '2') {
        showToast('📱 Proyek 2: Desain UI terpadu UNTAN Campus Life Companion.');
      } else if (pNum === '3') {
        showToast('🎵 Proyek 3: Generator audio Web Audio API osilator sintetis.');
      }
    });
  });

  const demoSynthBtn = document.getElementById('demoSynthBtn');
  if (demoSynthBtn) {
    demoSynthBtn.addEventListener('click', () => {
      sound.grandFanfare();
      showToast('🎶 Memainkan akord sintetis Web Audio API!');
    });
  }


  // ==================== 20. CLOSE MODALS ON OVERLAY CLICK & ESC ====================
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach((m) => m.classList.remove('open'));
      closeDrawer();
    }
  });

});
