const els = {
  stage: document.querySelector(".stage"),
  camera: document.querySelector("#camera"),
  bgMusic: document.querySelector("#bgMusic"),
  menuMusic: document.querySelector("#menuMusic"),
  startSound: document.querySelector("#startSound"),
  finalCountdownSound: document.querySelector("#finalCountdownSound"),
  bonusSound: document.querySelector("#bonusSound"),
  bigBonusSound: document.querySelector("#bigBonusSound"),
  wrongAnswerSound: document.querySelector("#wrongAnswerSound"),
  loseSound: document.querySelector("#loseSound"),
  endSound: document.querySelector("#endSound"),
  canvas: document.querySelector("#gameCanvas"),
  arFrame: document.querySelector("#arFrame"),
  loading: document.querySelector("#loadingScreen"),
  loadingStatus: document.querySelector("#loadingStatus"),
  loadingFill: document.querySelector("#loadingFill"),
  loadingPercent: document.querySelector("#loadingPercent"),
  loadingBar: document.querySelector(".loading-bar-shell"),
  menuDanceVideo: document.querySelector("#menuDanceVideo"),
  hud: document.querySelector("#hud"),
  menu: document.querySelector("#menuScreen"),
  info: document.querySelector("#infoScreen"),
  time: document.querySelector("#timeScreen"),
  result: document.querySelector("#resultScreen"),
  entryGate: document.querySelector("#entryGate"),
  entryFullscreenBtn: document.querySelector("#entryFullscreenBtn"),
  entryWindowBtn: document.querySelector("#entryWindowBtn"),
  openChromeBtn: document.querySelector("#openChromeBtn"),
  entryMessage: document.querySelector("#entryMessage"),
  orientationGate: document.querySelector("#orientationGate"),
  orientationBackBtn: document.querySelector("#orientationBackBtn"),
  startBtn: document.querySelector("#startBtn"),
  howBtn: document.querySelector("#howBtn"),
  cameraBtn: document.querySelector("#cameraBtn"),
  soundBtn: document.querySelector("#soundBtn"),
  fullscreenBtn: document.querySelector("#fullscreenBtn"),
  settingBtn: document.querySelector("#settingBtn"),
  closeTimeBtn: document.querySelector("#closeTimeBtn"),
  timeOptions: document.querySelectorAll("[data-duration]"),
  wordVoiceToggle: document.querySelector("#wordVoiceToggle"),
  pauseBtn: document.querySelector("#pauseBtn"),
  cameraTestControls: document.querySelector("#cameraTestControls"),
  cameraBackBtn: document.querySelector("#cameraBackBtn"),
  cameraStartBtn: document.querySelector("#cameraStartBtn"),
  pauseOverlay: document.querySelector("#pauseOverlay"),
  resumeBtn: document.querySelector("#resumeBtn"),
  pauseMenuBtn: document.querySelector("#pauseMenuBtn"),
  closeInfoBtn: document.querySelector("#closeInfoBtn"),
  replayBtn: document.querySelector("#replayBtn"),
  homeBtn: document.querySelector("#homeBtn"),
  score: document.querySelector("#score"),
  comboMeter: document.querySelector("#comboMeter"),
  timer: document.querySelector("#timer"),
  level: document.querySelector("#level"),
  coins: document.querySelector("#coins"),
  hearts: document.querySelector("#hearts"),
  comboPop: document.querySelector("#comboPop"),
  feedback: document.querySelector("#feedback"),
  pinchBeam: document.querySelector("#pinchBeam"),
  cursor: document.querySelector("#fingerCursor"),
  thumbCursor: document.querySelector("#thumbCursor"),
  redFlash: document.querySelector("#redFlash"),
  finalScore: document.querySelector("#finalScore"),
  accuracy: document.querySelector("#accuracy"),
  correctCount: document.querySelector("#correctCount"),
  wrongCount: document.querySelector("#wrongCount"),
  maxCombo: document.querySelector("#maxCombo"),
  finalCoins: document.querySelector("#finalCoins"),
  learnedWords: document.querySelector("#learnedWords"),
  resultTitle: document.querySelector("#resultTitle")
};

const ctx = els.canvas.getContext("2d");
const isAndroid = /Android/i.test(navigator.userAgent);
const isIPad = /iPad/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isIPhone = /iPhone|iPod/i.test(navigator.userAgent);
const isIOS = isIPad || isIPhone;
const isChromeBrowser = isIOS
  ? /CriOS/i.test(navigator.userAgent)
  : isAndroid && /Chrome\//i.test(navigator.userAgent) && !/; wv\)|\bwv\b|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent);
const startsMuted = new URLSearchParams(window.location.search).get("sound") === "off";
const storedWordVoice = localStorage.getItem("mae-kokaa-word-voice");
const GAME_MUSIC_LEVEL = isIOS ? 0.085 : isAndroid ? 0.13 : 0.5;
const MENU_MUSIC_LEVEL = 1;
const EFFECT_LEVEL = 0.8;
document.body.classList.toggle("is-ios-device", isIOS);
if (els.openChromeBtn) els.openChromeBtn.hidden = !(isAndroid || isIOS) || isChromeBrowser;
const menuImage = new Image();
const sceneImages = [
  "assets/พื้นหลัง-1.webp",
  "assets/พื้นหลัง-2.webp",
  "assets/พื้นหลัง-3.webp",
  "assets/พื้นหลัง-4.webp"
].map((source) => {
  const image = new Image();
  image.src = source;
  return image;
});
menuImage.src = "assets/mushroom-menu.webp";
const characterImages = Array.from({ length: 20 }, (_, index) => {
  const image = new Image();
  image.src = `assets/characters/mushroom_character_${String(index + 1).padStart(2, "0")}.png`;
  return image;
});
const wordCloudImage = new Image();
wordCloudImage.src = "assets/game-word-cloud.png";
const wordCloudImages = [wordCloudImage];
const hatAssets = [
  { source: "assets/hats/hat-mushroom-house.png", crop: [8, 0, 344, 397], widthScale: 1.72, glow: "#ff806d" },
  { source: "assets/hats/hat-purple-wizard.png", crop: [10, 0, 360, 453], widthScale: 1.48, glow: "#d69aff" },
  { source: "assets/hats/hat-ice-crown.png", crop: [12, 0, 348, 453], widthScale: 1.7, glow: "#82eaff" },
  { source: "assets/hats/hat-golden-crown.png", crop: [8, 0, 360, 453], widthScale: 1.72, glow: "#ffd75a" }
].map((asset) => {
  const image = new Image();
  image.src = asset.source;
  return { ...asset, image };
});

const correctWordList = [
  "กา", "ตา", "ยา", "มา", "นา", "ขา", "ป้า", "ลา", "ชา", "ปลา", "ปู", "งู", "หู", "รู", "ดู", "หมู", "หนู",
  "มือ", "ถือ", "ซื้อ", "เสื้อ", "เสือ", "เรือ", "เกลือ", "เมีย", "เสีย", "ไก่", "ไข่", "ไป", "ใจ", "ใบ", "ไฟ", "ใส",
  "ใหม่", "ให้", "ไม่", "โต", "โต๊ะ", "เก้าอี้", "มะลิ", "ทะเล", "ภูเขา", "นาฬิกา", "กีฬา", "มะเขือ", "กะทิ", "ตะปู", "ประตู", "มะระ"
];
const wrongWordList = [
  "กบ", "นก", "มด", "รถ", "ดิน", "บ้าน", "จาน", "ขวด", "ลูก", "เมฆ", "ดาว", "ฝน", "ผัก", "ปาก", "เลข", "หอม", "ข้าว",
  "ดอก", "ต้น", "ลิง", "แมว", "คน", "ช้อน", "ครก", "กาง", "กิ่ง", "กุ้ง", "ช้าง", "หิน", "บิน", "กิน", "จับ", "ดาบ", "ภาพ",
  "จิต", "มิตร", "กอด", "พัด", "วัด", "รัก", "เล็ก", "เด็ก", "นอน", "บอล", "ลม", "ส้ม", "นม", "เกม", "งาม", "สวย"
];
const voiceWordOrder = [
  "กา", "กบ", "ตา", "นก", "ยา", "มด", "มา", "รถ", "นา", "ดิน", "ขา", "บ้าน", "ป้า", "จาน", "ลา", "ขวด", "ชา", "ลูก", "ปลา", "เมฆ", "ปู", "ดาว", "งู", "ฝน", "หู", "ผัก", "รู", "ปาก", "ดู", "เลข", "หมู", "หอม", "หนู",
  "ข้าว", "มือ", "ดอก", "ถือ", "ต้น", "ซื้อ", "ลิง", "เสื้อ", "แมว", "เสือ", "คน", "เรือ", "ช้อน", "เกลือ", "ครก", "เมีย", "กาง", "เสีย", "กิ่ง", "ไก่", "กุ้ง", "ไข่", "ช้าง", "ไป", "หิน", "ใจ", "บิน",
  "ใบ", "กิน", "ไฟ", "จับ", "ใส", "ดาบ", "ใหม่", "ภาพ", "ให้", "จิต", "ไม่", "มิตร", "โต", "กอด", "โต๊ะ", "พัด", "เก้าอี้", "วัด", "มะลิ", "รัก", "ทะเล", "เล็ก", "ภูเขา", "เด็ก",
  "นาฬิกา", "นอน", "กีฬา", "บอล", "มะเขือ", "ลม", "กะทิ", "ส้ม", "ตะปู", "นม", "ประตู", "เกม", "มะระ", "งาม", "สวย"
];
const correctWords = correctWordList.map((word) => ({ word, correct: true }));
const wrongWords = wrongWordList.map((word) => ({ word, correct: false }));
const wordAudio = new Map(voiceWordOrder.map((word, index) => {
  const audio = new Audio(`assets/word-voice/voice-${String(index + 1).padStart(3, "0")}.mp3`);
  audio.preload = "auto";
  return [word, audio];
}));
const wrongFeedbackAudio = Array.from({ length: 4 }, (_, index) => {
  const audio = new Audio(`assets/wrong-feedback/wrong-feedback-${String(index + 1).padStart(2, "0")}.mp3`);
  audio.preload = "auto";
  return audio;
});
const wordSpriteCache = new Map();
let entitySequence = 0;
let resultCountAnimationId = 0;
document.fonts?.ready.then(() => wordSpriteCache.clear());

const state = {
  mode: "loading",
  running: false,
  paused: false,
  resuming: false,
  roundDuration: 60,
  score: 0,
  level: 1,
  coins: 0,
  correctInLevel: 0,
  caughtWords: new Set(),
  hearts: 3,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  wrong: 0,
  timeLeft: 60,
  lastTimerWarning: null,
  lastTick: 0,
  lastSpawn: 0,
  sceneTransition: null,
  pendingSceneSpawn: false,
  pendingGoldenCreature: false,
  finalLevelAnnounced: false,
  lossFeedbackPending: false,
  pendingLandscapeAction: null,
  creatures: [],
  particles: [],
  pointer: { x: 0, y: 0, active: false, source: "mouse" },
  thumb: { x: 0, y: 0, active: false },
  catchRequested: false,
  pinchDown: false,
  pinchDistance: Infinity,
  sound: !startsMuted,
  wordVoice: storedWordVoice !== "off",
  cameraReady: false,
  cameraRequestId: 0,
  handReady: false,
  handLandmarker: null,
  lastVideoTime: -1,
  lastHandDetectionAt: 0,
  handDetectionInterval: isIOS ? 88 : isAndroid ? 76 : 50,
  handTrackingDelegate: null,
  handTrackingLoading: false,
  handTrackingRecoveries: 0,
  bonusFaceDetector: null,
  bonusFaceReady: false,
  bonusFaceLoading: false,
  bonusFacePromise: null,
  bonusFaceBox: null,
  bonusFaceMisses: 0,
  bonusFaceSuppressed: false,
  bonusFaceSlowSamples: 0,
  lastBonusFaceVideoTime: -1,
  lastBonusFaceDetectionAt: 0,
  bonusFaceDetectionInterval: isIOS ? 160 : isAndroid ? 135 : 110,
  bonusHatIndex: -1,
  lastRenderAt: 0,
  renderInterval: 1000 / 30,
  stageRect: null,
  inactiveCanvasCleared: false,
  handTrackingPromise: null,
  pseudoFullscreen: false,
  audio: null,
  audioBuffers: new Map(),
  audioBufferLoads: new Map(),
  mediaAudioNodes: new Map(),
  effectAudioReady: null,
  spokenWordSource: null,
  spokenWordElement: null,
  spokenWordFinish: null,
  spokenWordTimer: null,
  spokenWordToken: 0
};

syncViewportSize();
resizeCanvas();
window.addEventListener("resize", handleViewportChange);
window.addEventListener("orientationchange", handleViewportChange);
window.visualViewport?.addEventListener("resize", handleViewportChange);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspendForBackground();
});
window.addEventListener("pagehide", suspendForBackground);
window.addEventListener("pointermove", updatePointer);
window.addEventListener("pointerdown", requestPointerCatch);
window.addEventListener("touchstart", updateTouch, { passive: true });
window.addEventListener("touchmove", updateTouch, { passive: true });
window.addEventListener("pointerdown", unlockMenuMusic, true);
window.addEventListener("touchstart", unlockMenuMusic, { capture: true, passive: true });
window.addEventListener("click", unlockMenuMusic, true);
window.addEventListener("keydown", unlockMenuMusic, true);
window.addEventListener("pointerdown", unlockGameAudio, true);
window.addEventListener("touchstart", unlockGameAudio, { capture: true, passive: true });
window.addEventListener("keydown", unlockGameAudio, true);
window.addEventListener("keydown", handleResultKeyboard);

els.startBtn.addEventListener("click", startGame);
els.replayBtn.addEventListener("click", startGame);
els.homeBtn.addEventListener("click", showMenu);
els.howBtn.addEventListener("click", () => showScreen(els.info));
els.closeInfoBtn.addEventListener("click", showMenu);
els.cameraBtn.addEventListener("click", testCamera);
els.soundBtn?.addEventListener("click", toggleSound);
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
els.entryFullscreenBtn.addEventListener("click", enterPreferredDisplay);
els.entryWindowBtn.addEventListener("click", enterWindowedDisplay);
els.openChromeBtn?.addEventListener("click", openInChrome);
els.orientationBackBtn?.addEventListener("click", cancelOrientationGate);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
els.settingBtn.addEventListener("click", openTimeSettings);
els.closeTimeBtn.addEventListener("click", showMenu);
els.wordVoiceToggle?.addEventListener("change", () => {
  state.wordVoice = els.wordVoiceToggle.checked;
  localStorage.setItem("mae-kokaa-word-voice", state.wordVoice ? "on" : "off");
  playButton();
});
els.timeOptions.forEach((button) => button.addEventListener("click", () => {
  state.roundDuration = Number(button.dataset.duration);
  updateTimeOptions();
  showMenu();
}));
els.pauseBtn.addEventListener("pointerdown", togglePauseFromInput);
els.pauseBtn.addEventListener("click", (event) => event.preventDefault());
els.cameraBackBtn.addEventListener("click", showMenu);
els.cameraStartBtn.addEventListener("click", startGame);
els.resumeBtn.addEventListener("click", resumeGame);
els.pauseMenuBtn.addEventListener("click", showMenu);

if (new URLSearchParams(window.location.search).get("qa") === "audio") {
  const audioQaButton = document.createElement("button");
  audioQaButton.type = "button";
  audioQaButton.textContent = "ทดสอบเอฟเฟกต์ผิด";
  audioQaButton.style.cssText = "position:fixed;z-index:99999;left:50%;bottom:24px;transform:translateX(-50%);padding:14px 22px;font:700 20px sans-serif";
  audioQaButton.addEventListener("click", () => {
    playWrong(() => speakWord("ขวด", playWrongFeedback));
  });
  document.body.append(audioQaButton);
}

requestAnimationFrame(loop);
updateSoundButton();
updateFullscreenButton();
void bootGame();

function syncViewportSize() {
  const viewport = window.visualViewport;
  const width = Math.max(1, Math.round(viewport?.width || window.innerWidth));
  const height = Math.max(1, Math.round(viewport?.height || window.innerHeight));
  const stageWidth = Math.min(width, height * (16 / 9));
  const stageHeight = Math.min(height, width * (9 / 16));
  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--stage-width", `${stageWidth}px`);
  document.documentElement.style.setProperty("--stage-height", `${stageHeight}px`);
  document.body.classList.toggle("is-landscape", width >= height);
}

function handleViewportChange() {
  syncViewportSize();
  window.requestAnimationFrame(resizeCanvas);
  if (state.pendingLandscapeAction && !isPortraitMobile()) {
    const action = state.pendingLandscapeAction;
    state.pendingLandscapeAction = null;
    els.orientationGate.hidden = true;
    window.setTimeout(action, 120);
  }
}

function isPortraitMobile() {
  return (isAndroid || isIOS) && window.innerHeight > window.innerWidth;
}

function showOrientationGate(action) {
  state.pendingLandscapeAction = action;
  els.orientationGate.hidden = false;
}

function cancelOrientationGate() {
  state.pendingLandscapeAction = null;
  els.orientationGate.hidden = true;
  setPseudoFullscreen(false);
  showMenu();
}

function closeEntryGate() {
  els.entryGate.hidden = true;
  handleViewportChange();
  startMenuMusic();
}

function showEntryDisplayHelp() {
  els.entryMessage.hidden = false;
  els.entryMessage.textContent = isIPhone
    ? "iPhone: กดแชร์ เปิดใน Safari แล้วเลือก เพิ่มไปยังหน้าจอโฮม หรือเลือกเล่นในหน้านี้"
    : isIPad
      ? "iPad: เปิดใน Safari แล้วเลือก เพิ่มไปยังหน้าจอโฮม หรือเลือกเล่นในหน้านี้แบบ 16:9"
    : "เบราว์เซอร์นี้ไม่อนุญาตเต็มจอ เลือกเล่นในหน้านี้ได้ทันที";
}

async function enterPreferredDisplay() {
  unlockGameAudio();
  playButton();
  setPseudoFullscreen(true);
  closeEntryGate();
  if (isPortraitMobile()) {
    showOrientationGate(enterPreferredDisplay);
    return;
  }
  const isStandalone = Boolean(navigator.standalone || window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches);
  if (isStandalone) {
    return;
  }
  const requestFullscreen = els.stage.requestFullscreen || els.stage.webkitRequestFullscreen;
  if (!requestFullscreen || isIPhone) {
    window.scrollTo(0, 1);
    return;
  }
  try {
    await requestNativeFullscreen(requestFullscreen);
    try {
      await screen.orientation?.lock?.("landscape");
    } catch {}
  } catch {
    // CSS fullscreen remains active when the browser blocks the native API.
  }
  updateFullscreenButton();
}

async function requestNativeFullscreen(requestFullscreen) {
  try {
    await requestFullscreen.call(els.stage, { navigationUI: "hide" });
  } catch (error) {
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    await requestFullscreen.call(els.stage);
  }
}

function enterWindowedDisplay() {
  unlockGameAudio();
  playButton();
  setPseudoFullscreen(false);
  closeEntryGate();
}

function setPseudoFullscreen(enabled) {
  state.pseudoFullscreen = enabled;
  document.body.classList.toggle("is-game-expanded", enabled);
  els.stage.classList.toggle("is-mobile-expanded", enabled);
  handleViewportChange();
}

function resizeCanvas() {
  const rect = els.stage.getBoundingClientRect();
  const previousRect = state.stageRect;
  if (previousRect?.width && previousRect?.height && state.running) {
    const scaleX = rect.width / previousRect.width;
    const scaleY = rect.height / previousRect.height;
    const sizeScale = Math.min(scaleX, scaleY);
    if (Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01) {
      state.creatures.forEach((creature) => {
        creature.x *= scaleX;
        creature.y *= scaleY;
        creature.size *= sizeScale;
        creature.vx *= sizeScale;
        creature.vy *= sizeScale;
        creature.wobble *= sizeScale;
      });
      state.particles.forEach((particle) => {
        particle.x *= scaleX;
        particle.y *= scaleY;
        particle.r *= sizeScale;
      });
    }
  }
  state.stageRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  const uiScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  els.stage.style.setProperty("--ui-scale", uiScale.toFixed(3));
  const nativeDpr = window.devicePixelRatio || 1;
  const pixelBudget = 1920 * 1080;
  const budgetDpr = Math.sqrt(pixelBudget / Math.max(1, rect.width * rect.height));
  const dprLimit = isAndroid || isIOS ? 1 : 1.25;
  const dpr = Math.max(1, Math.min(nativeDpr, dprLimit, budgetDpr));
  els.canvas.width = Math.round(rect.width * dpr);
  els.canvas.height = Math.round(rect.height * dpr);
  els.canvas.style.width = `${rect.width}px`;
  els.canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth) return Promise.resolve();
  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, 9000);
    const finish = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

function preloadImage(source) {
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  return waitForImage(image);
}

function waitForMediaMetadata(media) {
  if (media.readyState >= 1) return Promise.resolve();
  media.load();
  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, 9000);
    const finish = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    media.addEventListener("loadedmetadata", finish, { once: true });
    media.addEventListener("error", finish, { once: true });
  });
}

function setLoadingProgress(value, status) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));
  if (status) els.loadingStatus.textContent = status;
  els.loadingFill.style.width = `${percent}%`;
  els.loadingPercent.textContent = `${percent}%`;
  els.loadingPercent.style.left = `${18.5 + (73 * percent) / 100}%`;
  els.loadingBar.setAttribute("aria-valuenow", String(percent));
  els.loading.classList.toggle("is-complete", percent === 100);
}

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function bootGame() {
  state.mode = "loading";
  els.entryGate.hidden = true;
  showScreen(els.loading);
  setLoadingProgress(2, "กำลังเตรียมอาณาจักรเห็ด...");

  const imageTasks = [
    waitForImage(menuImage),
    waitForImage(wordCloudImage),
    ...hatAssets.map(({ image }) => waitForImage(image)),
    ...sceneImages.map(waitForImage),
    ...characterImages.map(waitForImage),
    preloadImage("assets/loading/loading-background.webp"),
    preloadImage("assets/loading/loading-progress-frame.webp"),
    preloadImage("assets/menu/menu-background.webp"),
    preloadImage("assets/menu/menu-dancers-poster.webp"),
    preloadImage("assets/menu/start-game-button.png"),
    preloadImage("assets/menu/camera-test-button.png"),
    preloadImage("assets/menu/setting-button.png"),
    preloadImage("assets/menu/guide-button.png"),
    preloadImage("assets/hud/symbols/stage-symbol.png"),
    preloadImage("assets/hud/symbols/score-symbol.png"),
    preloadImage("assets/hud/symbols/time-symbol.png"),
    preloadImage("assets/hud/symbols/energy-symbol.png"),
    preloadImage("assets/hud/symbols/pause-button.png"),
    preloadImage("assets/hud/stage-panel-guide.png"),
    preloadImage("assets/hud/score-panel-guide.png"),
    preloadImage("assets/hud/timer-panel-guide.png"),
    preloadImage("assets/hud/hearts-panel.png"),
    preloadImage("assets/hud/hearts-panel-pink.png"),
    preloadImage("assets/result-screen.webp")
  ];
  const mediaTasks = [els.menuMusic, els.startSound, els.finalCountdownSound, els.bonusSound, els.bigBonusSound, els.wrongAnswerSound, els.loseSound, els.endSound]
    .map(waitForMediaMetadata);
  const tasks = [document.fonts?.ready || Promise.resolve(), waitForMediaMetadata(els.menuDanceVideo), prepareEffectAudio(), ...imageTasks, ...mediaTasks];
  let completed = 0;
  await Promise.allSettled(tasks.map((task) => Promise.resolve(task).finally(() => {
    completed += 1;
    setLoadingProgress(5 + (completed / tasks.length) * 72, "กำลังเตรียมภาพ ตัวละคร และเสียง...");
  })));

  setLoadingProgress(82, "กำลังเตรียมระบบตรวจจับนิ้ว...");
  await Promise.race([loadHandTracking(null, true), sleep(12000)]);
  setLoadingProgress(93, "กำลังเตรียมหมวกโบนัส...");
  await Promise.race([loadBonusFaceTracking(), sleep(8000)]);
  setLoadingProgress(100, "พร้อมผจญภัยแล้ว!");
  await sleep(420);
  showMenu();
  els.entryGate.hidden = false;
}

function activateMenuVideo() {
  els.menuDanceVideo.defaultPlaybackRate = 1.5;
  els.menuDanceVideo.playbackRate = 1.5;
  els.menuDanceVideo.currentTime ||= 0;
  els.menuDanceVideo.play().catch(() => {});
}

function deactivateMenuVideo() {
  els.menuDanceVideo.pause();
}

async function startGame() {
  if (state.mode === "preparing") return;
  unlockGameAudio();
  if (isPortraitMobile()) {
    showOrientationGate(startGame);
    return;
  }
  state.mode = "preparing";
  pauseBackgroundMusic();
  stopSpokenWord();
  stopMenuMusic();
  deactivateMenuVideo();
  state.running = false;
  els.entryGate.hidden = true;
  showScreen(els.loading);
  setLoadingProgress(12, "กำลังเปิดกล้อง...");
  const [cameraAvailable] = await Promise.all([ensureCamera(), prepareEffectAudio()]);
  setLoadingProgress(68, cameraAvailable ? "กำลังปรับระบบตรวจจับนิ้ว..." : "กำลังเตรียมโหมดสัมผัส...");
  if (!state.handReady) await loadHandTracking(null, true);
  setLoadingProgress(100, cameraAvailable ? "ตรวจจับนิ้วพร้อมแล้ว!" : "พร้อมเล่นด้วยการแตะหน้าจอ!");
  await sleep(280);

  hideScreens();
  els.canvas.hidden = false;
  els.arFrame.hidden = false;
  els.hud.hidden = false;
  state.mode = "playing";
  state.running = true;
  state.paused = false;
  state.resuming = false;
  els.resumeBtn.disabled = false;
  els.pauseBtn.hidden = false;
  els.cameraTestControls.hidden = true;
  els.pauseOverlay.hidden = true;
  state.score = 0;
  state.level = 1;
  state.coins = 0;
  state.correctInLevel = 0;
  state.caughtWords = new Set();
  state.hearts = 3;
  state.combo = 0;
  state.maxCombo = 0;
  state.bonusFaceBox = null;
  state.bonusFaceMisses = 0;
  state.bonusFaceSuppressed = false;
  state.bonusFaceSlowSamples = 0;
  state.lastBonusFaceVideoTime = -1;
  state.bonusHatIndex = -1;
  state.correct = 0;
  state.wrong = 0;
  state.timeLeft = state.roundDuration;
  state.lastTimerWarning = null;
  els.finalCountdownSound.pause();
  els.finalCountdownSound.currentTime = 0;
  state.creatures = [];
  state.particles = [];
  state.lastTick = performance.now();
  state.lastSpawn = state.lastTick;
  state.sceneTransition = null;
  state.pendingSceneSpawn = false;
  state.pendingGoldenCreature = false;
  state.finalLevelAnnounced = false;
  state.lossFeedbackPending = false;
  state.pointer.active = true;
  state.catchRequested = false;
  state.pinchDown = false;
  const rect = els.stage.getBoundingClientRect();
  for (let index = 0; index < 3; index += 1) spawnCreature(rect, true);
  updateHud();
  showFeedback("ด่าน 1: จีบนิ้วหรือคลิกจับคำแม่ ก กา", "#ffffff");
  playAsset(els.startSound, 0.72);
  startBackgroundMusic();
}

function showMenu() {
  stopSpokenWord();
  state.running = false;
  state.paused = false;
  state.resuming = false;
  state.pendingLandscapeAction = null;
  els.orientationGate.hidden = true;
  els.resumeBtn.disabled = false;
  els.pauseBtn.hidden = true;
  els.cameraTestControls.hidden = true;
  els.pauseOverlay.hidden = true;
  stopBackgroundMusic();
  state.mode = "menu";
  els.canvas.hidden = true;
  els.arFrame.hidden = true;
  els.hud.hidden = true;
  state.creatures = [];
  state.particles = [];
  stopCameraStream();
  showScreen(els.menu);
  activateMenuVideo();
  startMenuMusic();
}

function openTimeSettings() {
  updateTimeOptions();
  if (els.wordVoiceToggle) els.wordVoiceToggle.checked = state.wordVoice;
  showScreen(els.time);
}

function updateTimeOptions() {
  els.timeOptions.forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.duration) === state.roundDuration);
  });
}

async function testCamera() {
  hideScreens();
  deactivateMenuVideo();
  els.canvas.hidden = false;
  els.arFrame.hidden = false;
  els.hud.hidden = true;
  state.mode = "camera";
  state.running = false;
  state.paused = false;
  els.pauseBtn.hidden = true;
  els.cameraTestControls.hidden = false;
  els.pauseOverlay.hidden = true;
  stopMenuMusic();
  state.creatures = [];
  state.particles = [];
  state.pointer.active = true;
  showFeedback("กำลังเปิดกล้อง...", "#ffffff");
  await ensureCamera();
  showFeedback(state.cameraReady ? "ขยับนิ้วในกล้อง หรือใช้เมาส์แทนได้" : "เปิดกล้องไม่ได้ ใช้เมาส์/ทัชแทน", "#ffffff");
}

function toggleSound() {
  state.sound = !state.sound;
  updateSoundButton();
  if (state.sound && state.mode === "menu") startMenuMusic();
  else if (state.sound && state.running) startBackgroundMusic();
  else if (!state.sound) {
    pauseBackgroundMusic();
    els.menuMusic.pause();
    [els.bgMusic, els.menuMusic].forEach((audio) => {
      const nodes = state.mediaAudioNodes.get(audio);
      if (nodes && state.audio) nodes.gain.gain.setValueAtTime(0, state.audio.currentTime);
    });
  }
  playButton();
}

function updateSoundButton() {
  if (!els.soundBtn) return;
  const label = state.sound ? "ปิดเสียง" : "เปิดเสียง";
  els.soundBtn.textContent = state.sound ? "🔊" : "🔇";
  els.soundBtn.setAttribute("aria-label", label);
  els.soundBtn.setAttribute("aria-pressed", String(!state.sound));
  els.soundBtn.title = label;
}

async function toggleFullscreen() {
  try {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement || state.pseudoFullscreen) {
      setPseudoFullscreen(false);
      if (fullscreenElement) {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
        await exitFullscreen?.call(document);
      }
    } else {
      setPseudoFullscreen(true);
      const requestFullscreen = els.stage.requestFullscreen || els.stage.webkitRequestFullscreen;
      if (requestFullscreen && !isIPhone) {
        try {
          await requestNativeFullscreen(requestFullscreen);
        } catch {}
      }
      window.scrollTo(0, 1);
      if (screen.orientation?.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      }
    }
  } catch {
    setPseudoFullscreen(true);
    window.scrollTo(0, 1);
  }
  updateFullscreenButton();
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement || state.pseudoFullscreen);
  const label = isFullscreen ? "ออกจากเต็มหน้าจอ" : "เต็มหน้าจอ";
  els.fullscreenBtn.textContent = isFullscreen ? "×" : "⛶";
  els.fullscreenBtn.setAttribute("aria-label", label);
  els.fullscreenBtn.title = label;
  window.requestAnimationFrame(resizeCanvas);
}

function togglePauseFromInput(event) {
  if (!event.isPrimary || event.button !== 0 || !state.running) return;
  event.preventDefault();
  event.stopPropagation();
  if (state.paused) resumeGame();
  else pauseGame();
}

function pauseGame() {
  if (!state.running || state.paused) return;
  state.paused = true;
  state.catchRequested = false;
  pauseBackgroundMusic();
  els.pauseOverlay.hidden = false;
}

async function resumeGame() {
  if (!state.paused || state.resuming) return;
  state.resuming = true;
  els.resumeBtn.disabled = true;
  if (!state.cameraReady) await ensureCamera();
  if (document.hidden) {
    state.resuming = false;
    els.resumeBtn.disabled = false;
    return;
  }
  state.paused = false;
  state.lastTick = performance.now();
  els.pauseOverlay.hidden = true;
  startBackgroundMusic();
  state.resuming = false;
  els.resumeBtn.disabled = false;
}

function stopCameraStream() {
  state.cameraRequestId += 1;
  const stream = els.camera.srcObject;
  if (stream?.getTracks) stream.getTracks().forEach((track) => track.stop());
  els.camera.pause();
  els.camera.srcObject = null;
  els.camera.classList.remove("is-live");
  state.cameraReady = false;
  state.lastVideoTime = -1;
  state.pinchDown = false;
  state.pointer.active = false;
  state.thumb.active = false;
  state.bonusFaceBox = null;
  state.bonusFaceMisses = 0;
  state.bonusHatIndex = -1;
}

function suspendForBackground() {
  if (state.running && !state.paused) pauseGame();
  els.menuMusic.pause();
  pauseBackgroundMusic();
  stopCameraStream();
}

function startBackgroundMusic() {
  if (!state.sound || state.mode !== "playing" || !state.running || state.paused) return;
  stopMenuMusic();
  els.bgMusic.muted = false;
  setMediaMusicLevel(els.bgMusic, GAME_MUSIC_LEVEL);
  els.bgMusic.play().catch(() => {
    // Browsers require a player gesture before background audio can begin.
  });
}

function startMenuMusic() {
  if (!state.sound || state.mode !== "menu") return;
  setMediaMusicLevel(els.menuMusic, MENU_MUSIC_LEVEL);
  els.menuMusic.muted = false;
  els.menuMusic.play()
    .then(() => {
      if (!state.sound || state.mode !== "menu") {
        els.menuMusic.pause();
        els.menuMusic.currentTime = 0;
      }
    })
    .catch(() => {});
}

function unlockMenuMusic() {
  if (state.mode !== "menu" || !state.sound) return;
  startMenuMusic();
}

function stopBackgroundMusic() {
  pauseBackgroundMusic();
  els.bgMusic.currentTime = 0;
  els.bgMusic.muted = true;
}

function pauseBackgroundMusic() {
  els.bgMusic.pause();
  setMediaMusicLevel(els.bgMusic, 0);
}

function stopMenuMusic() {
  els.menuMusic.pause();
  els.menuMusic.currentTime = 0;
}

function setMediaMusicLevel(audio, level) {
  audio.volume = level;
  const context = audioContext();
  if (!context) return;
  let nodes = state.mediaAudioNodes.get(audio);
  if (!nodes) {
    try {
      const source = context.createMediaElementSource(audio);
      const gain = context.createGain();
      source.connect(gain).connect(context.destination);
      nodes = { source, gain };
      state.mediaAudioNodes.set(audio, nodes);
    } catch {
      return;
    }
  }
  nodes.gain.gain.setTargetAtTime(level, context.currentTime, 0.025);
}

function playAsset(audio, volume = 0.45) {
  if (!state.sound) return;
  const effectiveVolume = Math.min(volume, EFFECT_LEVEL);
  const context = audioContext();
  const url = audioAssetUrl(audio);
  const buffer = url ? state.audioBuffers.get(url) : null;
  if (context && context.state === "running" && buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = effectiveVolume;
    source.connect(gain).connect(context.destination);
    source.start();
    document.documentElement.dataset.lastAudioAsset = url;
    document.documentElement.dataset.lastAudioAt = String(Date.now());
    return;
  }
  if (url) void preloadAudioAsset(audio);
  audio.pause();
  audio.currentTime = 0;
  audio.volume = effectiveVolume;
  audio.play()
    .then(() => {
      document.documentElement.dataset.lastAudioAsset = url;
      document.documentElement.dataset.lastAudioAt = String(Date.now());
    })
    .catch(() => {});
}

function audioAssetUrl(audio) {
  return audio.currentSrc || audio.src || audio.querySelector?.("source")?.src || "";
}

function effectAudioAssets() {
  return [
    els.startSound,
    els.finalCountdownSound,
    els.bonusSound,
    els.bigBonusSound,
    els.wrongAnswerSound,
    els.loseSound,
    els.endSound,
    ...wrongFeedbackAudio,
    ...wordAudio.values()
  ];
}

async function preloadAudioAsset(audio) {
  const context = audioContext();
  const url = audioAssetUrl(audio);
  if (!context || !url || state.audioBuffers.has(url)) return;
  if (state.audioBufferLoads.has(url)) return state.audioBufferLoads.get(url);
  const loading = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Audio ${response.status}`);
      return response.arrayBuffer();
    })
    .then((bytes) => context.decodeAudioData(bytes))
    .then((buffer) => state.audioBuffers.set(url, buffer))
    .catch(() => {})
    .finally(() => state.audioBufferLoads.delete(url));
  state.audioBufferLoads.set(url, loading);
  return loading;
}

function unlockGameAudio() {
  if (!state.sound) return;
  primeBackgroundMusic();
  const context = audioContext();
  if (context) {
    context.resume?.().catch(() => {});
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.start(0);
    const gameplayMusicLevel = state.mode === "playing" && state.running && !state.paused
      ? GAME_MUSIC_LEVEL
      : 0;
    setMediaMusicLevel(els.bgMusic, gameplayMusicLevel);
    setMediaMusicLevel(els.menuMusic, state.mode === "menu" ? MENU_MUSIC_LEVEL : 0);
  }
  void prepareEffectAudio();
}

function primeBackgroundMusic() {
  if (!state.sound || !els.bgMusic.paused) return;
  // Keep the primed track silent through loading; gameplay opens its gain later.
  els.bgMusic.muted = true;
  setMediaMusicLevel(els.bgMusic, 0);
  els.bgMusic.play().catch(() => {});
}

function prepareEffectAudio() {
  state.effectAudioReady ||= Promise.allSettled(effectAudioAssets().map(preloadAudioAsset));
  return state.effectAudioReady;
}

function openInChrome() {
  unlockGameAudio();
  const current = new URL(window.location.href);
  current.searchParams.delete("sound");
  if (isAndroid) {
    const target = `${current.host}${current.pathname}${current.search}${current.hash}`;
    window.location.href = `intent://${target}#Intent;scheme=${current.protocol.slice(0, -1)};package=com.android.chrome;end`;
    return;
  }
  if (isIOS) {
    const scheme = current.protocol === "https:" ? "googlechromes:" : "googlechrome:";
    window.location.href = `${scheme}//${current.host}${current.pathname}${current.search}${current.hash}`;
    window.setTimeout(showEntryDisplayHelp, 900);
    return;
  }
  showEntryDisplayHelp();
}

async function ensureCamera() {
  if (state.cameraReady) return true;
  const requestId = ++state.cameraRequestId;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640, max: 640 },
        height: { ideal: 360, max: 360 },
        frameRate: { ideal: 24, max: 30 }
      },
      audio: false
    });
    if (requestId !== state.cameraRequestId || document.hidden) {
      stream.getTracks().forEach((track) => track.stop());
      return false;
    }
    els.camera.srcObject = stream;
    await els.camera.play();
    els.camera.classList.add("is-live");
    state.cameraReady = true;
    loadHandTracking();
    return true;
  } catch {
    if (requestId === state.cameraRequestId) state.cameraReady = false;
    showFeedback("เปิดกล้องไม่ได้ ใช้เมาส์หรือแตะหน้าจอแทน", "#ffffff");
    return false;
  }
}

async function loadHandTracking(forcedDelegate = null, silent = false) {
  if (state.handReady) return true;
  if (state.handTrackingLoading) return state.handTrackingPromise;
  state.handTrackingLoading = true;
  state.handTrackingPromise = (async () => {
    try {
      const vision = await import("./assets/vendor/mediapipe/vision_bundle.mjs");
      const resolver = await vision.FilesetResolver.forVisionTasks(
        "./assets/vendor/mediapipe/wasm"
      );
      const delegates = forcedDelegate ? [forcedDelegate] : isAndroid ? ["CPU", "GPU"] : ["GPU", "CPU"];
      let lastError = null;
      for (const delegate of delegates) {
        try {
          state.handLandmarker = await vision.HandLandmarker.createFromOptions(resolver, {
            baseOptions: {
              modelAssetPath: "./assets/vendor/mediapipe/models/hand_landmarker.task",
              delegate
            },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: isAndroid ? 0.4 : 0.5,
            minHandPresenceConfidence: isAndroid ? 0.4 : 0.5,
            minTrackingConfidence: isAndroid ? 0.4 : 0.5
          });
          state.handTrackingDelegate = delegate;
          state.handReady = true;
          state.lastVideoTime = -1;
          if (!silent) showFeedback("ตรวจจับนิ้วพร้อมแล้ว", "#ffffff");
          return true;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("Hand tracking unavailable");
    } catch {
      state.handReady = false;
      if (!silent) showFeedback("ตรวจนิ้วไม่พร้อม ใช้เมาส์/ทัชแทนได้", "#ffffff");
      return false;
    } finally {
      state.handTrackingLoading = false;
      state.handTrackingPromise = null;
    }
  })();
  return state.handTrackingPromise;
}

async function loadBonusFaceTracking() {
  if (state.bonusFaceReady) return true;
  if (state.bonusFaceLoading) return state.bonusFacePromise;
  state.bonusFaceLoading = true;
  state.bonusFacePromise = (async () => {
    try {
      const vision = await import("./assets/vendor/mediapipe/vision_bundle.mjs");
      const resolver = await vision.FilesetResolver.forVisionTasks("./assets/vendor/mediapipe/wasm");
      state.bonusFaceDetector = await vision.FaceDetector.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath: "./assets/vendor/mediapipe/models/blaze_face_short_range.tflite",
          delegate: "CPU"
        },
        runningMode: "VIDEO",
        minDetectionConfidence: 0.52,
        minSuppressionThreshold: 0.3
      });
      state.bonusFaceReady = true;
      state.lastBonusFaceVideoTime = -1;
      return true;
    } catch {
      state.bonusFaceReady = false;
      return false;
    } finally {
      state.bonusFaceLoading = false;
      state.bonusFacePromise = null;
    }
  })();
  return state.bonusFacePromise;
}

function recoverHandTracking() {
  if (state.handTrackingRecoveries >= 2) {
    state.handReady = false;
    showFeedback("ตรวจนิ้วไม่พร้อม ใช้การแตะหน้าจอแทนได้", "#ffffff", 3000);
    return;
  }
  state.handTrackingRecoveries += 1;
  const failedDelegate = state.handTrackingDelegate;
  state.handReady = false;
  state.pinchDown = false;
  state.thumb.active = false;
  try {
    state.handLandmarker?.close?.();
  } catch {}
  state.handLandmarker = null;
  state.handTrackingDelegate = null;
  loadHandTracking(failedDelegate === "GPU" ? "CPU" : "GPU");
}

function loop(now) {
  if (state.renderInterval && now - state.lastRenderAt < state.renderInterval - 2) {
    requestAnimationFrame(loop);
    return;
  }
  state.lastRenderAt = now;
  if (document.hidden) {
    requestAnimationFrame(loop);
    return;
  }
  const runtimeActive = state.mode === "playing" || state.mode === "camera";
  const rect = state.stageRect || els.stage.getBoundingClientRect();
  if (!runtimeActive) {
    if (!state.inactiveCanvasCleared) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      state.inactiveCanvasCleared = true;
    }
    state.pointer.active = false;
    state.thumb.active = false;
    drawPointer();
    requestAnimationFrame(loop);
    return;
  }
  state.inactiveCanvasCleared = false;
  ctx.clearRect(0, 0, rect.width, rect.height);

  if (state.mode === "playing") drawSceneBackdrop(rect);
  else if (!state.cameraReady) drawMenuBackdrop(rect);
  drawAmbient(rect, now);

  const needsHandTracking = state.mode === "camera" || (state.mode === "playing" && !state.paused);
  if (needsHandTracking && state.cameraReady && state.handReady && state.handLandmarker) {
    try {
      updateHandPointer(now, rect);
    } catch {
      showFeedback("กำลังสลับระบบตรวจจับนิ้ว...", "#ffffff", 2200);
      recoverHandTracking();
    }
  }
  const bonusHatActive = state.mode === "playing" && !state.paused && state.combo >= 4;
  if (bonusHatActive) {
    if (state.bonusHatIndex < 0) state.bonusHatIndex = Math.floor(Math.random() * hatAssets.length);
    const handDetectedThisFrame = state.lastHandDetectionAt === now;
    if (state.cameraReady && state.bonusFaceReady && !state.bonusFaceSuppressed && !handDetectedThisFrame) {
      updateBonusFace(now);
    }
    drawBonusHat(rect, now);
  } else {
    state.bonusFaceBox = null;
    state.bonusFaceMisses = 0;
    state.bonusHatIndex = -1;
  }
  if (state.running && !state.paused) {
    const delta = Math.max(0, Math.min((now - state.lastTick) / 1000, 0.05));
    state.lastTick = now;
    state.timeLeft = Math.max(0, state.timeLeft - delta);
    playFinalCountdownWarning();
    // Keep the lesson readable: four word-creatures at most are on screen.
    // This gives young learners time to look at each Thai word before choosing.
    if (!state.sceneTransition && state.pendingSceneSpawn) {
      for (let index = 0; index < 3; index += 1) spawnCreature(rect, true);
      state.pendingSceneSpawn = false;
      if (state.pendingGoldenCreature) {
        spawnGoldenCreature(rect);
        state.pendingGoldenCreature = false;
      }
      state.lastSpawn = now;
    }
    if (!state.sceneTransition && state.creatures.length < 4 && now - state.lastSpawn > spawnDelay()) {
      spawnCreature(rect);
      state.lastSpawn = now;
    }
    updateCreatures(delta, rect);
    updateParticles(delta);
    checkHits();
    updateHud();
    if (!state.lossFeedbackPending && (state.timeLeft <= 0 || state.hearts <= 0)) endGame();
  } else if (state.mode === "camera") {
    drawCameraGuide(rect);
  }

  if (state.mode === "playing") {
    drawCloudTrails();
    drawCreatures();
    drawParticles();
  }
  drawPointer();
  requestAnimationFrame(loop);
}

function drawMenuBackdrop(rect) {
  drawCoverImage(menuImage, rect);
  ctx.fillStyle = state.mode === "menu" ? "rgba(255, 255, 255, 0.04)" : "rgba(8, 55, 42, 0.28)";
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function drawSceneBackdrop(rect) {
  const overlayAlpha = state.cameraReady ? 0.26 : 1;
  const transition = state.sceneTransition;

  if (transition) {
    const progress = Math.min(1, (performance.now() - transition.startedAt) / 900);
    ctx.save();
    ctx.globalAlpha = overlayAlpha * (1 - progress);
    drawCoverImage(sceneImages[transition.fromLevel - 1], rect);
    ctx.globalAlpha = overlayAlpha * progress;
    drawCoverImage(sceneImages[state.level - 1], rect);
    ctx.restore();
    if (progress === 1) state.sceneTransition = null;
  } else {
    ctx.save();
    ctx.globalAlpha = overlayAlpha;
    drawCoverImage(sceneImages[state.level - 1], rect);
    ctx.restore();
  }

  const tintScale = state.cameraReady ? 0.58 : 1;
  ctx.fillStyle = state.level === 2 ? `rgba(29, 12, 70, ${0.28 * tintScale})` : state.level === 3 ? `rgba(0, 78, 111, ${0.16 * tintScale})` : state.level === 4 ? `rgba(255, 174, 72, ${0.12 * tintScale})` : `rgba(24, 71, 32, ${0.1 * tintScale})`;
  ctx.fillRect(0, 0, rect.width, rect.height);

  if (state.cameraReady) {
    const innerRadius = Math.min(rect.width, rect.height) * 0.13;
    const outerRadius = Math.max(rect.width, rect.height) * 0.62;
    const clearCenter = ctx.createRadialGradient(
      rect.width * 0.5,
      rect.height * 0.52,
      innerRadius,
      rect.width * 0.5,
      rect.height * 0.52,
      outerRadius
    );
    clearCenter.addColorStop(0, "rgba(0, 0, 0, 0.96)");
    clearCenter.addColorStop(0.38, "rgba(0, 0, 0, 0.82)");
    clearCenter.addColorStop(0.72, "rgba(0, 0, 0, 0.2)");
    clearCenter.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = clearCenter;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();
  }
}

function drawCoverImage(image, rect) {
  if (!image?.complete || !image.naturalWidth) return;
  const imgRatio = image.width / image.height;
  const viewRatio = rect.width / rect.height;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;
  if (imgRatio > viewRatio) {
    sw = image.height * viewRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / viewRatio;
    sy = (image.height - sh) / 2;
  }
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, rect.width, rect.height);
}

function drawAmbient(rect, now) {
  ctx.save();
  ctx.globalAlpha = state.cameraReady ? 0.18 : 0.55;
  const ambientCount = isAndroid || isIOS ? 7 : 14;
  for (let i = 0; i < ambientCount; i += 1) {
    const scene = state.mode === "playing" ? state.level : 1;
    const x = scene === 4 ? (i * 157 + now * 0.03) % (rect.width + 80) - 40 : (i * 211 + now * 0.018) % (rect.width + 80) - 40;
    const y = scene === 1 ? rect.height - ((i * 91 + now * 0.024) % (rect.height + 80)) : scene === 3 ? rect.height - ((i * 97 + now * 0.028) % (rect.height + 90)) : (i * 97 + Math.sin(now / 900 + i) * 26) % rect.height;
    ctx.beginPath();
    const colors = scene === 2 ? ["#e79cff", "#8de7ff", "#ffd0ec"] : scene === 3 ? ["#b9f6ff", "#70d9ff", "#ffffff"] : scene === 4 ? ["#ffd17d", "#ff8cb3", "#fff1a8"] : ["#fff4a3", "#d9ffd6", "#ffffff"];
    ctx.fillStyle = colors[i % colors.length];
    if (scene === 3) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.arc(x, y, 4 + (i % 4), 0, Math.PI * 2);
      ctx.stroke();
    } else if (scene === 4) {
      ctx.ellipse(x, y, 6 + (i % 3), 3 + (i % 2), (now / 900 + i) % Math.PI, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(x, y, 3 + (i % 5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function updateBonusFace(now) {
  if (els.camera.readyState < 2 || els.camera.currentTime === state.lastBonusFaceVideoTime) return;
  if (now - state.lastBonusFaceDetectionAt < state.bonusFaceDetectionInterval) return;
  state.lastBonusFaceDetectionAt = now;
  state.lastBonusFaceVideoTime = els.camera.currentTime;
  try {
    const startedAt = performance.now();
    const result = state.bonusFaceDetector.detectForVideo(els.camera, now);
    const detectionCost = performance.now() - startedAt;
    state.bonusFaceSlowSamples = detectionCost > 48
      ? state.bonusFaceSlowSamples + 1
      : Math.max(0, state.bonusFaceSlowSamples - 1);
    if (state.bonusFaceSlowSamples >= 8) {
      state.bonusFaceSuppressed = true;
      state.bonusFaceBox = null;
      showFeedback("ลดเอฟเฟกต์หมวกอัตโนมัติ เพื่อให้เกมลื่นขึ้น", "#ffffff", 2200);
      return;
    }

    const detection = (result.detections || []).reduce((largest, item) => {
      if (!item.boundingBox) return largest;
      if (!largest) return item;
      const area = item.boundingBox.width * item.boundingBox.height;
      const largestArea = largest.boundingBox.width * largest.boundingBox.height;
      return area > largestArea ? item : largest;
    }, null);
    if (!detection?.boundingBox) {
      state.bonusFaceMisses += 1;
      if (state.bonusFaceMisses > 5) state.bonusFaceBox = null;
      return;
    }

    state.bonusFaceMisses = 0;
    const box = detection.boundingBox;
    const target = { x: box.originX, y: box.originY, width: box.width, height: box.height };
    if (!state.bonusFaceBox) {
      state.bonusFaceBox = target;
      return;
    }
    state.bonusFaceBox.x += (target.x - state.bonusFaceBox.x) * 0.32;
    state.bonusFaceBox.y += (target.y - state.bonusFaceBox.y) * 0.32;
    state.bonusFaceBox.width += (target.width - state.bonusFaceBox.width) * 0.2;
    state.bonusFaceBox.height += (target.height - state.bonusFaceBox.height) * 0.2;
  } catch {
    state.bonusFaceReady = false;
    state.bonusFaceBox = null;
  }
}

function drawBonusHat(rect, now) {
  const face = state.bonusFaceBox;
  const asset = hatAssets[state.bonusHatIndex];
  if (!face || !asset?.image.complete || !asset.image.naturalWidth || !state.cameraReady) return;

  const videoWidth = els.camera.videoWidth || 640;
  const videoHeight = els.camera.videoHeight || 360;
  const coverScale = Math.max(rect.width / videoWidth, rect.height / videoHeight);
  const cropX = (videoWidth * coverScale - rect.width) * 0.5;
  const cropY = (videoHeight * coverScale - rect.height) * 0.5;
  const faceWidth = face.width * coverScale;
  const faceHeight = face.height * coverScale;
  const centerX = rect.width - ((face.x + face.width * 0.5) * coverScale - cropX);
  const faceTop = face.y * coverScale - cropY;
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  const drawWidth = Math.max(92 * viewportScale, Math.min(faceWidth * asset.widthScale, rect.width * 0.34));
  const [, , sourceWidth, sourceHeight] = asset.crop;
  const drawHeight = drawWidth * (sourceHeight / sourceWidth);
  const bob = Math.sin(now / 280) * 1.8 * viewportScale;
  const drawX = centerX - drawWidth * 0.5;
  const drawY = faceTop + faceHeight * 0.22 - drawHeight + bob;
  const glowStrength = state.combo >= 8 ? 0.16 : 0.1;
  const glowCenterY = drawY + drawHeight * 0.56;
  const glowRadius = drawWidth * 0.68;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const glow = ctx.createRadialGradient(centerX, glowCenterY, drawWidth * 0.08, centerX, glowCenterY, glowRadius);
  glow.addColorStop(0, hexToRgba(asset.glow, glowStrength));
  glow.addColorStop(0.48, hexToRgba(asset.glow, glowStrength * 0.42));
  glow.addColorStop(1, hexToRgba(asset.glow, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, glowCenterY, glowRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = state.combo >= 8 ? 0.5 : 0.42;
  ctx.drawImage(asset.image, ...asset.crop, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function hexToRgba(hex, alpha) {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function drawCameraGuide(rect) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 250, 223, 0.88)";
  roundRect(ctx, rect.width / 2 - 245, rect.height / 2 - 90, 490, 180, 8);
  ctx.fill();
  ctx.fillStyle = "#6e3a17";
  ctx.textAlign = "center";
  ctx.font = "700 30px 'Mali', 'Leelawadee UI', sans-serif";
  ctx.fillText(state.handReady ? "ตรวจจับนิ้วพร้อมแล้ว" : "ยกนิ้วชี้ให้อยู่ในกล้อง", rect.width / 2, rect.height / 2 - 14);
  ctx.font = "700 20px 'Mali', 'Leelawadee UI', sans-serif";
  ctx.fillText("หรือใช้เมาส์/แตะหน้าจอเพื่อเล่น", rect.width / 2, rect.height / 2 + 34);
  ctx.restore();
}

function updateHandPointer(now, rect) {
  if (els.camera.readyState < 2 || els.camera.currentTime === state.lastVideoTime) return;
  if (now - state.lastHandDetectionAt < state.handDetectionInterval) return;
  state.lastHandDetectionAt = now;
  state.lastVideoTime = els.camera.currentTime;
  const result = state.handLandmarker.detectForVideo(els.camera, now);
  const nearestHand = getClosestHand(result.landmarks);
  const tip = nearestHand?.[8];
  const thumb = nearestHand?.[4];
  if (!tip || !thumb) {
    state.pinchDown = false;
    state.thumb.active = false;
    return;
  }
  state.pointer.x = (1 - tip.x) * rect.width;
  state.pointer.y = tip.y * rect.height;
  state.pointer.active = true;
  state.pointer.source = "finger";
  state.thumb.x = (1 - thumb.x) * rect.width;
  state.thumb.y = thumb.y * rect.height;
  state.thumb.active = true;
  const wrist = nearestHand[0];
  const middlePalm = nearestHand[9];
  const pinchDistance = Math.hypot(tip.x - thumb.x, tip.y - thumb.y);
  const palmSize = wrist && middlePalm ? Math.hypot(wrist.x - middlePalm.x, wrist.y - middlePalm.y) : 0;
  state.pinchDistance = palmSize > 0.04 ? pinchDistance / palmSize : pinchDistance / 0.15;
  // Scale the pinch against the player's palm so phones work at different distances.
  const pinchStarts = state.pinchDistance < 0.38;
  const pinchReleases = state.pinchDistance > 0.58;
  if (!state.pinchDown && pinchStarts) {
    state.pinchDown = true;
    pinchSporeBurst((state.pointer.x + state.thumb.x) * 0.5, (state.pointer.y + state.thumb.y) * 0.5);
    requestCatch();
  } else if (state.pinchDown && pinchReleases) {
    state.pinchDown = false;
  }
}

function getClosestHand(hands = []) {
  let closestHand = null;
  let largestFootprint = 0;
  for (const hand of hands) {
    if (!hand?.[8] || !hand?.[4]) continue;
    const xs = hand.map((point) => point.x);
    const ys = hand.map((point) => point.y);
    const footprint = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    if (footprint > largestFootprint) {
      largestFootprint = footprint;
      closestHand = hand;
    }
  }
  return closestHand;
}

function updatePointer(event) {
  const rect = els.stage.getBoundingClientRect();
  state.pointer.x = event.clientX - rect.left;
  state.pointer.y = event.clientY - rect.top;
  state.pointer.active = true;
  state.pointer.source = "mouse";
  state.thumb.active = false;
}

function requestPointerCatch(event) {
  updatePointer(event);
  requestCatch();
}

function updateTouch(event) {
  const touch = event.touches[0];
  if (!touch) return;
  updatePointer(touch);
  requestCatch();
}

function requestCatch() {
  if (state.running && !state.paused) state.catchRequested = true;
}

function handleResultKeyboard(event) {
  if (state.mode !== "result") return;
  const buttons = [els.replayBtn, els.homeBtn];
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    const direction = event.key === "ArrowRight" ? 1 : -1;
    buttons[(current + direction + buttons.length) % buttons.length].focus({ preventScroll: true });
    return;
  }
  if (event.key !== "Enter" && event.code !== "Space") return;
  event.preventDefault();
  const activeButton = buttons.includes(document.activeElement) ? document.activeElement : els.replayBtn;
  activeButton.click();
}

function spawnDelay() {
  const progress = 1 - state.timeLeft / state.roundDuration;
  return 2350 - state.level * 220 - progress * 500;
}

function createEntityId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  entitySequence += 1;
  return `creature-${Date.now()}-${entitySequence}`;
}

function createSpawnPosition(rect, size, startInPlayfield, side) {
  let fallback = { x: rect.width / 2, y: rect.height / 2 };
  for (let attempt = 0; attempt < 14; attempt += 1) {
    const candidate = startInPlayfield
      ? {
          x: rect.width * (0.1 + Math.random() * 0.8),
          y: rect.height * (0.28 + Math.random() * 0.56)
        }
      : {
          x: side === 1 ? rect.width + size : side === 3 ? -size : Math.random() * rect.width,
          y: side === 2 ? rect.height + size : side === 0 ? -size : rect.height * (0.2 + Math.random() * 0.68)
        };
    fallback = candidate;
    const clear = state.creatures.every((creature) => {
      const minimumDistance = (size + creature.size) * 0.7;
      return Math.hypot(candidate.x - creature.x, candidate.y - creature.y) >= minimumDistance;
    });
    if (clear) return candidate;
  }
  return fallback;
}

function spawnCreature(rect, startInPlayfield = false) {
  const correctChance = state.level === 1 ? 0.78 : state.level === 2 ? 0.68 : 0.58;
  const pool = Math.random() < correctChance ? correctWords : wrongWords;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const side = Math.floor(Math.random() * 4);
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  const size = Math.max(118 * viewportScale, Math.min(rect.width, rect.height) * (0.16 + Math.random() * 0.045));
  const elapsed = Math.max(0, state.roundDuration - state.timeLeft);
  const compactMotionScale = Math.max(0.72, Math.min(1, rect.height / 500));
  const speed = (62 + Math.random() * 72 + state.level * 24 + elapsed * 1.3) * viewportScale * compactMotionScale;
  const spawn = createSpawnPosition(rect, size, startInPlayfield, side);
  const creature = {
    ...item,
    id: createEntityId(),
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    size,
    speed,
    phase: Math.random() * Math.PI * 2,
    wobble: (16 + Math.random() * 26) * viewportScale,
    characterIndex: Math.floor(Math.random() * characterImages.length),
    cloudIndex: Math.floor(Math.random() * wordCloudImages.length),
    lastTrail: 0,
    life: 0
  };
  const targetX = rect.width * (0.08 + Math.random() * 0.84);
  const targetY = rect.height * (0.22 + Math.random() * 0.66);
  const angle = Math.atan2(targetY - creature.y, targetX - creature.x);
  creature.vx = Math.cos(angle) * speed;
  creature.vy = Math.sin(angle) * speed;
  state.creatures.push(creature);
}

function spawnGoldenCreature(rect) {
  const item = correctWords[Math.floor(Math.random() * correctWords.length)];
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  const size = Math.max(146 * viewportScale, Math.min(rect.width, rect.height) * 0.23);
  const spawn = createSpawnPosition(rect, size, true, 0);
  const angle = Math.random() * Math.PI * 2;
  const speed = 62 * viewportScale;
  const creature = {
    ...item,
    id: createEntityId(),
    golden: true,
    x: spawn.x,
    y: spawn.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    speed,
    phase: Math.random() * Math.PI * 2,
    wobble: 20 * viewportScale,
    characterIndex: Math.floor(Math.random() * characterImages.length),
    cloudIndex: Math.floor(Math.random() * wordCloudImages.length),
    lastTrail: 0,
    life: 0
  };
  state.creatures.push(creature);
  showFeedback("เมฆทองมาแล้ว! จับคำแม่ ก กา รับคะแนนพิเศษ", "#fff3a3");
}

function updateCreatures(delta, rect) {
  for (const creature of state.creatures) {
    creature.life += delta;
    creature.x += creature.vx * delta;
    creature.y += creature.vy * delta + Math.sin(creature.life * 4 + creature.phase) * 0.85;
    if (creature.life - creature.lastTrail > (creature.golden ? 0.07 : 0.11)) {
      emitCloudTrail(creature);
      creature.lastTrail = creature.life;
    }
  }
  separateCreatures(delta, rect);
  keepCreaturesMoving(rect);
  state.creatures = state.creatures.filter((creature) => {
    const pad = creature.size * 1.4;
    return creature.x > -pad && creature.x < rect.width + pad && creature.y > -pad && creature.y < rect.height + pad;
  });
}

function separateCreatures(delta, rect) {
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  for (let firstIndex = 0; firstIndex < state.creatures.length; firstIndex += 1) {
    const first = state.creatures[firstIndex];
    for (let secondIndex = firstIndex + 1; secondIndex < state.creatures.length; secondIndex += 1) {
      const second = state.creatures[secondIndex];
      let dx = second.x - first.x;
      let dy = second.y - first.y;
      let distance = Math.hypot(dx, dy);
      const minimumDistance = (first.size + second.size) * 0.68;
      if (distance >= minimumDistance) continue;
      if (distance < 0.001) {
        const angle = (first.phase + second.phase) * 0.5;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const overlap = minimumDistance - distance;
      const correction = Math.min(overlap * 0.5, overlap * delta * 8 + 0.35 * viewportScale);
      first.x -= normalX * correction;
      first.y -= normalY * correction;
      second.x += normalX * correction;
      second.y += normalY * correction;

      const separationKick = Math.min(34 * viewportScale, 10 * viewportScale + overlap * 0.1);
      first.vx -= normalX * separationKick * 0.5;
      first.vy -= normalY * separationKick * 0.5;
      second.vx += normalX * separationKick * 0.5;
      second.vy += normalY * separationKick * 0.5;

      const closingSpeed = (first.vx - second.vx) * normalX + (first.vy - second.vy) * normalY;
      if (closingSpeed > 0) {
        const impulse = Math.min(closingSpeed * 0.38, 58 * viewportScale);
        first.vx -= normalX * impulse * 0.5;
        first.vy -= normalY * impulse * 0.5;
        second.vx += normalX * impulse * 0.5;
        second.vy += normalY * impulse * 0.5;
      }
    }
  }
}

function keepCreaturesMoving(rect) {
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  for (const creature of state.creatures) {
    const currentSpeed = Math.hypot(creature.vx, creature.vy);
    const desiredSpeed = creature.speed || 62 * viewportScale;
    const minimumSpeed = Math.max(34 * viewportScale, desiredSpeed * 0.55);
    const maximumSpeed = Math.max(minimumSpeed, desiredSpeed * 1.35);
    if (currentSpeed < minimumSpeed) {
      const angle = currentSpeed > 1
        ? Math.atan2(creature.vy, creature.vx)
        : creature.phase + creature.life * 0.17;
      creature.vx = Math.cos(angle) * minimumSpeed;
      creature.vy = Math.sin(angle) * minimumSpeed;
    } else if (currentSpeed > maximumSpeed) {
      const scale = maximumSpeed / currentSpeed;
      creature.vx *= scale;
      creature.vy *= scale;
    }
  }
}

function emitCloudTrail(creature) {
  const speed = Math.hypot(creature.vx, creature.vy) || 1;
  const count = creature.golden ? 2 : 1;
  for (let index = 0; index < count; index += 1) {
    const offset = (Math.random() - 0.5) * creature.size * 0.22;
    state.particles.push({
      x: creature.x - (creature.vx / speed) * creature.size * 0.5 + offset,
      y: creature.y - (creature.vy / speed) * creature.size * 0.12 + offset * 0.22,
      vx: -creature.vx * (0.08 + Math.random() * 0.07),
      vy: -10 - Math.random() * 22,
      r: creature.golden ? 4 + Math.random() * 4 : 3 + Math.random() * 3,
      color: creature.golden ? (index ? "#fff8b7" : "#ffc83d") : ["#ffffff", "#ffecc2", "#f7bcff"][Math.floor(Math.random() * 3)],
      shape: creature.golden && index === 0 ? "star" : "circle",
      life: creature.golden ? 0.72 : 0.58,
      maxLife: creature.golden ? 0.72 : 0.58,
      gravity: -8,
      behind: true
    });
  }
}

function drawCreatures() {
  for (const creature of state.creatures) {
    drawCreature(creature);
  }
}

function drawCreature(creature) {
  const x = creature.x;
  const y = creature.y + Math.sin(creature.life * 5 + creature.phase) * creature.wobble;
  const size = creature.size;
  const cloud = wordCloudImages[creature.cloudIndex];
  const character = characterImages[creature.characterIndex];
  const characterBob = Math.sin(creature.life * 7 + creature.phase) * size * 0.045;
  const movement = Math.min(1, Math.hypot(creature.vx, creature.vy) / 240);
  const puff = Math.sin(creature.life * 12 + creature.phase) * 0.022;
  const cloudScaleX = 1 + movement * 0.045 + puff;
  const cloudScaleY = 1 + puff * 0.72;
  let wordCenterX = 0;
  let wordCenterY = size * 0.34;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(creature.life * 3 + creature.phase) * 0.045);
  ctx.shadowColor = "rgba(45, 29, 10, 0.28)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;

  ctx.shadowColor = "transparent";
  if (cloud.complete && cloud.naturalWidth) {
    // Animate the puff without changing the source cloud's natural proportions.
    ctx.save();
    ctx.scale(cloudScaleX, cloudScaleY);
    if (creature.golden) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 205, 44, 0.42)";
      ctx.shadowColor = "#ffe56a";
      ctx.shadowBlur = size * 0.36;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.12, size * 0.66, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.filter = "sepia(0.85) saturate(1.7) hue-rotate(350deg) brightness(1.12)";
    }
    const cloudWidth = size * 1.62;
    const cloudHeight = cloudWidth * (cloud.naturalHeight / cloud.naturalWidth);
    const cloudY = -size * 0.08;
    ctx.drawImage(cloud, -cloudWidth / 2, cloudY, cloudWidth, cloudHeight);
    // The visible cloud artwork sits slightly left inside its transparent PNG canvas.
    wordCenterX = -cloudWidth * 0.025 * cloudScaleX;
    wordCenterY = (cloudY + cloudHeight * 0.51) * cloudScaleY;
    ctx.filter = "none";
    ctx.restore();
  }
  if (character.complete && character.naturalWidth) {
    drawContainedCharacter(character, size, characterBob);
  }

  ctx.fillStyle = creature.golden ? "#754000" : "#16120f";
  ctx.textAlign = "center";
  const wordFontSize = Math.max(14, size * 0.28);
  ctx.font = `700 ${wordFontSize}px 'Mali', 'Leelawadee UI', sans-serif`;
  drawVisuallyCenteredText(ctx, creature.word, wordCenterX, wordCenterY, size * 1.12, wordFontSize);
  ctx.restore();
}

function drawVisuallyCenteredText(context, text, centerX, centerY, maxWidth, fontSize) {
  const color = String(context.fillStyle);
  const roundedFontSize = Math.round(fontSize * 2) / 2;
  const cacheKey = `${text}|${roundedFontSize}|${color}`;
  let sprite = wordSpriteCache.get(cacheKey);
  if (!sprite) {
    sprite = createTightlyCroppedWordSprite(text, roundedFontSize, color);
    wordSpriteCache.set(cacheKey, sprite);
  }
  const drawWidth = Math.min(sprite.width, maxWidth);
  context.drawImage(
    sprite.canvas,
    centerX - drawWidth / 2,
    centerY - sprite.height / 2,
    drawWidth,
    sprite.height
  );
}

function createTightlyCroppedWordSprite(text, fontSize, color) {
  const renderScale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
  const font = `700 ${fontSize}px 'Mali', 'Leelawadee UI', sans-serif`;
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");
  measureContext.font = font;
  const measuredWidth = Math.max(fontSize, measureContext.measureText(text).width);
  const padding = fontSize * 1.2;
  const source = document.createElement("canvas");
  source.width = Math.ceil((measuredWidth + padding * 2) * renderScale);
  source.height = Math.ceil(fontSize * 2.6 * renderScale);
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  sourceContext.scale(renderScale, renderScale);
  sourceContext.font = font;
  sourceContext.fillStyle = color;
  sourceContext.textAlign = "left";
  sourceContext.textBaseline = "alphabetic";
  sourceContext.direction = "ltr";
  sourceContext.fillText(text, padding, fontSize * 1.7);

  const pixels = sourceContext.getImageData(0, 0, source.width, source.height);
  let minX = source.width;
  let minY = source.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (pixels.data[(y * source.width + x) * 4 + 3] < 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    return { canvas: source, width: measuredWidth, height: fontSize };
  }
  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const cropped = document.createElement("canvas");
  cropped.width = cropWidth;
  cropped.height = cropHeight;
  cropped.getContext("2d").drawImage(source, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return {
    canvas: cropped,
    width: cropWidth / renderScale,
    height: cropHeight / renderScale
  };
}

function drawContainedCharacter(image, size, bobOffset) {
  const maxWidth = size * 1.08;
  const maxHeight = size * 1.02;
  const aspectRatio = image.naturalWidth / image.naturalHeight;
  let width = maxWidth;
  let height = width / aspectRatio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  ctx.drawImage(image, -width / 2, -size * 0.04 - height + bobOffset, width, height);
}


function checkHits() {
  if (!state.pointer.active || !state.catchRequested) return;
  state.catchRequested = false;
  const catchX = state.pointer.source === "finger" && state.thumb.active
    ? (state.pointer.x + state.thumb.x) * 0.5
    : state.pointer.x;
  const catchY = state.pointer.source === "finger" && state.thumb.active
    ? (state.pointer.y + state.thumb.y) * 0.5
    : state.pointer.y;
  let closestHit = null;
  for (let index = 0; index < state.creatures.length; index += 1) {
    const creature = state.creatures[index];
    const cy = creature.y + Math.sin(creature.life * 5 + creature.phase) * creature.wobble;
    // Cover the full cloud platform so a pinch on the word or character still catches it.
    const radius = creature.size * 0.78;
    const distance = Math.hypot(catchX - creature.x, catchY - cy);
    if (distance <= radius && (!closestHit || distance < closestHit.distance)) {
      closestHit = { creature, distance, index };
    }
  }
  if (!closestHit) return;
  state.creatures.splice(closestHit.index, 1);
  handleCatch(closestHit.creature);
}

function handleCatch(creature) {
  const y = creature.y + Math.sin(creature.life * 5 + creature.phase) * creature.wobble;
  if (creature.correct) {
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    const multiplier = state.combo >= 7 ? 3 : state.combo >= 4 ? 2 : 1;
    const goldenReward = creature.golden ? 50 : 0;
    state.score += 10 * multiplier + goldenReward;
    state.coins += multiplier + (creature.golden ? 5 : 0);
    state.correct += 1;
    state.correctInLevel += 1;
    state.caughtWords.add(creature.word);
    burst(creature.x, y, "#ffe55f", "#90f071", "star");
    showFeedback(creature.golden ? `เยี่ยม! ${creature.word} เมฆทอง +50 คะแนน` : `ถูกต้อง! ${creature.word} ไม่มีตัวสะกด`, "#ffffff");
    if (creature.golden) playAsset(els.bigBonusSound, 0.95);
    if (state.combo === 4) {
      showCombo(`โบนัสใหญ่! x${multiplier}`, true);
      megaBurst(creature.x, y);
      screenFireworks();
      playAsset(els.bigBonusSound, 0.9);
    } else if (state.combo > 4) {
      showCombo(`โบนัสกำลังทำงาน! x${multiplier}`);
      megaBurst(creature.x, y, 36);
    } else if (state.combo >= 3) {
      showCombo(`Combo x${state.combo}! คะแนน x${multiplier}`);
    }
    if (state.combo === 8 || state.combo === 12) {
      if (state.correctInLevel >= 6) state.pendingGoldenCreature = true;
      else spawnGoldenCreature(els.stage.getBoundingClientRect());
      megaBurst(creature.x, y, 48);
      showCombo("เมฆทองปรากฏ!", true);
    }
    playCorrect();
    window.setTimeout(() => speakWord(creature.word), 100);
    if (state.correctInLevel >= 6) advanceLevel();
  } else {
    state.combo = 0;
    state.hearts -= 1;
    state.wrong += 1;
    burst(creature.x, y, "#e85568", "#9b6cff");
    flashRed();
    showFeedback(`ผิด! ${creature.word} มี ${creature.word.at(-1)} เป็นตัวสะกด`, "#ffffff");
    showCombo("");
    const playWrongSequence = (onFinished) => {
      playWrong(() => speakWord(creature.word, () => playWrongFeedback(onFinished)));
    };
    if (state.hearts <= 0) {
      state.lossFeedbackPending = true;
      playWrongSequence(() => {
        state.lossFeedbackPending = false;
        if (state.running && state.hearts <= 0) endGame();
      });
    } else {
      playWrongSequence();
    }
  }
}

function burst(x, y, colorA, colorB, shape = "circle") {
  for (let i = 0; i < 18; i += 1) {
    const angle = (Math.PI * 2 * i) / 18;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * (80 + Math.random() * 120),
      vy: Math.sin(angle) * (80 + Math.random() * 120),
      r: 4 + Math.random() * 7,
      color: i % 2 ? colorA : colorB,
      shape,
      life: 0.72
    });
  }
}

function pinchSporeBurst(x, y) {
  const colors = ["#fff4a3", "#ff9ec4", "#7ee7ff", "#a7f47b"];
  for (let index = 0; index < 9; index += 1) {
    const angle = Math.PI * 2 * index / 9;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * (45 + Math.random() * 55),
      vy: Math.sin(angle) * (45 + Math.random() * 55),
      r: 3 + Math.random() * 4,
      color: colors[index % colors.length],
      shape: index % 3 === 0 ? "star" : "circle",
      life: 0.48
    });
  }
}

function megaBurst(x, y, particleCount = 72) {
  particleCount = Math.min(particleCount, 48);
  const colors = ["#ffe55f", "#ff6f91", "#70e0ff", "#9cf06c", "#c787ff", "#ffffff"];
  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 115 + Math.random() * 300;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 80,
      r: 4 + Math.random() * 8,
      color: colors[index % colors.length],
      shape: "circle",
      life: 0.9 + Math.random() * 0.5
    });
  }
}

function screenFireworks() {
  const rect = els.stage.getBoundingClientRect();
  const bursts = [
    [0.18, 0.23],
    [0.51, 0.18],
    [0.82, 0.28],
    [0.32, 0.58],
    [0.7, 0.62]
  ];
  bursts.forEach(([x, y]) => megaBurst(rect.width * x, rect.height * y, 30));
}


function updateParticles(delta) {
  state.particles = state.particles.filter((particle) => {
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += (particle.gravity ?? 120) * delta;
    return particle.life > 0;
  });
  const particleLimit = isAndroid || isIOS ? 140 : 240;
  if (state.particles.length > particleLimit) {
    state.particles.splice(0, state.particles.length - particleLimit);
  }
}

function drawCloudTrails() {
  ctx.save();
  for (const particle of state.particles) {
    if (particle.behind) drawParticle(particle);
  }
  ctx.restore();
}

function drawParticles() {
  ctx.save();
  for (const particle of state.particles) {
    if (!particle.behind) drawParticle(particle);
  }
  ctx.restore();
}

function drawParticle(particle) {
  ctx.globalAlpha = Math.max(0, particle.life / (particle.maxLife || 0.72));
  ctx.fillStyle = particle.color;
  if (particle.shape === "star") {
    drawStar(ctx, particle.x, particle.y, particle.r);
  } else {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStar(context, x, y, radius) {
  context.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const angle = -Math.PI / 2 + point * (Math.PI / 5);
    const length = point % 2 === 0 ? radius : radius * 0.44;
    const px = x + Math.cos(angle) * length;
    const py = y + Math.sin(angle) * length;
    if (point === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
}

function drawPointer() {
  if (!state.pointer.active || state.mode === "menu") {
    els.cursor.hidden = true;
    els.thumbCursor.hidden = true;
    els.pinchBeam.hidden = true;
    return;
  }
  els.cursor.hidden = false;
  els.cursor.classList.toggle("is-pinching", state.pinchDown && state.pointer.source === "finger");
  els.cursor.style.transform = `translate(${state.pointer.x}px, ${state.pointer.y}px)`;
  els.thumbCursor.hidden = !state.thumb.active;
  els.thumbCursor.classList.toggle("is-pinching", state.pinchDown);
  els.thumbCursor.style.transform = `translate(${state.thumb.x}px, ${state.thumb.y}px)`;
  const showBeam = state.pointer.source === "finger" && state.thumb.active;
  els.pinchBeam.hidden = !showBeam;
  if (showBeam) {
    const dx = state.thumb.x - state.pointer.x;
    const dy = state.thumb.y - state.pointer.y;
    els.pinchBeam.classList.toggle("is-pinching", state.pinchDown);
    els.pinchBeam.style.width = `${Math.hypot(dx, dy)}px`;
    els.pinchBeam.style.transform = `translate(${state.pointer.x}px, ${state.pointer.y}px) rotate(${Math.atan2(dy, dx)}rad)`;
  }
}

function updateHud() {
  els.score.textContent = state.score;
  els.timer.textContent = Math.ceil(state.timeLeft);
  els.level.textContent = `${state.level}/4`;
  els.coins.textContent = state.coins;
  els.hearts.textContent = Array.from({ length: 3 }, (_, index) => (index < state.hearts ? "♥" : "♡")).join(" ");
  const target = state.combo < 8 ? 8 : 12;
  const progress = Math.min(100, (state.combo / target) * 100);
  els.comboMeter.style.width = `${progress}%`;
  const comboTrack = els.comboMeter.parentElement;
  comboTrack.classList.toggle("is-active", progress > 0 && progress < 100);
  comboTrack.classList.toggle("is-full", progress >= 100);
  comboTrack.setAttribute("aria-valuenow", String(Math.round(progress)));
}

function advanceLevel() {
  if (state.level === 4) {
    state.correctInLevel = 0;
    if (state.pendingGoldenCreature) {
      spawnGoldenCreature(els.stage.getBoundingClientRect());
      state.pendingGoldenCreature = false;
    }
    if (!state.finalLevelAnnounced) {
      state.finalLevelAnnounced = true;
      showCombo("ด่านสุดท้าย! เก็บคะแนนต่อจนหมดเวลา");
      showFeedback("ด่าน 4 เล่นต่อได้จนกว่าเวลาจะหมด", "#ffffff");
      playStart();
    }
    return;
  }
  const fromLevel = state.level;
  state.level += 1;
  state.sceneTransition = { fromLevel, startedAt: performance.now() };
  state.correctInLevel = 0;
  state.creatures = [];
  state.pendingSceneSpawn = true;
  state.lastSpawn = performance.now();
  showCombo(`ผ่านด่าน ${state.level - 1}!`);
  showFeedback(`ด่าน ${state.level}: ฉากใหม่ คำหลอกมากขึ้น แต่ยังจับเฉพาะแม่ ก กา`, "#ffffff");
  playStart();
}

function endGame(completed = false) {
  stopSpokenWord();
  state.running = false;
  state.paused = false;
  state.resuming = false;
  els.resumeBtn.disabled = false;
  els.pauseBtn.hidden = true;
  els.cameraTestControls.hidden = true;
  els.pauseOverlay.hidden = true;
  stopBackgroundMusic();
  stopMenuMusic();
  els.finalCountdownSound.pause();
  els.finalCountdownSound.currentTime = 0;
  state.mode = "result";
  state.pointer.active = false;
  state.thumb.active = false;
  state.pinchDown = false;
  els.canvas.hidden = true;
  els.arFrame.hidden = true;
  stopCameraStream();
  els.hud.hidden = true;
  showCombo("");
  showFeedback("");
  const total = state.correct + state.wrong;
  const accuracy = total ? Math.round((state.correct / total) * 100) : 0;
  els.learnedWords.textContent = [...state.caughtWords].join("  ") || "ยังไม่มีคำที่เก็บได้";
  els.resultTitle.textContent = completed ? "พิชิตแม่ ก กา ครบ 4 ด่าน!" : "จบรอบแล้ว!";
  showScreen(els.result);
  animateResultNumbers({ accuracy });
  window.setTimeout(() => els.replayBtn.focus({ preventScroll: true }), 760);
  playAsset(state.hearts <= 0 ? els.loseSound : els.endSound, 0.8);
}

function animateResultNumbers({ accuracy }) {
  const animationId = ++resultCountAnimationId;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const entranceDelay = reducedMotion ? 320 : 820;
  const durationScale = reducedMotion ? 0.72 : 1;
  const counters = [
    { element: els.finalScore, value: state.score, suffix: "", delay: entranceDelay, duration: 1600 * durationScale },
    { element: els.accuracy, value: accuracy, suffix: "%", delay: entranceDelay + 170, duration: 1450 * durationScale },
    { element: els.correctCount, value: state.correct, suffix: "", delay: entranceDelay + 340, duration: 1200 * durationScale },
    { element: els.wrongCount, value: state.wrong, suffix: "", delay: entranceDelay + 510, duration: 1200 * durationScale },
    { element: els.maxCombo, value: state.maxCombo, suffix: "", delay: entranceDelay + 680, duration: 1200 * durationScale },
    { element: els.finalCoins, value: state.coins, suffix: "", delay: entranceDelay + 850, duration: 1200 * durationScale }
  ];

  for (const counter of counters) {
    counter.element.textContent = `0${counter.suffix}`;
    counter.element.classList.toggle("is-counting", !reducedMotion && counter.value > 0);
  }

  const startedAt = performance.now();
  const update = (now) => {
    if (animationId !== resultCountAnimationId || state.mode !== "result") return;
    let finished = true;
    for (const counter of counters) {
      const progress = Math.max(0, Math.min(1, (now - startedAt - counter.delay) / counter.duration));
      const eased = counter.value <= 10 ? progress : 1 - Math.pow(1 - progress, 3);
      const value = Math.round(counter.value * eased);
      counter.element.textContent = `${value}${counter.suffix}`;
      if (progress < 1) finished = false;
      else counter.element.classList.remove("is-counting");
    }
    if (!finished) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function showScreen(screen) {
  hideScreens();
  if (screen !== els.result) resultCountAnimationId += 1;
  if (screen !== els.menu) deactivateMenuVideo();
  screen.classList.add("is-active");
}

function hideScreens() {
  [els.loading, els.menu, els.info, els.time, els.result].forEach((screen) => screen.classList.remove("is-active"));
}

function showFeedback(text, color = "#ffffff", duration = 1200) {
  els.feedback.textContent = text;
  els.feedback.style.color = color;
  if (!text) return;
  window.clearTimeout(showFeedback.timeout);
  showFeedback.timeout = window.setTimeout(() => {
    els.feedback.textContent = "";
  }, duration);
}

function showCombo(text) {
  els.comboPop.textContent = text;
  els.comboPop.classList.toggle("is-bonus", text.startsWith("โบนัสใหญ่"));
  if (text.startsWith("โบนัสใหญ่")) {
    void els.comboPop.offsetWidth;
    els.comboPop.classList.add("is-bonus");
  }
}

function flashRed() {
  els.redFlash.classList.remove("is-time-warning");
  els.redFlash.classList.remove("is-active");
  els.stage.classList.remove("is-shaking");
  void els.redFlash.offsetWidth;
  els.redFlash.classList.add("is-active");
  els.stage.classList.add("is-shaking");
  window.setTimeout(() => els.stage.classList.remove("is-shaking"), 380);
}

function flashTimeWarning() {
  els.redFlash.classList.remove("is-active", "is-time-warning");
  void els.redFlash.offsetWidth;
  els.redFlash.classList.add("is-time-warning");
}

function audioContext() {
  if (!state.sound) return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  state.audio ||= new AudioContextClass();
  return state.audio;
}

function tone(freq, start, duration, type = "sine", gain = 0.06) {
  const audio = audioContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  amp.gain.setValueAtTime(0, audio.currentTime + start);
  amp.gain.linearRampToValueAtTime(gain, audio.currentTime + start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.02);
}

function playStart() {
  [523, 659, 784, 1046].forEach((freq, i) => tone(freq, i * 0.07, 0.16, "triangle", 0.055));
}

function playFinalCountdownWarning() {
  const seconds = Math.ceil(state.timeLeft);
  if (seconds !== 5 || seconds === state.lastTimerWarning) return;
  state.lastTimerWarning = seconds;
  playAsset(els.finalCountdownSound, 0.95);
  flashTimeWarning();
}

function playCorrect() {
  playAsset(els.bonusSound, 0.82);
  tone(880, 0, 0.12, "triangle", 0.085);
  tone(1320, 0.08, 0.16, "sine", 0.065);
}


function playWrong(onFinished) {
  const audio = els.wrongAnswerSound;
  playAsset(audio, 0.8);
  if (onFinished) window.setTimeout(onFinished, 100);
}

function playWrongFeedback(onFinished) {
  const audio = wrongFeedbackAudio[Math.floor(Math.random() * wrongFeedbackAudio.length)];
  playAsset(audio, 0.8);
  if (!onFinished) return;
  const url = audioAssetUrl(audio);
  const bufferedDuration = url ? state.audioBuffers.get(url)?.duration : 0;
  const duration = bufferedDuration || (Number.isFinite(audio.duration) ? audio.duration : 2.8);
  window.setTimeout(onFinished, Math.max(900, duration * 1000 + 80));
}

function playButton() {
  tone(620, 0, 0.08, "triangle", 0.05);
}

function stopSpokenWord(completePending = false) {
  const pendingFinish = completePending ? state.spokenWordFinish : null;
  state.spokenWordFinish = null;
  window.clearTimeout(state.spokenWordTimer);
  state.spokenWordTimer = null;
  state.spokenWordToken += 1;
  if (state.spokenWordSource) {
    state.spokenWordSource.onended = null;
    try { state.spokenWordSource.stop(); } catch {}
    state.spokenWordSource = null;
  }
  if (state.spokenWordElement) {
    state.spokenWordElement.onended = null;
    state.spokenWordElement.pause();
    state.spokenWordElement.currentTime = 0;
    state.spokenWordElement = null;
  }
  pendingFinish?.();
}

function speakWord(word, onFinished) {
  stopSpokenWord(true);
  if (!state.wordVoice || !state.sound) {
    onFinished?.();
    return;
  }
  const audio = wordAudio.get(word);
  if (!audio) {
    onFinished?.();
    return;
  }

  const token = state.spokenWordToken;
  const finish = () => {
    if (token !== state.spokenWordToken) return;
    window.clearTimeout(state.spokenWordTimer);
    state.spokenWordTimer = null;
    state.spokenWordSource = null;
    state.spokenWordElement = null;
    state.spokenWordFinish = null;
    onFinished?.();
  };
  state.spokenWordFinish = onFinished || null;
  const context = audioContext();
  const url = audioAssetUrl(audio);
  const buffer = url ? state.audioBuffers.get(url) : null;
  const duration = buffer?.duration || (Number.isFinite(audio.duration) ? audio.duration : 1.8);
  state.spokenWordTimer = window.setTimeout(finish, Math.max(650, duration * 1000 + 180));
  if (context && context.state === "running" && buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 1;
    source.connect(gain).connect(context.destination);
    source.onended = finish;
    state.spokenWordSource = source;
    source.start();
    document.documentElement.dataset.lastAudioAsset = url;
    document.documentElement.dataset.lastAudioAt = String(Date.now());
    return;
  }

  if (url) void preloadAudioAsset(audio);
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
  audio.onended = finish;
  state.spokenWordElement = audio;
  audio.play()
    .then(() => {
      document.documentElement.dataset.lastAudioAsset = url;
      document.documentElement.dataset.lastAudioAt = String(Date.now());
    })
    .catch(finish);
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}
