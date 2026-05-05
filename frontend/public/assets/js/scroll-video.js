const scrollVideo = document.getElementById("scroll-video");
const videoSection = document.querySelector(".scroll-video-section");
const videoShell = document.getElementById("video-shell");
const progressBar = document.getElementById("video-progress-bar");

const scrubState = {
    duration: 0,
    targetProgress: 0,
    smoothProgress: 0,
    ready: false,
    rafId: null
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getScrollProgress() {
    if (!videoSection) return 0;

    const rect = videoSection.getBoundingClientRect();
    const scrollableDistance = videoSection.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return 0;

    return clamp(-rect.top / scrollableDistance, 0, 1);
}

function setScrollDistance() {
    if (!videoSection) return;

    const safeDuration = Number.isFinite(scrubState.duration) && scrubState.duration > 0
        ? scrubState.duration
        : 10;

    const pxPerSecond = window.innerWidth <= 768 ? 380 : 520;
    const minimumDistance = window.innerHeight * 2.8;
    const dynamicDistance = safeDuration * pxPerSecond;
    const finalDistance = Math.max(minimumDistance, dynamicDistance);

    videoSection.style.setProperty(
        "--scroll-height",
        `${window.innerHeight + finalDistance}px`
    );
}

function updateVideoUI(progress) {
    if (videoShell) {
        videoShell.classList.toggle("is-started", progress > 0.015);
    }

    if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
    }
}

function renderVideoScrub() {
    if (scrollVideo && scrubState.ready) {
        scrubState.targetProgress = getScrollProgress();

        const distance = Math.abs(scrubState.targetProgress - scrubState.smoothProgress);
        const ease = distance > 0.22 ? 0.13 : 0.085;

        scrubState.smoothProgress +=
            (scrubState.targetProgress - scrubState.smoothProgress) * ease;

        if (Math.abs(scrubState.targetProgress - scrubState.smoothProgress) < 0.0008) {
            scrubState.smoothProgress = scrubState.targetProgress;
        }

        const maxTime = Math.max(0, scrubState.duration - 0.04);
        const nextTime = clamp(scrubState.smoothProgress * scrubState.duration, 0, maxTime);

        if (Math.abs(scrollVideo.currentTime - nextTime) > 0.012) {
            try {
                scrollVideo.currentTime = nextTime;
            } catch (error) {
                console.warn("Video scrubbing belum siap:", error);
            }
        }

        updateVideoUI(scrubState.smoothProgress);
    }

    scrubState.rafId = requestAnimationFrame(renderVideoScrub);
}

function prepareScrollVideo() {
    if (!scrollVideo) return;

    scrubState.duration = scrollVideo.duration;

    if (!Number.isFinite(scrubState.duration) || scrubState.duration <= 0) {
        return;
    }

    scrubState.ready = true;
    scrollVideo.pause();

    try {
        scrollVideo.currentTime = 0.01;
    } catch (error) {
        console.warn("Frame awal video belum bisa disiapkan:", error);
    }

    setScrollDistance();
    updateVideoUI(0);
}

function initScrollVideo() {
    if (!scrollVideo || !videoSection) return;

    scrollVideo.muted = true;
    scrollVideo.playsInline = true;
    scrollVideo.preload = "auto";
    scrollVideo.pause();

    if (scrollVideo.readyState >= 1) {
        prepareScrollVideo();
    } else {
        scrollVideo.addEventListener("loadedmetadata", prepareScrollVideo, { once: true });
    }

    scrollVideo.addEventListener("canplay", () => {
        if (!scrubState.ready) {
            prepareScrollVideo();
        }
    });

    scrollVideo.addEventListener("error", () => {
        console.warn("Video gagal dimuat. Pastikan file berada di assets/videos/scroll-video.mp4");
    });

    window.addEventListener("resize", () => {
        setScrollDistance();
        scrubState.targetProgress = getScrollProgress();
    });

    scrollVideo.load();

    if (!scrubState.rafId) {
        renderVideoScrub();
    }
}

document.addEventListener("DOMContentLoaded", initScrollVideo);