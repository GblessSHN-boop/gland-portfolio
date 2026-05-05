document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".scroll-video-section");
    const video = document.querySelector("#scroll-video");
    const shell = document.querySelector("#video-shell");
    const overlay = document.querySelector("#video-overlay");
    const progressBar = document.querySelector("#video-progress-bar");

    if (!section || !video || !shell) return;

    let state = "idle";
    let lastScrollY = window.scrollY;
    let touchStartY = 0;
    let progressFrame = null;
    let isSnapping = false;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.controls = false;

    function getSectionTop() {
        return section.getBoundingClientRect().top + window.scrollY;
    }

    function setOverlayText(title, subtitle) {
        if (!overlay) return;

        const titleElement = overlay.querySelector("span");
        const subtitleElement = overlay.querySelector("small");

        if (titleElement) titleElement.textContent = title;
        if (subtitleElement) subtitleElement.textContent = subtitle;
    }

    function updateProgress() {
        if (!progressBar || !Number.isFinite(video.duration) || video.duration <= 0) return;

        const progress = Math.min(video.currentTime / video.duration, 1);
        progressBar.style.transform = `scaleX(${progress})`;
    }

    function startProgressLoop() {
        updateProgress();

        if (state === "playing") {
            progressFrame = requestAnimationFrame(startProgressLoop);
        }
    }

    function stopProgressLoop() {
        if (!progressFrame) return;

        cancelAnimationFrame(progressFrame);
        progressFrame = null;
    }

    function forceScrollToVideoTop() {
        const targetTop = getSectionTop();
        const html = document.documentElement;
        const previousBehavior = html.style.scrollBehavior;

        isSnapping = true;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, targetTop);

        requestAnimationFrame(() => {
            html.style.scrollBehavior = previousBehavior;
            isSnapping = false;
        });
    }

    function resetVideo() {
        stopProgressLoop();

        state = "idle";

        shell.classList.remove("is-playing", "is-started", "is-completed");
        section.classList.remove("is-video-active", "is-video-completed");

        try {
            video.pause();
            video.currentTime = 0;
        } catch (error) {
            console.warn("Video reset skipped:", error);
        }

        if (progressBar) {
            progressBar.style.transform = "scaleX(0)";
        }

        setOverlayText("Video akan berjalan otomatis", "Scroll ke bawah terbuka setelah video selesai.");
    }

    function completeVideo() {
        if (state === "completed") return;

        stopProgressLoop();

        state = "completed";

        shell.classList.remove("is-playing");
        shell.classList.add("is-completed");
        section.classList.remove("is-video-active");
        section.classList.add("is-video-completed");

        updateProgress();
        setOverlayText("Video selesai", "Sekarang kamu bisa lanjut scroll ke bawah.");
    }

    function playVideo() {
        if (state === "playing" || state === "completed") return;

        state = "playing";

        shell.classList.add("is-playing", "is-started");
        shell.classList.remove("is-completed");
        section.classList.add("is-video-active");

        setOverlayText("Video sedang berjalan", "Scroll ke bawah akan terbuka setelah video selesai.");

        try {
            video.currentTime = 0;
        } catch (error) {
            console.warn("Video belum siap direset:", error);
        }

        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    startProgressLoop();
                })
                .catch((error) => {
                    console.warn("Autoplay video tertahan:", error);

                    state = "waiting";
                    shell.classList.remove("is-playing");

                    setOverlayText("Klik video untuk memulai", "Scroll ke bawah tetap dikunci sebelum video selesai.");
                });
        } else {
            startProgressLoop();
        }
    }

    function startVideoSection() {
        if (state !== "idle") return;

        forceScrollToVideoTop();

        requestAnimationFrame(() => {
            playVideo();
        });
    }

    function sectionIsCompletelyPassedFromTop() {
        const sectionTop = getSectionTop();
        return window.scrollY >= sectionTop - 2;
    }

    function videoSectionIsFullyGoneBelow() {
        const rect = section.getBoundingClientRect();
        return rect.top >= window.innerHeight - 4;
    }

    function checkScrollPosition() {
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        const sectionTop = getSectionTop();

        if (state === "idle" && scrollingDown && sectionIsCompletelyPassedFromTop()) {
            startVideoSection();
        }

        if ((state === "playing" || state === "waiting") && currentY > sectionTop + 2) {
            forceScrollToVideoTop();
        }

        if ((state === "playing" || state === "waiting" || state === "completed") && videoSectionIsFullyGoneBelow()) {
            resetVideo();
        }

        if (!isSnapping) {
            lastScrollY = currentY;
        }
    }

    function preventDownScroll(event) {
        if (state !== "playing" && state !== "waiting") return;

        if (event.deltaY > 0) {
            event.preventDefault();
            event.stopPropagation();
            forceScrollToVideoTop();
        }
    }

    function handleKeyDown(event) {
        if (state !== "playing" && state !== "waiting") return;

        const downKeys = ["ArrowDown", "PageDown", "End", " "];

        if (downKeys.includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            forceScrollToVideoTop();
        }
    }

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (state !== "playing" && state !== "waiting") return;

        const currentY = event.touches[0].clientY;
        const movingDownPage = touchStartY - currentY > 0;

        if (movingDownPage) {
            event.preventDefault();
            event.stopPropagation();
            forceScrollToVideoTop();
        }
    }

    video.addEventListener("ended", completeVideo);

    video.addEventListener("timeupdate", () => {
        updateProgress();

        if (!Number.isFinite(video.duration) || video.duration <= 0) return;

        const remaining = video.duration - video.currentTime;

        if (remaining <= 0.08) {
            completeVideo();
        }
    });

    video.addEventListener("error", () => {
        console.warn("Video gagal dimuat. Pastikan file berada di assets/videos/scroll-video.mp4");

        state = "completed";
        shell.classList.remove("is-playing");
        shell.classList.add("is-completed");

        updateProgress();
        setOverlayText("Video gagal dimuat", "Scroll ke bawah dibuka.");
    });

    shell.addEventListener("click", () => {
        if (state === "waiting") {
            playVideo();
        }
    });

    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);
    window.addEventListener("wheel", preventDownScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    video.load();
});