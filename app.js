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
  startBtn: document.querySelector("#startBtn"),
  howBtn: document.querySelector("#howBtn"),
  cameraBtn: document.querySelector("#cameraBtn"),
  soundBtn: document.querySelector("#soundBtn"),
  fullscreenBtn: document.querySelector("#fullscreenBtn"),
  settingBtn: document.querySelector("#settingBtn"),
  closeTimeBtn: document.querySelector("#closeTimeBtn"),
  timeOptions: document.querySelectorAll("[data-duration]"),
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
  comboMeterLabel: document.querySelector("#comboMeterLabel"),
  timer: document.querySelector("#timer"),
  level: document.querySelector("#level"),
  coins: document.querySelector("#coins"),
  hearts: document.querySelector("#hearts"),
  comboPop: document.querySelector("#comboPop"),
  feedback: document.querySelector("#feedback"),
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
const startsMuted = new URLSearchParams(window.location.search).get("sound") === "off";
document.body.classList.toggle("is-ios-device", isIOS);
if (els.openChromeBtn) els.openChromeBtn.hidden = !(isAndroid || isIOS);
const menuImage = new Image();
const cloudSheet = new Image();
let cloudCanvas = null;
const sceneImages = [
  "assets/พื้นหลัง(1).png",
  "assets/พื้นหลัง (2).png",
  "assets/พื้นหลัง (3).png",
  "assets/พื้นหลัง (4).png"
].map((source) => {
  const image = new Image();
  image.src = source;
  return image;
});
menuImage.src = "assets/mushroom-menu.png";
const characterImages = Array.from({ length: 20 }, (_, index) => {
  const image = new Image();
  image.src = `assets/characters/mushroom_character_${String(index + 1).padStart(2, "0")}.png`;
  return image;
});
const wordCloudImage = new Image();
wordCloudImage.src = "assets/game-word-cloud.png";
const wordCloudImages = [wordCloudImage];
cloudSheet.addEventListener("load", () => {
  cloudCanvas = cloudSheet;
});
cloudSheet.src = "assets/pack-white-clouds-clean.png";

const cloudTiles = [
  [370, 80, 305, 140],
  [705, 68, 275, 170],
  [18, 278, 325, 205],
  [398, 295, 250, 175],
  [708, 302, 270, 165],
  [58, 522, 245, 175],
  [380, 522, 285, 180]
];

const correctWords = [
  ["กา", 0, 0], ["ตา", 1, 0], ["มา", 2, 0], ["ดู", 3, 0], ["ไป", 4, 0], ["ใจ", 5, 0],
  ["มือ", 0, 1], ["เสือ", 1, 1], ["เรือ", 2, 1], ["ปลา", 3, 1], ["หมู", 4, 1], ["หมา", 5, 1],
  ["สี", 0, 2], ["ดี", 1, 2], ["มี", 2, 2], ["นา", 3, 2], ["อา", 4, 2], ["เอา", 5, 2],
  ["ใบ", 0, 3], ["ไฟ", 1, 3], ["ขา", 2, 3], ["ปู", 3, 3], ["งู", 4, 3], ["วัว", 5, 3],
  ["หัว", 0, 4], ["ยา", 1, 4], ["รู", 2, 4], ["หู", 3, 4]
].map(([word, col, row]) => ({ word, col, row, correct: true }));
const wordAudio = new Map(correctWords.map((item, index) => {
  const audio = new Audio(`assets/words/word-${String(index + 1).padStart(2, "0")}.mp3`);
  audio.preload = "auto";
  return [item.word, audio];
}));
const wordSpriteCache = new Map();
document.fonts?.ready.then(() => wordSpriteCache.clear());

const wrongWords = [
  ["กบ", 4, 4], ["นก", 5, 4], ["มด", 0, 5], ["รถ", 1, 5], ["ดิน", 2, 5], ["บ้าน", 3, 5],
  ["จาน", 4, 5], ["ขวด", 5, 5], ["ลูก", 0, 6], ["เมฆ", 1, 6], ["ดาว", 2, 6], ["ฝน", 3, 6],
  ["ผัก", 4, 6], ["ปาก", 5, 6], ["เลข", 0, 7], ["หอม", 1, 7], ["ข้าว", 2, 7],
  ["กางเกง", 3, 7], ["ดอก", 4, 7], ["ต้น", 5, 7], ["ลิง", 1, 8], ["แมว", 2, 8],
  ["คน", 3, 8], ["ช้อน", 4, 8]
].map(([word, col, row]) => ({ word, col, row, correct: false }));

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
  creatures: [],
  particles: [],
  pointer: { x: 0, y: 0, active: false, source: "mouse" },
  thumb: { x: 0, y: 0, active: false },
  catchRequested: false,
  pinchDown: false,
  pinchDistance: Infinity,
  sound: !startsMuted,
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
  lastRenderAt: 0,
  renderInterval: 1000 / 30,
  stageRect: null,
  inactiveCanvasCleared: false,
  handTrackingPromise: null,
  pseudoFullscreen: false,
  audio: null,
  audioBuffers: new Map(),
  audioBufferLoads: new Map(),
  effectAudioReady: null
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
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
els.settingBtn.addEventListener("click", openTimeSettings);
els.closeTimeBtn.addEventListener("click", showMenu);
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
    waitForImage(cloudSheet),
    waitForImage(wordCloudImage),
    ...sceneImages.map(waitForImage),
    ...characterImages.map(waitForImage),
    preloadImage("assets/loading/loading-background.webp"),
    preloadImage("assets/loading/loading-progress-frame.webp"),
    preloadImage("assets/menu/menu-dancers-poster.webp"),
    preloadImage("assets/menu/start-game-button.png"),
    preloadImage("assets/menu/camera-test-button.png"),
    preloadImage("assets/menu/setting-button.png"),
    preloadImage("assets/menu/guide-button.png")
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
  stopMenuMusic();
  deactivateMenuVideo();
  state.mode = "preparing";
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
  state.running = false;
  state.paused = false;
  state.resuming = false;
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
    els.bgMusic.pause();
    els.menuMusic.pause();
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
  els.bgMusic.pause();
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
}

function suspendForBackground() {
  if (state.running && !state.paused) pauseGame();
  els.menuMusic.pause();
  els.bgMusic.pause();
  stopCameraStream();
}

function startBackgroundMusic() {
  if (!state.sound) return;
  els.menuMusic.pause();
  els.bgMusic.volume = 0.14;
  els.bgMusic.play().catch(() => {
    // Browsers require a player gesture before background audio can begin.
  });
}

function startMenuMusic() {
  if (!state.sound || state.mode !== "menu") return;
  els.menuMusic.volume = 0.68;
  els.menuMusic.muted = false;
  els.menuMusic.play().catch(() => {});
}

function unlockMenuMusic() {
  if (state.mode !== "menu" || !state.sound) return;
  startMenuMusic();
}

function stopBackgroundMusic() {
  els.bgMusic.pause();
  els.bgMusic.currentTime = 0;
}

function stopMenuMusic() {
  els.menuMusic.pause();
  els.menuMusic.currentTime = 0;
}

function playAsset(audio, volume = 0.45) {
  if (!state.sound) return;
  const context = audioContext();
  const url = audioAssetUrl(audio);
  const buffer = url ? state.audioBuffers.get(url) : null;
  if (context && context.state === "running" && buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(context.destination);
    source.start();
    return;
  }
  if (url) void preloadAudioAsset(audio);
  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch(() => {});
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
  const context = audioContext();
  if (context) {
    context.resume?.().catch(() => {});
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.start(0);
  }
  void prepareEffectAudio();
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
      const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18");
      const resolver = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
      );
      const delegates = forcedDelegate ? [forcedDelegate] : isAndroid ? ["CPU", "GPU"] : ["GPU", "CPU"];
      let lastError = null;
      for (const delegate of delegates) {
        try {
          state.handLandmarker = await vision.HandLandmarker.createFromOptions(resolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
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
  if (state.mode === "playing") drawCloudLayer(rect, now);
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
    if (state.timeLeft <= 0 || state.hearts <= 0) endGame();
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
  const overlayAlpha = state.cameraReady ? 0.42 : 1;
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

  ctx.fillStyle = state.level === 2 ? "rgba(29, 12, 70, 0.28)" : state.level === 3 ? "rgba(0, 78, 111, 0.16)" : state.level === 4 ? "rgba(255, 174, 72, 0.12)" : "rgba(24, 71, 32, 0.1)";
  ctx.fillRect(0, 0, rect.width, rect.height);
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

function drawCloudLayer(rect, now) {
  if (!cloudCanvas) return;
  const sceneOpacity = state.cameraReady ? 0.24 : 0.56;
  const sceneScale = state.level === 2 ? 0.95 : state.level === 3 ? 0.82 : 1;
  const viewportScale = Math.max(0.44, Math.min(1, rect.width / 960, rect.height / 540));
  ctx.save();
  ctx.globalAlpha = sceneOpacity;
  for (let index = 0; index < 4; index += 1) {
    const [sx, sy, sw, sh] = cloudTiles[(state.level + index * 2) % cloudTiles.length];
    const width = (150 + index * 48) * sceneScale * viewportScale;
    const height = width * (sh / sw);
    const speed = 0.008 + index * 0.002;
    const x = ((now * speed + index * 290) % (rect.width + width * 2)) - width;
    const y = rect.height * 0.14 + ((index * 127 * viewportScale + state.level * 41) % Math.max(rect.height * 0.3, rect.height * 0.46));
    ctx.drawImage(cloudCanvas, sx, sy, sw, sh, x, y, width, height);
  }
  ctx.restore();
}

function drawAmbient(rect, now) {
  ctx.save();
  ctx.globalAlpha = state.cameraReady ? 0.3 : 0.55;
  const ambientCount = isAndroid || isIOS ? 10 : 18;
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
  const creature = {
    ...item,
    id: crypto.randomUUID(),
    x: startInPlayfield ? rect.width * (0.1 + Math.random() * 0.8) : side === 1 ? rect.width + size : side === 3 ? -size : Math.random() * rect.width,
    y: startInPlayfield ? rect.height * (0.28 + Math.random() * 0.56) : side === 2 ? rect.height + size : side === 0 ? -size : rect.height * (0.2 + Math.random() * 0.68),
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
  const creature = {
    ...item,
    id: crypto.randomUUID(),
    golden: true,
    x: rect.width * (0.32 + Math.random() * 0.36),
    y: rect.height * (0.34 + Math.random() * 0.24),
    vx: (Math.random() - 0.5) * 44 * viewportScale,
    vy: (Math.random() - 0.5) * 24 * viewportScale,
    size,
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
  state.creatures = state.creatures.filter((creature) => {
    creature.life += delta;
    creature.x += creature.vx * delta;
    creature.y += creature.vy * delta + Math.sin(creature.life * 4 + creature.phase) * 0.85;
    if (creature.life - creature.lastTrail > (creature.golden ? 0.07 : 0.11)) {
      emitCloudTrail(creature);
      creature.lastTrail = creature.life;
    }
    const pad = creature.size * 1.4;
    return creature.x > -pad && creature.x < rect.width + pad && creature.y > -pad && creature.y < rect.height + pad;
  });
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
  for (let i = state.creatures.length - 1; i >= 0; i -= 1) {
    const creature = state.creatures[i];
    const cy = creature.y + Math.sin(creature.life * 5 + creature.phase) * creature.wobble;
    // Cover the full cloud platform so a pinch on the word or character still catches it.
    const radius = creature.size * 0.78;
    const distance = Math.hypot(state.pointer.x - creature.x, state.pointer.y - cy);
    if (distance <= radius) {
      state.creatures.splice(i, 1);
      handleCatch(creature);
      break;
    }
  }
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
    speakWord(creature.word);
    if (state.correctInLevel >= 6) advanceLevel();
  } else {
    state.combo = 0;
    state.hearts -= 1;
    state.wrong += 1;
    burst(creature.x, y, "#e85568", "#9b6cff");
    flashRed();
    showFeedback(`ผิด! ${creature.word} มี ${creature.word.at(-1)} เป็นตัวสะกด`, "#ffffff");
    showCombo("");
    playWrong();
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
    return;
  }
  els.cursor.hidden = false;
  els.cursor.classList.toggle("is-pinching", state.pinchDown && state.pointer.source === "finger");
  els.cursor.style.transform = `translate(${state.pointer.x}px, ${state.pointer.y}px)`;
  els.thumbCursor.hidden = !state.thumb.active;
  els.thumbCursor.classList.toggle("is-pinching", state.pinchDown);
  els.thumbCursor.style.transform = `translate(${state.thumb.x}px, ${state.thumb.y}px)`;
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
  els.comboMeterLabel.textContent = state.combo >= 12 ? "พลังเมฆทองเต็ม!" : `พลังเมฆทอง ${Math.min(state.combo, target)}/${target}`;
}

function advanceLevel() {
  if (state.level === 4) {
    state.correctInLevel = 0;
    if (state.pendingGoldenCreature) {
      spawnGoldenCreature(els.stage.getBoundingClientRect());
      state.pendingGoldenCreature = false;
    }
    showCombo("ด่านสุดท้าย! เก็บคะแนนต่อจนหมดเวลา");
    showFeedback("ด่าน 4 เล่นต่อได้จนกว่าเวลาจะหมด", "#ffffff");
    playStart();
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
  els.finalScore.textContent = state.score;
  els.accuracy.textContent = `${accuracy}%`;
  els.correctCount.textContent = state.correct;
  els.wrongCount.textContent = state.wrong;
  els.maxCombo.textContent = state.maxCombo;
  els.finalCoins.textContent = state.coins;
  els.learnedWords.textContent = [...state.caughtWords].join("  ") || "ยังไม่มีคำที่เก็บได้";
  els.resultTitle.textContent = completed ? "พิชิตแม่ ก กา ครบ 4 ด่าน!" : "จบรอบแล้ว!";
  showScreen(els.result);
  window.setTimeout(() => els.replayBtn.focus({ preventScroll: true }), 760);
  playAsset(els.endSound, 0.78);
}

function showScreen(screen) {
  hideScreens();
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


function playWrong() {
  playAsset(els.wrongAnswerSound, 1);
  tone(250, 0, 0.16, "sawtooth", 0.055);
  tone(175, 0.08, 0.22, "triangle", 0.05);
}

function playButton() {
  tone(620, 0, 0.08, "triangle", 0.05);
}

function speakWord(word) {
  const audio = wordAudio.get(word);
  if (audio) playAsset(audio, 0.92);
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
