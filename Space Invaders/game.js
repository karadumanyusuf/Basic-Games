const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const levelDisplay = document.getElementById('level');
const popup = document.getElementById('popup');
const popupScore = document.getElementById('popupScore');
const tryAgainBtn = document.getElementById('tryAgainBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shipImg = new Image();
shipImg.src = 'spaceship.png'; // Uzay gemisi PNG yolunu buraya ekleyin

const enemyImg = new Image();
enemyImg.src = 'horse.png'; // Düşman PNG yolunu buraya ekleyin

const boxImg = new Image();
boxImg.src = 'chance_box.png'; // Şans kutusu PNG yolunu buraya ekleyin

class Ship {
    constructor() {
        this.width = 70;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
        this.dx = 0;
    }

    draw() {
        ctx.drawImage(shipImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    move(direction) {
        this.dx = direction * this.speed;
    }

    stop() {
        this.dx = 0;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.speed = speed;
        this.dx = this.speed;
        this.hp = 1;
    }

    draw() {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.dx *= -1;
            this.y += this.height;
        }
    }
}

class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.hp = 1;
    }

    draw() {
        ctx.drawImage(boxImg, this.x, this.y, this.width, this.height);
    }

    update() {
        // Şans kutusu sabit kalır, hareket etmez
    }
}

const ship = new Ship();
let bullets = [];
let enemies = [];
let boxes = [];
let score = 0;
let level = 1;
let enemySpeed = 20;
let maxBullets = 7;
let reloadTime = 500; // 1 saniye
let lastFireTime = 0;
let bulletMultiplier = 1;
let gameOver = false;

function createEnemies() {
    enemies = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            enemies.push(new Enemy(100 + i * 80, 50 + j * 40, enemySpeed));
        }
    }
}

function createBox() {
    boxes = [];
    boxes.push(new Box(canvas.width / 2 - 25, canvas.height / 2 - 25));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.draw();
    bullets.forEach(bullet => bullet.draw());
    enemies.forEach(enemy => enemy.draw());
    boxes.forEach(box => box.draw());
}

function update() {
    ship.update();
    bullets.forEach((bullet, index) => {
        bullet.update();
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        if (enemy.y + enemy.height >= canvas.height) {
            gameOver = true;
            popup.style.display = 'block';
            popupScore.innerText = `Skor: ${score}`;
        }
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1);
                    enemy.hp--;
                    if (enemy.hp <= 0) {
                        enemies.splice(enemyIndex, 1);
                        score += 10;
                        hud.innerText = `Skor: ${score}`;
                        if (enemies.length === 0) {
                            level++;
                            enemySpeed += 0.5;
                            levelDisplay.innerText = `Seviye: ${level}`;
                            if (level % 5 === 0) {
                                createBox();
                            } else {
                                createEnemies();
                            }
                        }
                    }
                }, 0);
            }
        });
    });

    boxes.forEach((box, boxIndex) => {
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < box.x + box.width &&
                bullet.x + bullet.width > box.x &&
                bullet.y < box.y + box.height &&
                bullet.y + bullet.height > box.y
            ) {
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1);
                    box.hp--;
                    if (box.hp <= 0) {
                        boxes.splice(boxIndex, 1);
                        applyPowerUp();
                        createEnemies();
                    }
                }, 0);
            }
        });
    });
}

function applyPowerUp() {
    if (level === 5) {
        bulletMultiplier = 2;
    } else if (level === 10) {
        reloadTime = 500; // Ateş etme hızını arttır
    } else if (level === 15) {
        bulletMultiplier = 3;
    } else if (level === 20) {
        reloadTime = 250; // Ateş etme hızını tekrar arttır
    }
}

function shoot() {
    let currentTime = new Date().getTime();
    if (currentTime - lastFireTime >= reloadTime && bullets.length < maxBullets) {
        for (let i = 0; i < bulletMultiplier; i++) {
            bullets.push(new Bullet(ship.x + ship.width / 2 - 2.5, ship.y - i * 10));
        }
        lastFireTime = currentTime;
    }
}

function loop() {
    if (!gameOver) {
        draw();
        update();
        requestAnimationFrame(loop);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        ship.move(-1);
    } else if (e.key === 'ArrowRight') {
        ship.move(1);
    } else if (e.key === ' ') {
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        ship.stop();
    }
});

tryAgainBtn.addEventListener('click', () => {
    gameOver = false;
    popup.style.display = 'none';
    score = 0;
    level = 1;
    enemySpeed = 2;
    maxBullets = 7;
    reloadTime = 1000; // 1 saniye
    lastFireTime = 0;
    bulletMultiplier = 1;
    hud.innerText = `Skor: ${score}`;
    levelDisplay.innerText = `Seviye: ${level}`;
    createEnemies();
    loop();
});

createEnemies();
loop();
