document.addEventListener("DOMContentLoaded", () => {
    const pageData = {
        admin: {
            active: "admin",
            kicker: "ruang kontrol",
            titleTop: "Admin",
            titleBottom: "Belum Tersedia",
            description: "Panel admin masih dalam proses pengembangan. Fitur kontrol, data, dan pengelolaan konten akan dibuka setelah sistem siap digunakan.",
            primaryText: "Kembali ke Beranda",
            primaryHref: "index.html",
            secondaryText: "Lihat Karya",
            secondaryHref: "karya.html",
            statusTitle: "Panel sedang dibangun",
            statusBadge: "development"
        },
        blog: {
            active: "blog",
            kicker: "ruang tulisan",
            titleTop: "Blog",
            titleBottom: "Belum Terisi",
            description: "Halaman blog masih disiapkan. Catatan belajar, cerita pengembangan, dan dokumentasi proses akan hadir setelah kontennya selesai dirapikan.",
            primaryText: "Kembali ke Beranda",
            primaryHref: "index.html",
            secondaryText: "Lihat Karya",
            secondaryHref: "karya.html",
            statusTitle: "Konten sedang disusun",
            statusBadge: "drafting"
        },
        karya: {
            active: "karya",
            kicker: "ruang portofolio",
            titleTop: "Karya",
            titleBottom: "Sedang Disusun",
            description: "Portofolio karya sedang dikurasi. Project terbaik akan ditampilkan dengan penjelasan fitur, stack, proses, dan hasil pengembangannya.",
            primaryText: "Kembali ke Beranda",
            primaryHref: "index.html",
            secondaryText: "Hubungi Saya",
            secondaryHref: "kontak.html",
            statusTitle: "Project sedang dikurasi",
            statusBadge: "curation"
        },
        messages: {
            active: "messages",
            kicker: "ruang pesan",
            titleTop: "Messages",
            titleBottom: "Belum Tersedia",
            description: "Kotak pesan masih kosong atau belum diaktifkan. Fitur komunikasi akan digunakan untuk menampilkan pesan, masukan, dan kontak masuk.",
            primaryText: "Kembali ke Beranda",
            primaryHref: "index.html",
            secondaryText: "Kontak Saya",
            secondaryHref: "kontak.html",
            statusTitle: "Pesan belum aktif",
            statusBadge: "empty"
        },
        tentang: {
            active: "tentang",
            kicker: "ruang cerita",
            titleTop: "Tentang",
            titleBottom: "Segera Hadir",
            description: "Cerita, perjalanan, dan informasi personal sedang dirapikan agar tampil lebih lengkap, jelas, dan tetap sesuai dengan karakter portfolio ini.",
            primaryText: "Kembali ke Beranda",
            primaryHref: "index.html",
            secondaryText: "Lihat Karya",
            secondaryHref: "karya.html",
            statusTitle: "Cerita sedang dirapikan",
            statusBadge: "soon"
        }
    };

    const body = document.body;
    const currentPage = body.dataset.page || "blog";
    const data = pageData[currentPage] || pageData.blog;

    const setText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    const setHref = (selector, href) => {
        const element = document.querySelector(selector);
        if (element) element.href = href;
    };

    setText("[data-page-kicker]", data.kicker);
    setText("[data-title-top]", data.titleTop);
    setText("[data-title-bottom]", data.titleBottom);
    setText("[data-page-description]", data.description);
    setText("[data-primary-text]", data.primaryText);
    setText("[data-secondary-text]", data.secondaryText);
    setText("[data-status-title]", data.statusTitle);
    setText("[data-status-badge]", data.statusBadge);

    setHref("[data-primary-link]", data.primaryHref);
    setHref("[data-secondary-link]", data.secondaryHref);

    document.title = `${data.titleTop} ${data.titleBottom} | Gland Portfolio`;

    document.querySelectorAll("[data-nav]").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.nav === data.active);
    });

    const card = document.querySelector(".status-card");

    if (card) {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        });
    }

    const canvas = document.querySelector("#orbitGame");
    const scoreText = document.querySelector("[data-game-score]");
    const startButton = document.querySelector("[data-game-start]");
    const hintText = document.querySelector("[data-game-hint]");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let running = false;
    let score = 0;
    let speed = 3.2;
    let orbY = 0;
    let velocity = 0;
    let obstacles = [];
    let particles = [];
    let animationId = null;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        if (!running) {
            orbY = height * 0.5;
            drawScene();
        }
    }

    function resetGame() {
        score = 0;
        speed = 3.2;
        orbY = height * 0.5;
        velocity = 0;
        obstacles = [];
        particles = [];
        updateScore();
    }

    function updateScore() {
        if (scoreText) {
            scoreText.textContent = String(Math.floor(score)).padStart(3, "0");
        }
    }

    function spawnObstacle() {
        const gap = 86;
        const gapY = 44 + Math.random() * (height - 88);

        obstacles.push({
            x: width + 40,
            gapY,
            gap,
            w: 24 + Math.random() * 18
        });
    }

    function spawnParticle(x, y) {
        particles.push({
            x,
            y,
            vx: -1.5 - Math.random() * 1.5,
            vy: -0.7 + Math.random() * 1.4,
            life: 1
        });
    }

    function drawBackground() {
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "rgba(5, 5, 5, 0.04)";
        for (let i = 0; i < 8; i++) {
            const y = (height / 8) * i + 14;
            ctx.fillRect(0, y, width, 1);
        }

        ctx.strokeStyle = "rgba(5, 5, 5, 0.16)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        ctx.bezierCurveTo(width * 0.26, height * 0.6, width * 0.56, height * 0.84, width, height * 0.62);
        ctx.stroke();
    }

    function drawOrb() {
        const x = width * 0.18;
        const radius = 15;

        const gradient = ctx.createRadialGradient(x - 5, orbY - 5, 2, x, orbY, radius);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.45, "#9f9f9f");
        gradient.addColorStop(1, "#050505");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, orbY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(5, 5, 5, 0.24)";
        ctx.arc(x, orbY, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawObstacles() {
        ctx.fillStyle = "rgba(5, 5, 5, 0.82)";

        obstacles.forEach((obstacle) => {
            ctx.fillRect(obstacle.x, 0, obstacle.w, obstacle.gapY - obstacle.gap / 2);
            ctx.fillRect(obstacle.x, obstacle.gapY + obstacle.gap / 2, obstacle.w, height);
        });
    }

    function drawParticles() {
        particles.forEach((particle) => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = "#050505";
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }

    function drawScene() {
        drawBackground();
        drawParticles();
        drawObstacles();
        drawOrb();
    }

    function updateGame() {
        if (!running) return;

        velocity += 0.24;
        orbY += velocity;

        if (orbY < 18) {
            orbY = 18;
            velocity = 0;
        }

        if (orbY > height - 18) {
            endGame();
            return;
        }

        if (Math.random() < 0.35) {
            spawnParticle(width * 0.18 - 14, orbY);
        }

        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < width - 190) {
            spawnObstacle();
        }

        obstacles.forEach((obstacle) => {
            obstacle.x -= speed;
        });

        obstacles = obstacles.filter((obstacle) => obstacle.x > -80);

        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
        });

        particles = particles.filter((particle) => particle.life > 0);

        const orbX = width * 0.18;
        const radius = 15;

        for (const obstacle of obstacles) {
            const withinX = orbX + radius > obstacle.x && orbX - radius < obstacle.x + obstacle.w;
            const outsideGap = orbY - radius < obstacle.gapY - obstacle.gap / 2 || orbY + radius > obstacle.gapY + obstacle.gap / 2;

            if (withinX && outsideGap) {
                endGame();
                return;
            }
        }

        score += 0.12;
        speed += 0.0008;
        updateScore();
        drawScene();

        animationId = requestAnimationFrame(updateGame);
    }

    function flap() {
        if (!running) {
            startGame();
            return;
        }

        velocity = -5.2;
    }

    function startGame() {
        resetGame();
        running = true;

        if (hintText) {
            hintText.textContent = "Klik atau tekan spasi untuk menjaga orb tetap stabil";
        }

        if (startButton) {
            startButton.textContent = "Restart";
        }

        cancelAnimationFrame(animationId);
        updateGame();
    }

    function endGame() {
        running = false;
        cancelAnimationFrame(animationId);

        if (hintText) {
            hintText.textContent = "Game selesai. Klik restart untuk coba lagi.";
        }

        if (startButton) {
            startButton.textContent = "Restart";
        }

        drawScene();
    }

    canvas.addEventListener("click", flap);

    if (startButton) {
        startButton.addEventListener("click", startGame);
    }

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault();
            flap();
        }
    });

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
});