const scrollVideo = document.getElementById("scroll-video");
const videoSection = document.querySelector(".scroll-video-section");
const videoShell = document.getElementById("video-shell");

let videoDuration = 0;
let targetTime = 0;
let currentTime = 0;
let isVideoReady = false;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getVideoScrollProgress() {
    if (!videoSection) return 0;

    const rect = videoSection.getBoundingClientRect();
    const sectionHeight = videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollableDistance = sectionHeight - viewportHeight;

    if (totalScrollableDistance <= 0) return 0;

    const scrolledInsideSection = -rect.top;
    const progress = scrolledInsideSection / totalScrollableDistance;

    return clamp(progress, 0, 1);
}

function updateTargetTime() {
    if (!scrollVideo || !isVideoReady) return;

    const progress = getVideoScrollProgress();
    targetTime = progress * videoDuration;

    if (videoShell) {
        videoShell.classList.toggle("is-started", progress > 0.025);
    }
}

function animateVideoScrub() {
    if (scrollVideo && isVideoReady) {
        currentTime += (targetTime - currentTime) * 0.16;

        if (Math.abs(scrollVideo.currentTime - currentTime) > 0.015) {
            try {
                scrollVideo.currentTime = currentTime;
            } catch (error) {
                console.warn("Video belum siap untuk scrubbing.", error);
            }
        }
    }

    requestAnimationFrame(animateVideoScrub);
}

function prepareVideo() {
    if (!scrollVideo) return;

    videoDuration = scrollVideo.duration;

    if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
        return;
    }

    isVideoReady = true;

    try {
        scrollVideo.pause();
        scrollVideo.currentTime = 0.01;
        currentTime = 0.01;
        targetTime = 0.01;
    } catch (error) {
        console.warn("Tidak bisa mengatur frame awal video.", error);
    }

    updateTargetTime();
}

function initScrollVideo() {
    if (!scrollVideo || !videoSection) return;

    scrollVideo.muted = true;
    scrollVideo.playsInline = true;
    scrollVideo.pause();

    if (scrollVideo.readyState >= 1) {
        prepareVideo();
    } else {
        scrollVideo.addEventListener("loadedmetadata", prepareVideo, { once: true });
    }

    scrollVideo.addEventListener("error", () => {
        console.warn("Video gagal dimuat. Pastikan file ada di assets/videos/scroll-video.mp4");
    });

    window.addEventListener("scroll", updateTargetTime, { passive: true });
    window.addEventListener("resize", updateTargetTime);

    scrollVideo.load();
    animateVideoScrub();
}

document.addEventListener("DOMContentLoaded", initScrollVideo);