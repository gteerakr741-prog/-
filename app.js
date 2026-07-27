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
  menuDanceCanvas: document.querySelector("#menuDanceCanvas"),
  hud: document.querySelector("#hud"),
  menu: document.querySelector("#menuScreen"),
  info: document.querySelector("#infoScreen"),
  time: document.querySelector("#timeScreen"),
  result: document.querySelector("#resultScreen"),
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
  highScore: document.querySelector("#highScore"),
  learnedWords: document.querySelector("#learnedWords"),
  resultTitle: document.querySelector("#resultTitle")
};

const ctx = els.canvas.getContext("2d");
const menuDanceCtx = els.menuDanceCanvas.getContext("2d");
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
const danceSheets = Array.from({ length: 8 }, (_, index) => {
  const image = new Image();
  image.src = `assets/menu/dance/dance_character_${String(index + 1).padStart(2, "0")}_normalized.png`;
  return image;
});
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

const wrongWords = [
  ["กบ", 4, 4], ["นก", 5, 4], ["มด", 0, 5], ["รถ", 1, 5], ["ดิน", 2, 5], ["บ้าน", 3, 5],
  ["จาน", 4, 5], ["ขวด", 5, 5], ["ลูก", 0, 6], ["เมฆ", 1, 6], ["ดาว", 2, 6], ["ฝน", 3, 6],
  ["ผัก", 4, 6], ["ปาก", 5, 6], ["เลข", 0, 7], ["หอม", 1, 7], ["ข้าว", 2, 7],
  ["กางเกง", 3, 7], ["ดอก", 4, 7], ["ต้น", 5, 7], ["ลิง", 1, 8], ["แมว", 2, 8],
  ["คน", 3, 8], ["ช้อน", 4, 8]
].map(([word, col, row]) => ({ word, col, row, correct: false }));

const state = {
  mode: "menu",
  running: false,
  paused: false,
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
  sound: true,
  cameraReady: false,
  handReady: false,
  handLandmarker: null,
  lastVideoTime: -1,
  lastHandDetectionAt: 0,
  handDetectionInterval: 50,
  audio: null
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", updatePointer);
window.addEventListener("pointerdown", requestPointerCatch);
window.addEventListener("touchstart", updateTouch, { passive: true });
window.addEventListener("touchmove", updateTouch, { passive: true });
window.addEventListener("pointerdown", unlockMenuMusic, true);
window.addEventListener("touchstart", unlockMenuMusic, { capture: true, passive: true });
window.addEventListener("click", unlockMenuMusic, true);
window.addEventListener("keydown", unlockMenuMusic, true);

els.startBtn.addEventListener("click", startGame);
els.replayBtn.addEventListener("click", startGame);
els.homeBtn.addEventListener("click", showMenu);
els.howBtn.addEventListener("click", () => showScreen(els.info));
els.closeInfoBtn.addEventListener("click", () => showScreen(els.menu));
els.cameraBtn.addEventListener("click", testCamera);
els.soundBtn?.addEventListener("click", toggleSound);
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
els.settingBtn.addEventListener("click", openTimeSettings);
els.closeTimeBtn.addEventListener("click", () => showScreen(els.menu));
els.timeOptions.forEach((button) => button.addEventListener("click", () => {
  state.roundDuration = Number(button.dataset.duration);
  updateTimeOptions();
  showScreen(els.menu);
}));
els.pauseBtn.addEventListener("pointerdown", togglePauseFromMouse);
els.pauseBtn.addEventListener("click", (event) => event.preventDefault());
els.cameraBackBtn.addEventListener("click", showMenu);
els.cameraStartBtn.addEventListener("click", startGame);
els.resumeBtn.addEventListener("click", resumeGame);
els.pauseMenuBtn.addEventListener("click", showMenu);

requestAnimationFrame(loop);
els.menuMusic.load();
updateSoundButton();
updateFullscreenButton();
startMenuMusic();

function resizeCanvas() {
  const rect = els.stage.getBoundingClientRect();
  const nativeDpr = window.devicePixelRatio || 1;
  const pixelBudget = 1920 * 1080;
  const budgetDpr = Math.sqrt(pixelBudget / Math.max(1, rect.width * rect.height));
  const dpr = Math.max(1, Math.min(nativeDpr, 1.25, budgetDpr));
  els.canvas.width = Math.round(rect.width * dpr);
  els.canvas.height = Math.round(rect.height * dpr);
  els.canvas.style.width = `${rect.width}px`;
  els.canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  els.menuDanceCanvas.width = Math.round(rect.width * dpr);
  els.menuDanceCanvas.height = Math.round(rect.height * dpr);
  menuDanceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawMenuDancers(now, rect) {
  menuDanceCtx.clearRect(0, 0, rect.width, rect.height);
  const frame = Math.floor(now / 300) % 8;
  const positions = [0.085, 0.22, 0.335, 0.45, 0.565, 0.68, 0.79, 0.905];
  const heightRatios = [0.347, 0.444, 0.316, 0.331, 0.379, 0.333, 0.342, 0.291];
  const baseline = rect.height * 0.805;
  danceSheets.forEach((sheet, index) => {
    if (!sheet.complete || !sheet.naturalWidth) return;
    const frameWidth = sheet.naturalWidth / 4;
    const frameHeight = sheet.naturalHeight / 2;
    const sourceX = (frame % 4) * frameWidth;
    const sourceY = Math.floor(frame / 4) * frameHeight;
    const height = rect.height * heightRatios[index];
    const width = height;
    const x = rect.width * positions[index] - width / 2;
    const y = baseline - height;
    menuDanceCtx.drawImage(sheet, sourceX, sourceY, frameWidth, frameHeight, x, y, width, height);
  });
}

async function startGame() {
  hideScreens();
  els.hud.hidden = false;
  state.mode = "playing";
  state.running = true;
  state.paused = false;
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
  await ensureCamera();
}

function showMenu() {
  state.running = false;
  state.paused = false;
  els.pauseBtn.hidden = true;
  els.cameraTestControls.hidden = true;
  els.pauseOverlay.hidden = true;
  stopBackgroundMusic();
  state.mode = "menu";
  els.hud.hidden = true;
  state.creatures = [];
  state.particles = [];
  showScreen(els.menu);
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
    if (document.fullscreenElement) await document.exitFullscreen();
    else await els.stage.requestFullscreen();
  } catch {
    // The browser may reserve fullscreen for its own toolbar or settings.
  }
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement);
  const label = isFullscreen ? "ออกจากเต็มหน้าจอ" : "เต็มหน้าจอ";
  els.fullscreenBtn.textContent = isFullscreen ? "×" : "⛶";
  els.fullscreenBtn.setAttribute("aria-label", label);
  els.fullscreenBtn.title = label;
  window.requestAnimationFrame(resizeCanvas);
}

function togglePauseFromMouse(event) {
  if (event.pointerType !== "mouse" || !state.running) return;
  event.preventDefault();
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

function resumeGame() {
  if (!state.paused) return;
  state.paused = false;
  state.lastTick = performance.now();
  els.pauseOverlay.hidden = true;
  startBackgroundMusic();
}

function startBackgroundMusic() {
  if (!state.sound) return;
  els.menuMusic.pause();
  els.bgMusic.volume = 0.22;
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
  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch(() => {});
}

async function ensureCamera() {
  if (state.cameraReady) return true;
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
    els.camera.srcObject = stream;
    await els.camera.play();
    els.camera.classList.add("is-live");
    state.cameraReady = true;
    loadHandTracking();
    return true;
  } catch {
    state.cameraReady = false;
    showFeedback("เปิดกล้องไม่ได้ ใช้เมาส์หรือแตะหน้าจอแทน", "#ffffff");
    return false;
  }
}

async function loadHandTracking() {
  if (state.handLandmarker || state.handReady) return;
  try {
    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18");
    const resolver = await vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
    );
    state.handLandmarker = await vision.HandLandmarker.createFromOptions(resolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.55,
      minTrackingConfidence: 0.5
    });
    state.handReady = true;
    showFeedback("ตรวจจับนิ้วพร้อมแล้ว", "#ffffff");
  } catch {
    state.handReady = false;
    showFeedback("ตรวจนิ้วไม่พร้อม ใช้เมาส์/ทัชแทนได้", "#ffffff");
  }
}

function loop(now) {
  const rect = els.stage.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  if (state.mode === "playing") drawSceneBackdrop(rect);
  else if (!state.cameraReady || state.mode === "menu") drawMenuBackdrop(rect);
  if (state.mode === "playing") drawCloudLayer(rect, now);
  if (state.mode === "menu") {
    try {
      drawMenuDancers(now, rect);
    } catch {
      menuDanceCtx.clearRect(0, 0, rect.width, rect.height);
    }
  } else menuDanceCtx.clearRect(0, 0, rect.width, rect.height);
  drawAmbient(rect, now);

  const needsHandTracking = state.mode === "playing" || state.mode === "camera" || state.mode === "result";
  if (needsHandTracking && state.cameraReady && state.handReady && state.handLandmarker) {
    try {
      updateHandPointer(now, rect);
    } catch {
      state.handReady = false;
      state.pinchDown = false;
      state.thumb.active = false;
      showFeedback("ตรวจจับนิ้วขัดข้อง ใช้เมาส์/แตะหน้าจอเล่นต่อได้", "#ffffff");
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

  drawCloudTrails();
  drawCreatures();
  drawParticles();
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
  ctx.save();
  ctx.globalAlpha = sceneOpacity;
  for (let index = 0; index < 4; index += 1) {
    const [sx, sy, sw, sh] = cloudTiles[(state.level + index * 2) % cloudTiles.length];
    const width = (150 + index * 48) * sceneScale;
    const height = width * (sh / sw);
    const speed = 0.008 + index * 0.002;
    const x = ((now * speed + index * 290) % (rect.width + width * 2)) - width;
    const y = 96 + ((index * 127 + state.level * 41) % Math.max(140, rect.height * 0.46));
    ctx.drawImage(cloudCanvas, sx, sy, sw, sh, x, y, width, height);
  }
  ctx.restore();
}

function drawAmbient(rect, now) {
  ctx.save();
  ctx.globalAlpha = state.cameraReady ? 0.3 : 0.55;
  for (let i = 0; i < 18; i += 1) {
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
    els.replayBtn.classList.remove("is-pointed");
    els.homeBtn.classList.remove("is-pointed");
    return;
  }
  state.pointer.x = (1 - tip.x) * rect.width;
  state.pointer.y = tip.y * rect.height;
  state.pointer.active = true;
  state.pointer.source = "finger";
  state.thumb.x = (1 - thumb.x) * rect.width;
  state.thumb.y = thumb.y * rect.height;
  state.thumb.active = true;
  state.pinchDistance = Math.hypot(tip.x - thumb.x, tip.y - thumb.y);
  updateResultActionFocus();

  // Use two thresholds so one pinch produces one catch, even when the hand shakes.
  const pinchStarts = state.pinchDistance < 0.058;
  const pinchReleases = state.pinchDistance > 0.09;
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

function updateResultActionFocus() {
  if (state.mode !== "result" || state.pointer.source !== "finger") return;
  const stageRect = els.stage.getBoundingClientRect();
  const pointerX = stageRect.left + state.pointer.x;
  const pointerY = stageRect.top + state.pointer.y;
  for (const button of [els.replayBtn, els.homeBtn]) {
    const rect = button.getBoundingClientRect();
    const isPointed = pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom;
    button.classList.toggle("is-pointed", isPointed);
  }
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
  if (state.running) state.catchRequested = true;
  else if (state.mode === "result" && state.pointer.source === "finger") {
    [els.replayBtn, els.homeBtn].find((button) => button.classList.contains("is-pointed"))?.click();
  }
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
  const size = Math.max(118, Math.min(rect.width, rect.height) * (0.16 + Math.random() * 0.045));
  const speed = 62 + Math.random() * 72 + state.level * 24 + (60 - state.timeLeft) * 1.3;
  const creature = {
    ...item,
    id: crypto.randomUUID(),
    x: startInPlayfield ? 120 + Math.random() * Math.max(1, rect.width - 240) : side === 1 ? rect.width + size : side === 3 ? -size : Math.random() * rect.width,
    y: startInPlayfield ? 145 + Math.random() * Math.max(1, rect.height - 290) : side === 2 ? rect.height + size : side === 0 ? -size : 92 + Math.random() * (rect.height - 210),
    vx: 0,
    vy: 0,
    size,
    speed,
    phase: Math.random() * Math.PI * 2,
    wobble: 16 + Math.random() * 26,
    characterIndex: Math.floor(Math.random() * characterImages.length),
    cloudIndex: Math.floor(Math.random() * wordCloudImages.length),
    lastTrail: 0,
    life: 0
  };
  const targetX = 80 + Math.random() * (rect.width - 160);
  const targetY = 120 + Math.random() * (rect.height - 240);
  const angle = Math.atan2(targetY - creature.y, targetX - creature.x);
  creature.vx = Math.cos(angle) * speed;
  creature.vy = Math.sin(angle) * speed;
  state.creatures.push(creature);
}

function spawnGoldenCreature(rect) {
  const item = correctWords[Math.floor(Math.random() * correctWords.length)];
  const size = Math.max(146, Math.min(rect.width, rect.height) * 0.23);
  const creature = {
    ...item,
    id: crypto.randomUUID(),
    golden: true,
    x: rect.width * (0.32 + Math.random() * 0.36),
    y: rect.height * (0.34 + Math.random() * 0.24),
    vx: (Math.random() - 0.5) * 44,
    vy: (Math.random() - 0.5) * 24,
    size,
    phase: Math.random() * Math.PI * 2,
    wobble: 20,
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
    ctx.drawImage(cloud, -cloudWidth / 2, -size * 0.08, cloudWidth, cloudHeight);
    ctx.filter = "none";
    ctx.restore();
  }
  if (character.complete && character.naturalWidth) {
    drawContainedCharacter(character, size, characterBob);
  }

  ctx.fillStyle = creature.golden ? "#754000" : "#16120f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.max(27, size * 0.28)}px 'Mali', 'Leelawadee UI', sans-serif`;
  ctx.fillText(creature.word, 0, size * 0.34, size * 1.12);
  ctx.restore();
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
    if (creature.golden) playAsset(els.bigBonusSound, 0.68);
    if (state.combo === 4) {
      showCombo(`โบนัสใหญ่! x${multiplier}`, true);
      megaBurst(creature.x, y);
      screenFireworks();
      playAsset(els.bigBonusSound, 0.58);
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
  if (state.particles.length > 240) {
    state.particles.splice(0, state.particles.length - 240);
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
  els.pauseBtn.hidden = true;
  els.cameraTestControls.hidden = true;
  els.pauseOverlay.hidden = true;
  stopBackgroundMusic();
  stopMenuMusic();
  els.finalCountdownSound.pause();
  els.finalCountdownSound.currentTime = 0;
  state.mode = "result";
  els.hud.hidden = true;
  showCombo("");
  showFeedback("");
  const total = state.correct + state.wrong;
  const accuracy = total ? Math.round((state.correct / total) * 100) : 0;
  const oldHigh = Number.parseInt(localStorage.getItem("mushroomHighScore") || "0", 10);
  const high = Math.max(oldHigh, state.score);
  localStorage.setItem("mushroomHighScore", String(high));
  els.finalScore.textContent = state.score;
  els.accuracy.textContent = `${accuracy}%`;
  els.correctCount.textContent = state.correct;
  els.wrongCount.textContent = state.wrong;
  els.maxCombo.textContent = state.maxCombo;
  els.highScore.textContent = high;
  els.learnedWords.textContent = [...state.caughtWords].join("  ") || "ยังไม่มีคำที่เก็บได้";
  els.resultTitle.textContent = completed ? "พิชิตแม่ ก กา ครบ 4 ด่าน!" : "จบรอบแล้ว!";
  showScreen(els.result);
  playAsset(els.endSound, 0.5);
}

function showScreen(screen) {
  hideScreens();
  screen.classList.add("is-active");
}

function hideScreens() {
  [els.menu, els.info, els.time, els.result].forEach((screen) => screen.classList.remove("is-active"));
}

function showFeedback(text, color = "#ffffff") {
  els.feedback.textContent = text;
  els.feedback.style.color = color;
  if (!text) return;
  window.clearTimeout(showFeedback.timeout);
  showFeedback.timeout = window.setTimeout(() => {
    els.feedback.textContent = "";
  }, 1200);
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
  state.audio ||= new AudioContext();
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
  playAsset(els.finalCountdownSound, 0.7);
  flashTimeWarning();
}

function playCorrect() {
  playAsset(els.bonusSound, 0.42);
  tone(880, 0, 0.12, "triangle", 0.06);
  tone(1320, 0.08, 0.16, "sine", 0.045);
}


function playWrong() {
  playAsset(els.wrongAnswerSound, 1);
  tone(250, 0, 0.16, "sawtooth", 0.055);
  tone(175, 0.08, 0.22, "triangle", 0.05);
}

function playButton() {
  tone(620, 0, 0.08, "triangle", 0.035);
}

function speakWord(word) {
  if (!state.sound || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "th-TH";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
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
