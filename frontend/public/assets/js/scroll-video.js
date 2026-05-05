document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".scroll-video-section");
    const video = document.querySelector("#scroll-video");
    const shell = document.querySelector("#video-shell");

    if (!section || !video || !shell) return;

    let state = "idle";
    let lastScrollY = window.scrollY;
    let touchStartY = 0;
    let isSnapping = false;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.controls = false;

    function getSectionTop() {
        return section.getBoundingClientRect().top + window.scrollY;
    }

    function snapToVideoTop() {
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
        state = "idle";

        shell.classList.remove("is-playing", "is-started", "is-completed");
        section.classList.remove("is-video-active", "is-video-completed");

        try {
            video.pause();
            video.currentTime = 0;
        } catch (error) {
            console.warn("Video reset skipped:", error);
        }
    }

    function completeVideo() {
        if (state === "completed") return;

        state = "completed";

        shell.classList.remove("is-playing");
        shell.classList.add("is-completed");
        section.classList.remove("is-video-active");
        section.classList.add("is-video-completed");
    }

    function playVideo() {
        if (state === "playing" || state === "completed") return;

        state = "playing";

        shell.classList.add("is-playing", "is-started");
        shell.classList.remove("is-completed");
        section.classList.add("is-video-active");

        try {
            video.currentTime = 0;
        } catch (error) {
            console.warn("Video belum siap direset:", error);
        }

        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Autoplay video tertahan:", error);
                state = "waiting";
                shell.classList.remove("is-playing");
            });
        }
    }

    function startVideoSection() {
        if (state !== "idle") return;

        snapToVideoTop();

        requestAnimationFrame(() => {
            playVideo();
        });
    }

    function sectionReachedTop() {
        return window.scrollY >= getSectionTop() - 2;
    }

    function sectionGoneBelowViewport() {
        const rect = section.getBoundingClientRect();
        return rect.top >= window.innerHeight - 4;
    }

    function checkScrollPosition() {
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        const sectionTop = getSectionTop();

        if (state === "idle" && scrollingDown && sectionReachedTop()) {
            startVideoSection();
        }

        if ((state === "playing" || state === "waiting") && currentY > sectionTop + 2) {
            snapToVideoTop();
        }

        if ((state === "playing" || state === "waiting" || state === "completed") && sectionGoneBelowViewport()) {
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
            snapToVideoTop();
        }
    }

    function handleKeyDown(event) {
        if (state !== "playing" && state !== "waiting") return;

        const downKeys = ["ArrowDown", "PageDown", "End", " "];

        if (downKeys.includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            snapToVideoTop();
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
            snapToVideoTop();
        }
    }

    video.addEventListener("ended", completeVideo);

    video.addEventListener("timeupdate", () => {
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