document.addEventListener("DOMContentLoaded", () => {
    const pageData = {
        admin: {
            active: "admin",
            kicker: "ruang kontrol",
            titleTop: "Admin",
            titleBottom: "Belum Aktif",
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
            titleBottom: "Disusun",
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
            titleBottom: "Belum Aktif",
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

    function createMotionCanvas() {
        const motionBg = document.querySelector(".motion-bg");

        if (!motionBg) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const particles = [];

        const pointer = {
            x: window.innerWidth * 0.5,
            y: window.innerHeight * 0.5,
            tx: window.innerWidth * 0.5,
            ty: window.innerHeight * 0.5
        };

        let width = 0;
        let height = 0;
        let animationId = null;

        canvas.className = "motion-canvas";
        motionBg.appendChild(canvas);

        function resize() {
            const ratio = window.devicePixelRatio || 1;

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            particles.length = 0;

            const total = Math.min(105, Math.max(46, Math.floor(width / 16)));

            for (let i = 0; i < total; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: -0.16 + Math.random() * 0.32,
                    vy: -0.16 + Math.random() * 0.32,
                    r: 1 + Math.random() * 2.2,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            pointer.x += (pointer.tx - pointer.x) * 0.05;
            pointer.y += (pointer.ty - pointer.y) * 0.05;

            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                particle.phase += 0.01;
                particle.x += particle.vx + (pointer.x - width * 0.5) * 0.00008;
                particle.y += particle.vy + Math.sin(particle.phase) * 0.05 + (pointer.y - height * 0.5) * 0.00008;

                if (particle.x < -30) particle.x = width + 30;
                if (particle.x > width + 30) particle.x = -30;
                if (particle.y < -30) particle.y = height + 30;
                if (particle.y > height + 30) particle.y = -30;

                const pointerDx = particle.x - pointer.x;
                const pointerDy = particle.y - pointer.y;
                const pointerDistance = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);

                if (pointerDistance < 150) {
                    const force = (150 - pointerDistance) / 150;
                    particle.x += pointerDx * 0.006 * force;
                    particle.y += pointerDy * 0.006 * force;
                }

                ctx.beginPath();
                ctx.fillStyle = "rgba(5, 5, 5, 0.32)";
                ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const next = particles[j];
                    const dx = particle.x - next.x;
                    const dy = particle.y - next.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 118) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(5, 5, 5, ${0.13 * (1 - distance / 118)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        }

        window.addEventListener("mousemove", (event) => {
            pointer.tx = event.clientX;
            pointer.ty = event.clientY;
        });

        window.addEventListener("resize", resize);

        resize();
        cancelAnimationFrame(animationId);
        draw();
    }

    function initCardTilt() {
        const cards = document.querySelectorAll(".status-card");

        cards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateX = ((y / rect.height) - 0.5) * -7;
                const rotateY = ((x / rect.width) - 0.5) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            });
        });
    }

    function initMagneticButtons() {
        const buttons = document.querySelectorAll(".placeholder-button");

        buttons.forEach((button) => {
            button.addEventListener("mousemove", (event) => {
                const rect = button.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.08}px, ${y * 0.16}px) translateY(-4px)`;
            });

            button.addEventListener("mouseleave", () => {
                button.style.transform = "";
            });
        });
    }

    function initOrbitGame() {
        const canvas = document.querySelector("#orbitGame");
        const scoreText = document.querySelector("[data-game-score]");
        const startButton = document.querySelector("[data-game-start]");
        const hintText = document.querySelector("[data-game-hint]");

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        let width = 0;
        let height = 0;
        let running = false;
        let ended = false;
        let score = 0;
        let bestScore = Number(localStorage.getItem("orbit-dodge-best") || 0);
        let speed = 3.4;
        let animationId = null;
        let frame = 0;

        const orb = {
            x: 0,
            y: 0,
            r: 14,
            vy: 0,
            pulse: 0
        };

        let obstacles = [];
        let sparks = [];
        let rings = [];

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;

            width = rect.width;
            height = rect.height;

            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            orb.x = width * 0.18;

            if (!running) {
                orb.y = height * 0.5;
                drawScene();
            }
        }

        function setScore(value) {
            score = Math.max(0, value);

            if (scoreText) {
                scoreText.textContent = String(Math.floor(score)).padStart(3, "0");
            }
        }

        function resetGame() {
            frame = 0;
            speed = 3.4;
            obstacles = [];
            sparks = [];
            rings = [];
            orb.x = width * 0.18;
            orb.y = height * 0.5;
            orb.vy = 0;
            orb.pulse = 0;
            ended = false;
            setScore(0);
        }

        function spawnObstacle() {
            const gap = Math.max(78, height * 0.37);
            const safeTop = 38;
            const safeBottom = height - 38;
            const gapY = safeTop + Math.random() * (safeBottom - safeTop);
            const w = 24 + Math.random() * 18;

            obstacles.push({
                x: width + 42,
                w,
                gapY,
                gap,
                passed: false,
                offset: Math.random() * Math.PI * 2
            });
        }

        function spawnRing() {
            rings.push({
                x: width + 40,
                y: 42 + Math.random() * (height - 84),
                r: 12,
                taken: false,
                phase: Math.random() * Math.PI * 2
            });
        }

        function spawnSpark(x, y, amount = 1) {
            for (let i = 0; i < amount; i++) {
                sparks.push({
                    x,
                    y,
                    vx: -1.4 - Math.random() * 2.2,
                    vy: -1.2 + Math.random() * 2.4,
                    r: 1.4 + Math.random() * 2.1,
                    life: 1
                });
            }
        }

        function drawBackground() {
            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.26)");
            gradient.addColorStop(1, "rgba(5, 5, 5, 0.035)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(5, 5, 5, 0.055)";
            ctx.lineWidth = 1;

            for (let x = -40; x < width + 40; x += 38) {
                ctx.beginPath();
                ctx.moveTo(x - (frame * 0.25) % 38, 0);
                ctx.lineTo(x - (frame * 0.25) % 38, height);
                ctx.stroke();
            }

            for (let y = 0; y < height; y += 42) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            ctx.strokeStyle = "rgba(5, 5, 5, 0.18)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, height * 0.7);
            ctx.bezierCurveTo(width * 0.25, height * 0.58, width * 0.56, height * 0.86, width, height * 0.62);
            ctx.stroke();
        }

        function drawOrb() {
            const pulseRadius = orb.r + 8 + Math.sin(orb.pulse) * 2;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(5, 5, 5, 0.2)";
            ctx.lineWidth = 1.3;
            ctx.arc(orb.x, orb.y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();

            const gradient = ctx.createRadialGradient(orb.x - 5, orb.y - 5, 2, orb.x, orb.y, orb.r);
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(0.42, "#adadad");
            gradient.addColorStop(1, "#050505");

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
            ctx.arc(orb.x - 5, orb.y - 6, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawObstacles() {
            obstacles.forEach((obstacle) => {
                const wave = Math.sin(frame * 0.02 + obstacle.offset) * 10;
                const gapY = obstacle.gapY + wave;

                ctx.fillStyle = "rgba(5, 5, 5, 0.84)";
                ctx.fillRect(obstacle.x, 0, obstacle.w, gapY - obstacle.gap / 2);
                ctx.fillRect(obstacle.x, gapY + obstacle.gap / 2, obstacle.w, height);

                ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
                ctx.fillRect(obstacle.x + obstacle.w - 3, 0, 3, gapY - obstacle.gap / 2);
                ctx.fillRect(obstacle.x + obstacle.w - 3, gapY + obstacle.gap / 2, 3, height);
            });
        }

        function drawRings() {
            rings.forEach((ring) => {
                if (ring.taken) return;

                const pulse = Math.sin(frame * 0.05 + ring.phase) * 3;

                ctx.beginPath();
                ctx.strokeStyle = "rgba(5, 5, 5, 0.36)";
                ctx.lineWidth = 2;
                ctx.arc(ring.x, ring.y, ring.r + pulse, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = "rgba(5, 5, 5, 0.16)";
                ctx.arc(ring.x, ring.y, 3.4, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function drawSparks() {
            sparks.forEach((spark) => {
                ctx.globalAlpha = spark.life;
                ctx.beginPath();
                ctx.fillStyle = "#050505";
                ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
        }

        function drawStartOverlay() {
            if (running) return;

            ctx.save();
            ctx.fillStyle = "rgba(217, 217, 217, 0.58)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "rgba(5, 5, 5, 0.78)";
            ctx.font = "800 18px Poppins, Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(ended ? "Restart Orbit Dodge" : "Klik untuk mulai", width / 2, height / 2 - 6);

            ctx.fillStyle = "rgba(5, 5, 5, 0.52)";
            ctx.font = "500 12px Poppins, Arial, sans-serif";
            ctx.fillText(`Best score: ${String(Math.floor(bestScore)).padStart(3, "0")}`, width / 2, height / 2 + 18);
            ctx.restore();
        }

        function drawScene() {
            drawBackground();
            drawRings();
            drawSparks();
            drawObstacles();
            drawOrb();
            drawStartOverlay();
        }

        function updateGame() {
            if (!running) return;

            frame += 1;
            orb.pulse += 0.1;

            orb.vy += 0.23;
            orb.y += orb.vy;

            if (orb.y < orb.r + 2) {
                orb.y = orb.r + 2;
                orb.vy = 0;
            }

            if (orb.y > height - orb.r - 2) {
                endGame();
                return;
            }

            if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < width - 205) {
                spawnObstacle();
            }

            if (rings.length === 0 || rings[rings.length - 1].x < width - 170) {
                if (Math.random() > 0.35) spawnRing();
            }

            obstacles.forEach((obstacle) => {
                obstacle.x -= speed;
            });

            rings.forEach((ring) => {
                ring.x -= speed * 0.92;
            });

            sparks.forEach((spark) => {
                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.life -= 0.022;
            });

            obstacles = obstacles.filter((obstacle) => obstacle.x > -70);
            rings = rings.filter((ring) => ring.x > -40 && !ring.taken);
            sparks = sparks.filter((spark) => spark.life > 0);

            if (Math.random() < 0.34) {
                spawnSpark(orb.x - orb.r, orb.y, 1);
            }

            for (const obstacle of obstacles) {
                const wave = Math.sin(frame * 0.02 + obstacle.offset) * 10;
                const gapY = obstacle.gapY + wave;
                const withinX = orb.x + orb.r > obstacle.x && orb.x - orb.r < obstacle.x + obstacle.w;
                const outsideGap = orb.y - orb.r < gapY - obstacle.gap / 2 || orb.y + orb.r > gapY + obstacle.gap / 2;

                if (withinX && outsideGap) {
                    endGame();
                    return;
                }

                if (!obstacle.passed && obstacle.x + obstacle.w < orb.x - orb.r) {
                    obstacle.passed = true;
                    setScore(score + 5);
                    spawnSpark(orb.x, orb.y, 8);
                }
            }

            for (const ring of rings) {
                const dx = orb.x - ring.x;
                const dy = orb.y - ring.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < orb.r + ring.r + 4) {
                    ring.taken = true;
                    setScore(score + 12);
                    spawnSpark(ring.x, ring.y, 14);
                }
            }

            speed += 0.0009;
            setScore(score + 0.035);
            drawScene();

            animationId = requestAnimationFrame(updateGame);
        }

        function thrust() {
            if (!running) {
                startGame();
                return;
            }

            orb.vy = -5.35;
            orb.pulse += 0.8;
            spawnSpark(orb.x - orb.r, orb.y, 6);
        }

        function startGame() {
            resetGame();
            running = true;
            ended = false;

            if (hintText) {
                hintText.textContent = "Klik canvas atau tekan spasi untuk menjaga orb tetap stabil.";
            }

            if (startButton) {
                startButton.textContent = "Restart";
            }

            cancelAnimationFrame(animationId);
            updateGame();
        }

        function endGame() {
            running = false;
            ended = true;
            cancelAnimationFrame(animationId);

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem("orbit-dodge-best", String(Math.floor(bestScore)));
            }

            if (hintText) {
                hintText.textContent = "Game selesai. Klik restart untuk coba lagi.";
            }

            if (startButton) {
                startButton.textContent = "Restart";
            }

            drawScene();
        }

        canvas.addEventListener("click", thrust);

        if (startButton) {
            startButton.addEventListener("click", startGame);
        }

        window.addEventListener("keydown", (event) => {
            const activeElement = document.activeElement;
            const isTyping = activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName);

            if (event.code === "Space" && !isTyping) {
                event.preventDefault();
                thrust();
            }
        });

        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(resizeCanvas);
            observer.observe(canvas);
        } else {
            window.addEventListener("resize", resizeCanvas);
        }

        resizeCanvas();
    }

    createMotionCanvas();
    initCardTilt();
    initMagneticButtons();
    initOrbitGame();
});