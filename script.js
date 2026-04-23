/* =========================================
   SCRIPT.JS - GENTA-CODA (PERBAIKAN FINAL)
   ========================================= */

// --- 1. DATA VIDEO (LOKAL .mp4) ---
const videoData = [
    {
        title: "Belajar Sikap",
        id: "cerita.mp4.mp4", // Pastikan nama file ini persis ada di folder
        question: "Apa yang dilakukan Kakak tadi saat melihat ayah kesusahan?"
    },
    {
        title: "Sikap Buruk",
        id: "cerita..mp4", // Perhatikan titik dua nya, harus sama dengan nama file
        question: "Perilaku apa yang harus dilakukan saat melihat teman membuang sampah sembarangan?"
    },
    {
        title: "Sikap baik",
        id: "cerita.5.mp4", // Perhatikan titik dua nya, harus sama dengan nama file
        question: "Perilaku apa yang harus kita tiru pada kakak?"
    },
    {
        title: "Sikap tak terpuji",
        id: "cerita.6.mp4", // Perhatikan titik dua nya, harus sama dengan nama file
        question: "Perilaku apa yang harus kita lakukan?"
    },
    
    
];

// --- 2. DATA GAME ---
const gameData = [
    { 
        correct: "buku", 
        img: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png",
        audio: "suara-buku.mp3" 
    },
    { 
        correct: "meja", 
        img: "https://cdn-icons-png.flaticon.com/512/2413/2413158.png",
        audio: "suara-meja.mp3" 
    }
];

// --- 3. VARIABEL KONTROL ---
let currentVideoIndex = 0;
let currentIndex = 0;
let currentAudio = new Audio();

// --- 4. SISTEM NAVIGASI HALAMAN ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    const activePage = document.getElementById('page-' + pageId);
    if (activePage) activePage.style.display = 'block';

    if (pageId === 'home') {
        document.body.classList.add('home-background');
    } else {
        document.body.classList.remove('home-background');
    }

    if (pageId === 'video') loadVideo();
    if (pageId === 'game') loadLevel();
}

// --- 5. LOGIKA HALAMAN VIDEO (PERBAIKAN UTAMA) ---
function loadVideo() {
    const video = videoData[currentVideoIndex];
    const container = document.getElementById('video-container');
    
    // Update Judul & Pertanyaan
    document.getElementById('video-title').innerText = "📺 " + video.title;
    document.getElementById('video-question').innerText = video.question;

    // Karena pakai file LOKAL (.mp4), kita gunakan tag <video>, bukan <iframe>
    container.innerHTML = `
        <div class="video-box-wrapper" style="background:#000; border-radius:15px; overflow:hidden;">
            <video id="main-video" width="100%" controls key="${video.id}">
                <source src="${video.id}" type="video/mp4">
                Browser kamu tidak mendukung pemutar video.
            </video>
        </div>
    `;

    // Atur tombol navigasi video
    document.getElementById('btn-prev-video').style.visibility = (currentVideoIndex === 0) ? "hidden" : "visible";
    document.getElementById('btn-next-video').innerText = (currentVideoIndex === videoData.length - 1) ? "Selesai Nonton ✨" : "Video Selanjutnya ➡️";
}

function nextVideo() {
    if (currentVideoIndex < videoData.length - 1) {
        currentVideoIndex++;
        loadVideo();
    } else {
        showPage('game');
    }
}

function prevVideo() {
    if (currentVideoIndex > 0) { // Perbaikan: Harus lebih besar dari 0
        currentVideoIndex--;
        loadVideo();
    }
}

// --- 6. LOGIKA HALAMAN GAME ---
function playVoice(fileName) {
    currentAudio.pause();
    currentAudio = new Audio(fileName);
    currentAudio.play().catch(e => console.log("Audio belum ada:", e));
}

function repeatInstruction() {
    playVoice(gameData[currentIndex].audio);
}

function loadLevel() {
    if (currentIndex < gameData.length) {
        const item = gameData[currentIndex];
        document.getElementById('main-img').src = item.img;
        document.getElementById('feedback').innerText = "";
        document.getElementById('status').innerText = "Siap mendengarkan...";
        document.getElementById('btn-next').style.display = "none";
        document.getElementById('btn-mic').disabled = false;
        
        setTimeout(() => playVoice(item.audio), 800);
    } else {
        document.getElementById('main-img').src = "https://cdn-icons-png.flaticon.com/512/2271/2271062.png";
        document.getElementById('game-instruction').innerText = "LUAR BIASA!";
        document.getElementById('feedback').innerHTML = "<span class='success'>Kamu hebat! Semua tantangan selesai.</span>";
        document.getElementById('btn-mic').style.display = "none";
    }
}

function nextLevel() {
    currentIndex++;
    loadLevel();
}

// --- 7. SISTEM MIC ---
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Rec) {
    const recognition = new Rec();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    const micBtn = document.getElementById('btn-mic');

    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add('recording');
        document.getElementById('status').innerText = "Mendengarkan... 👂";
    };

    recognition.onresult = (e) => {
        let speech = e.results[0][0].transcript.toLowerCase();
        document.getElementById('status').innerText = `Kamu bilang: "${speech}"`;
        
        const target = gameData[currentIndex].correct.toLowerCase();

        if (speech.includes(target)) {
            document.getElementById('feedback').innerHTML = "<span class='success' style='color: green; font-weight: bold;'>🎉 BENAR! 🌟</span>";
            micBtn.classList.remove('recording');
            micBtn.disabled = true;
            document.getElementById('btn-next').style.display = "inline-block";
        } else {
            document.getElementById('feedback').innerHTML = "<span style='color: red;'>Coba lagi ya! 😊</span>";
        }
    };

    recognition.onend = () => {
        micBtn.classList.remove('recording');
    };
}

window.onload = () => {
    showPage('home');
};