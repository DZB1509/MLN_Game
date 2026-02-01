const svg = document.getElementById("puzzle");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const resultEl = document.getElementById("result");
const tickSound = document.getElementById("tick-sound"); 
const nohuSound = document.getElementById("nohu-sound");
const correctSound = document.getElementById("correct-sound");
const fireworksSound = document.getElementById("fireworks-sound");

let currentIndex = null;
let timerInterval = null;
let timeLeft = 6;

// Hàm chuẩn hóa (bỏ dấu)
function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim();
}

const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

// Âm thanh
const beepSound = document.getElementById("beep-sound");
const failSound = document.getElementById("fail-sound");

const questions = [
  { shuffled: "n / g / ô / n / s / o / n", word: "Non sông", a: "non sông", explain: "Không gian gắn liền với sự tồn tại và lịch sử của cộng đồng" },
  { shuffled: "n / ư / t / ấ / c / đ / ớ", word: "Đất nước", a: "đất nước", explain: "Thực thể chung nơi con người cùng sinh sống và phát triển" },
  { shuffled: "ư / n / g / h / ê / q / u / ơ", word: "Quê hương", a: "quê hương", explain: "Điểm tựa cảm xúc hình thành tình cảm sâu bền" },
  { shuffled: "ư / n / g / c / ơ / n / ê / b / i", word: "Biên cương", a: "biên cương", explain: "Ranh giới cần được gìn giữ để bảo vệ sự toàn vẹn" },
  { shuffled: "h / ự / o / t / à", word: "Tự hào", a: "tự hào", explain: "Trạng thái tinh thần khi ý thức về giá trị chung" },
  { shuffled: "ó / n / g / b / ắ", word: "Gắn bó", a: "gắn bó", explain: "Mối liên hệ bền chặt giữa con người và nơi mình thuộc về" },
  { shuffled: "c / h / i / m / r / á / n / t / ệ / h", word: "Trách nhiệm", a: "trách nhiệm", explain: "Ý thức hành động xuất phát từ sự hiểu và sự yêu" },
  { shuffled: "c / ử / l / ị / s / h", word: "Lịch sử", a: "lịch sử", explain: "Chuỗi trải nghiệm được tích lũy qua nhiều thế hệ" },
  { shuffled: "t / h / ề / t / r / u / y / n / g / ố / n", word: "Truyền thống", a: "truyền thống", explain: "Những giá trị được duy trì và tiếp nối" },
  { shuffled: "c / ắ / n / b / ả / s", word: "Bản sắc", a: "bản sắc", explain: "Dấu ấn riêng tạo nên sự khác biệt của một cộng đồng" }
];

// Modal
const explainModal = document.getElementById("explain-modal");
const explainText = document.getElementById("explain-text");
const countdownModal = document.getElementById("countdown-modal");
const timerDisplay = document.getElementById("timer-display");
const wrongModal = document.getElementById("wrong-modal");
const nohuModal = document.getElementById("nohu-modal");
const giamaModal = document.getElementById("giai-ma-modal");
const hangmanWord = document.getElementById("hangman-word");
const guessInput = document.getElementById("guess-letter");
const hangmanError = document.getElementById("hangman-error");
const wrongLettersList = document.getElementById("wrong-list");

// Pháo hoa canvas
const fireworksCanvas = document.getElementById("fireworks-canvas");
const ctx = fireworksCanvas.getContext("2d");
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Hangman state
const secretWord = "VUNGTRƠITÔQUÔC"; // 14 chữ
let revealed = Array(secretWord.length).fill('_');
let guessedLetters = new Set();
let wrongLetters = new Set();  // Chỉ lưu chữ sai

function closeModal() {
  explainModal.classList.add("hidden");
  explainModal.style.display = "none";
  correctSound.pause();          // Dừng phát ngay lập tức
  correctSound.currentTime = 0;
  if (openedCount === 10 && !fireworksStarted) {
    fireworksStarted = true;     // Đánh dấu đã bật
    startFireworks();            // Bật pháo hoa + nhạc + fade → Nổ hũ
  }
}

// 10 mảnh puzzle
const pieces = [
  "0,0 320,0 300,160 0,160",
  "320,0 600,0 600,160 300,160",
  "0,160 300,160 320,320 0,320",
  "300,160 600,160 600,320 320,320",
  "0,320 320,320 300,480 0,480",
  "320,320 600,320 600,480 300,480",
  "0,480 300,480 320,640 0,640",
  "300,480 600,480 600,640 320,640",
  "0,640 320,640 300,800 0,800",
  "320,640 600,640 600,800 300,800"
];

// Ảnh nền
const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
img.setAttribute("href", "image.jpg");
img.setAttribute("x", 0);
img.setAttribute("y", 0);
img.setAttribute("width", 600);
img.setAttribute("height", 800);
svg.appendChild(img);

// Vẽ mảnh che + số thứ tự + click
pieces.forEach((points, i) => {
  const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  poly.setAttribute("points", points);
  poly.classList.add("cover");
  poly.dataset.index = i;

  poly.addEventListener("click", () => {
    currentIndex = i;
    quizBox.classList.remove("hidden");
    questionEl.innerHTML = `${emojis[i]}<br><strong>Sắp xếp các chữ cái để tạo thành từ:</strong><br><big>${questions[i].shuffled}</big>`;
    answerEl.value = "";
    answerEl.focus();
    resultEl.textContent = "";

    // Bắt đầu countdown
    startCountdown();
  });

  svg.appendChild(poly);

  // Số thứ tự
  const [x, y] = points.split(" ")[0].split(",");
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", +x + 20);
  text.setAttribute("y", +y + 40);
  text.textContent = i + 1;
  svg.appendChild(text);
});

function startCountdown() {
  timeLeft = 6;
  timerDisplay.textContent = timeLeft;
  countdownModal.classList.remove("hidden");
  countdownModal.style.display = "flex";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // THÊM TIẾNG TICK MỖI GIÂY
    tickSound.currentTime = 0;  // Reset để tiếng không bị chồng
    tickSound.play();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownModal.classList.add("hidden");
      countdownModal.style.display = "none";
      beepSound.play();               // Tiếng còi hú khi hết giờ
      showWrong("Hết thời gian!");
    }
  }, 1000);
}

// Trả lời
function submitAnswer() {
  if (timerInterval) clearInterval(timerInterval);
  countdownModal.classList.add("hidden");

  const ans = answerEl.value.trim();
  const normalizedAns = normalize(ans);
  const correctNormalized = normalize(questions[currentIndex].a);

  if (normalizedAns === correctNormalized) {
    document.querySelector(`polygon[data-index="${currentIndex}"]`).classList.add("open");

    explainText.innerHTML = `${emojis[currentIndex]} <strong>${questions[currentIndex].word}</strong><br><br>→ ${questions[currentIndex].explain}`;
    explainModal.classList.remove("hidden");
    explainModal.style.display = "flex";

    resultEl.textContent = "✅ Đúng!";
    quizBox.classList.add("hidden");
    playCorrectSound();
    openedCount++;
  } else {
    showWrong("Sai rồi!");
  }
}

function showWrong(message) {
  wrongModal.querySelector("h2").textContent = message;
  wrongModal.classList.remove("hidden");
  wrongModal.style.display = "flex";
  failSound.play();
}

function closeWrongModal() {
  wrongModal.classList.add("hidden");
  wrongModal.style.display = "none";
}

function closeCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval);  // Dừng countdown ngay
    timerInterval = null;         // Reset biến
  }
  countdownModal.classList.add("hidden");
  countdownModal.style.display = "none";
  
  // Không play beep hay showWrong → cho nhập đáp án thoải mái
  answerEl.focus();  // Tự focus vào ô trả lời để nhập luôn
}

// Hoàn thành → pháo hoa
let openedCount = 0;
let fireworksStarted = false;

// function checkCompletion() {
//   openedCount++;
//   if (openedCount === 10) {
//     startFireworks();
//   }
// }

// Pháo hoa cải thiện: chạy hạn chế, tự dừng + fade out, rồi hiện Nổ hũ
function startFireworks() {
  fireworksCanvas.style.opacity = 1;
  playFireworksSound();
  let particles = [];
  let animationId = null;
  let startTime = Date.now();
  const duration = 12000;  // 12 giây pháo hoa (tùy chỉnh nếu muốn ngắn/dài hơn)

  function createParticle() {
    return {
      x: Math.random() * fireworksCanvas.width,
      y: fireworksCanvas.height,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * -12 - 8,  // Bay cao hơn, mạnh hơn
      color: `hsl(${Math.random()*360},100%,50%)`,
      radius: Math.random() * 3 + 2,  // To hơn chút
      life: 100  // Thêm life để particle mờ dần nhanh hơn
    };
  }

  function animate() {
    // Trail fade mượt hơn
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0,0,fireworksCanvas.width,fireworksCanvas.height);

    // Thêm particle ít hơn để tránh lag/che kín
    for (let i = 0; i < 6; i++) particles.push(createParticle());  // Giảm từ 10 xuống 6

    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;  // Gravity mạnh hơn
      p.life -= 1.5;  // Mờ dần nhanh

      if (p.life > 0) {
        ctx.globalAlpha = p.life / 100;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    // Kiểm tra thời gian
    if (Date.now() - startTime < duration) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Dừng hẳn + fade out canvas
      cancelAnimationFrame(animationId);
      let fadeOpacity = 1;
      const fadeInterval = setInterval(() => {
        fadeOpacity -= 0.05;
        fireworksCanvas.style.opacity = fadeOpacity;
        if (fadeOpacity <= 0) {
          clearInterval(fadeInterval);
          fireworksCanvas.style.opacity = 0;
          stopFireworksSound();
          particles = [];  // Clear bộ nhớ
        }
      }, 50);
    }
  }

  animate();
}

// Nổ hũ
document.getElementById("no-hu-btn").addEventListener("click", () => {
  nohuModal.classList.remove("hidden");
  nohuModal.style.display = "flex"; 
  playNoHuSound(); 
});

function closeNoHuModal() {
  nohuModal.classList.add("hidden");
  nohuModal.style.display = "none";
  nohuSound.pause();          // ← Dừng nhạc
  nohuSound.currentTime = 0;  // Reset
}
function showNoHuFromGiaiMa() {
  giamaModal.classList.add("hidden");
  giamaModal.style.display = "none";
  nohuModal.classList.remove("hidden");
  nohuModal.style.display = "flex";  // Đảm bảo hiện
  playNoHuSound();
}

function playNoHuSound() {
  nohuSound.currentTime = 0;  // Reset về đầu để play lại nếu đã phát trước
  nohuSound.play();           // Play ngay
}

function playCorrectSound() {
  correctSound.currentTime = 0;  // Reset về đầu để play lại nhiều lần
  correctSound.play();
}

function playFireworksSound() {
  fireworksSound.currentTime = 0;  // Reset về đầu
  fireworksSound.volume = 0.8;     // 80% volume (tùy chỉnh nếu to quá)
  fireworksSound.play();
}

function stopFireworksSound() {
  fireworksSound.pause();
  fireworksSound.currentTime = 0;  // Reset khi dừng
}

// Giải mã (Hangman)
document.getElementById("giai-ma-btn").addEventListener("click", startHangman);

function startHangman() {
  revealed = Array(secretWord.length).fill('_');
  guessedLetters.clear();
  wrongLetters.clear();
  updateHangmanDisplay();
  wrongLettersList.textContent = "";
  giamaModal.classList.remove("hidden");
  giamaModal.style.display = "flex";
  guessInput.value = "";
  guessInput.focus();
}

function updateHangmanDisplay() {
  hangmanWord.textContent = revealed.join(' ');
}

function guessLetter() {
  const letter = guessInput.value.toUpperCase();
  if (!letter || guessedLetters.has(letter)) {
    guessInput.value = "";
    return;
  }

  guessedLetters.add(letter);
  let correct = false;
  let count = 0;

  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i].toUpperCase() === letter) {
      revealed[i] = secretWord[i];
      count++;
      correct = true;
    }
  }

  updateHangmanDisplay();
  guessInput.value = "";
  guessInput.focus();

  if (!correct) {
    wrongLetters.add(letter);  // ← Lưu chữ sai
    wrongLettersList.textContent = Array.from(wrongLetters).join("  ");  // ← Hiển thị cách nhau 2 space cho đẹp
    
    hangmanError.textContent = "Không có chữ này!";
    failSound.play();
    setTimeout(() => {
      hangmanError.textContent = "";
    }, 2000);
  } else if (revealed.join('') === secretWord) {
    setTimeout(() => {
      giamaModal.classList.add("hidden");
      giamaModal.style.display = "none";
      nohuModal.classList.remove("hidden");
      nohuModal.style.display = "flex";
      playNoHuSound();
    }, 500);
  }
}

// ==== INTRO LOGIC ====
document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("intro-screen");
  const mainLayout = document.getElementById("main-layout");
  const introVideo = document.getElementById("intro-video");
  const unmuteButton = document.getElementById("unmute-button");
  const skipButton = document.getElementById("skip-button");

  // ẨN TẤT CẢ MODAL CHẮC CHẮN KHI MỚI LOAD
  const modals = [
    explainModal,
    countdownModal,
    wrongModal,          // <--- THÊM DÒNG NÀY ĐỂ ẨN WRONG-MODAL
    nohuModal,
    giamaModal
  ];

  modals.forEach(modal => {
    if (modal) {
      modal.classList.add("hidden");
      modal.style.display = "none";   // Ẩn bằng style để chắc chắn hơn class
    }
  });

  function startGame() {
    introScreen.style.display = "none";
    mainLayout.classList.remove("hidden");
    mainLayout.style.display = "flex";
    introVideo.pause();
    introVideo.currentTime = 0;
  }

  skipButton.addEventListener("click", startGame);

  unmuteButton.addEventListener("click", () => {
    introVideo.muted = false;
    introVideo.play();
    unmuteButton.textContent = "🔊 Nice";
    unmuteButton.disabled = true;
  });

  introVideo.addEventListener("ended", startGame);
});