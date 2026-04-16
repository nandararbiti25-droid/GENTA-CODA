const bankKata = [
    { k: "SANTUN", a: "Halus dan baik budi bahasanya" },
    { k: "LITERASI", a: "Kemampuan membaca dan menulis" },
    { k: "EMPATI", a: "Peduli perasaan orang lain" },
    { k: "MANDIRI", a: "Bisa melakukan sendiri" },
    { k: "JUJUR", a: "Tidak berbohong" },
    { k: "ADAB", a: "Kesantunan dan perilaku baik" },
    { k: "GIGIH", a: "Pantang menyerah" },
    { k: "AMANAH", a: "Dapat dipercaya" },
    { k: "CERDAS", a: "Mudah memahami sesuatu" },
    { k: "HARMONIS", a: "Serasi dan rukun" }
    // Tambahkan terus di sini...
];

let score = 0; let level = 1; let currentWord = {};

function playSound(id) {
    const s = document.getElementById(id);
    s.currentTime = 0; s.play();
}

function initGame() {
    currentWord = bankKata[Math.floor(Math.random() * bankKata.length)];
    document.getElementById('word-target').innerText = currentWord.k;

    let choices = [currentWord.a];
    while(choices.length < 4) {
        let r = bankKata[Math.floor(Math.random() * bankKata.length)].a;
        if(!choices.includes(r)) choices.push(r);
    }
    choices.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    choices.forEach(t => {
        const b = document.createElement('button');
        b.innerText = t; b.className = "btn-game";
        b.onclick = () => check(t);
        grid.appendChild(b);
    });
}

function check(val) {
    if(val === currentWord.a) {
        score += 10; playSound('sound-correct');
        if(score % 50 === 0) level++;
    } else {
        playSound('sound-wrong');
        alert("Salah! Artinya: " + currentWord.a);
    }
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    initGame();
}

window.onload = initGame;