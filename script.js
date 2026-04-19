// script.js

// 1. LOGIKA NAVIGASI HALAMAN
function showPage(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Tampilkan halaman yang dipilih
    const activePage = document.getElementById('page-' + pageId);
    activePage.style.display = 'block';

    // Jika masuk ke game, load game
    if (pageId === 'game') {
        loadLevel();
    }
}

// EDIT DI SINI: Tambahkan link audio rekamanmu
const gameData = [
    { 
        correct: "buku", 
        img: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png",
        audio: "suara-buku.mp3" // Nama file rekamanmu
    },
    { 
        correct: "meja", 
        img: "https://cdn-icons-png.flaticon.com/512/2413/2413158.png",
        audio: "suara-meja.mp3" 
    }
];
let currentIndex = 0;
const imgEl = document.getElementById('main-img');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('btn-next');
const micBtn = document.getElementById('btn-mic');
const statusEl = document.getElementById('status');

// Fungsi Suara (Text-to-Speech)
function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'id-ID';
    msg.pitch = 1.3;
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
}

// Munculkan Level
function loadLevel() {
    if (currentIndex < gameData.length) {
        const item = gameData[currentIndex];
        imgEl.src = item.img;
        feedbackEl.innerText = "";
        nextBtn.style.display = "none";
        statusEl.innerText = "Siap mendengarkan...";
        micBtn.disabled = false;
        
        // Suara instruksi otomatis saat gambar muncul
        setTimeout(() => speak(item.voice), 800);
    } else {
        // Jika sudah habis
        imgEl.src = "https://img.freepik.com/free-vector/party-popper-with-confetti-cartoon-icon-illustration-birthday-celebration-icon-concept-isolated-flat-cartoon-style_138676-2165.jpg";
        document.getElementById('game-instruction').innerText = "HORE! KAMU JUARA!";
        feedbackEl.innerHTML = "<span class='success'>Semua tantangan selesai!</span>";
        speak("Hore! Kamu hebat sekali!");
        micBtn.style.display = "none";
    }
}

// Ulangi suara jika tombol speaker diklik
function repeatInstruction() {
    speak(gameData[currentIndex].voice);
}

// Pindah ke soal berikutnya
function nextLevel() {
    currentIndex++;
    loadLevel();
}

// LOGIKA MIKROFON (Speech Recognition)
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Rec) {
    const recognition = new Rec();
    recognition.lang = 'id-ID';
    recognition.interimResults = true; // Supaya cepat menangkap suara

    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add('recording');
        statusEl.innerText = "Mendengarkan... 👂";
    };

    recognition.onresult = (e) => {
        let speech = e.results[e.results.length - 1][0].transcript.toLowerCase();
        statusEl.innerText = `Kamu bilang: "${speech}"`;
        
        const target = gameData[currentIndex].correct.toLowerCase();

        if (speech.includes(target)) {
            feedbackEl.innerHTML = "<span class='success'>🎉 BENAR! 🌟</span>";
            speak("Hebat! Benar!");
            recognition.stop();
            micBtn.classList.remove('recording');
            micBtn.disabled = true;
            nextBtn.style.display = "inline-block";
        }
    };

    recognition.onend = () => {
        micBtn.classList.remove('recording');
        if (nextBtn.style.display === "none") {
            statusEl.innerText = "Coba klik mic lagi dan bicara.";
        }
    };
}