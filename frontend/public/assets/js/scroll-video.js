document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".scroll-sequence-section");
    const canvas = document.getElementById("scroll-sequence-canvas");
    const fallbackImage = document.getElementById("scroll-sequence-fallback");

    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });

    const FRAME_COUNT = 244;
    const FRAME_FOLDER = "assets/images/scroll-interaction/scroll-video-frames";
    const SMOOTH_FACTOR = 0.12;
    const PRELOAD_AHEAD = 10;
    const PRELOAD_BEHIND = 4;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    let targetProgress = 0;
    let currentProgress = 0;
    let currentFrameIndex = 1;
    let animationStarted = false;
    let resizeTimeout = null;

    const frameImages = new Array(FRAME_COUNT + 1);
    const framePromises = new Array(FRAME_COUNT + 1);

    function getFrameSrc(index) {
        return `${FRAME_FOLDER}/frame_${String(index).padStart(4, "0")}.png`;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function loadFrame(index) {
        if (index < 1 || index > FRAME_COUNT) return Promise.resolve(null);

        if (frameImages[index]) {
            return Promise.resolve(frameImages[index]);
        }

        if (framePromises[index]) {
            return framePromises[index];
        }

        framePromises[index] = new Promise((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.src = getFrameSrc(index);

            image.onload = () => {
                frameImages[index] = image;
                resolve(image);
            };

            image.onerror = () => {
                resolve(null);
            };
        });

        return framePromises[index];
    }

    function drawImageContain(image) {
        if (!image) return;

        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#020202";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const scale = Math.min(cssWidth / image.width, cssHeight / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const x = (cssWidth - drawWidth) / 2;
        const y = (cssHeight - drawHeight) / 2;

        ctx.drawImage(image, x, y, drawWidth, drawHeight);
    }

    function findNearestLoadedFrame(targetIndex) {
        if (frameImages[targetIndex]) return targetIndex;

        for (let offset = 1; offset < FRAME_COUNT; offset++) {
            const prev = targetIndex - offset;
            const next = targetIndex + offset;

            if (prev >= 1 && frameImages[prev]) return prev;
            if (next <= FRAME_COUNT && frameImages[next]) return next;
        }

        return 1;
    }

    function renderFrame(index) {
        const safeIndex = clamp(index, 1, FRAME_COUNT);
        const availableIndex = findNearestLoadedFrame(safeIndex);
        const image = frameImages[availableIndex];

        if (!image) return;

        currentFrameIndex = availableIndex;
        drawImageContain(image);

        if (fallbackImage) {
            fallbackImage.style.opacity = "0";
            fallbackImage.style.pointerEvents = "none";
        }
    }

    function preloadAround(index) {
        for (let i = index - PRELOAD_BEHIND; i <= index + PRELOAD_AHEAD; i++) {
            if (i >= 1 && i <= FRAME_COUNT) {
                loadFrame(i);
            }
        }
    }

    function preloadRemainingInBackground() {
        let index = 2;

        const pump = () => {
            const end = Math.min(index + 6, FRAME_COUNT);

            for (let i = index; i <= end; i++) {
                loadFrame(i);
            }

            index = end + 1;

            if (index <= FRAME_COUNT) {
                if ("requestIdleCallback" in window) {
                    requestIdleCallback(pump);
                } else {
                    setTimeout(pump, 80);
                }
            }
        };

        if ("requestIdleCallback" in window) {
            requestIdleCallback(pump);
        } else {
            setTimeout(pump, 150);
        }
    }

    function updateCanvasSize() {
        const width = Math.max(1, Math.round(canvas.clientWidth));
        const height = Math.max(1, Math.round(canvas.clientHeight));

        canvas.width = Math.round(width * DPR);
        canvas.height = Math.round(height * DPR);

        renderFrame(currentFrameIndex);
    }

    function getSectionProgress() {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const rawProgress = (window.scrollY - sectionTop) / scrollableDistance;

        return clamp(rawProgress, 0, 1);
    }

    function animate() {
        targetProgress = getSectionProgress();

        currentProgress += (targetProgress - currentProgress) * SMOOTH_FACTOR;

        if (Math.abs(targetProgress - currentProgress) < 0.0005) {
            currentProgress = targetProgress;
        }

        const frameFloat = currentProgress * (FRAME_COUNT - 1);
        const targetFrame = clamp(Math.round(frameFloat) + 1, 1, FRAME_COUNT);

        preloadAround(targetFrame);
        renderFrame(targetFrame);

        requestAnimationFrame(animate);
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCanvasSize();
        }, 120);
    }

    loadFrame(1).then((firstFrame) => {
        if (!firstFrame) return;

        updateCanvasSize();
        drawImageContain(firstFrame);
        preloadAround(1);
        preloadRemainingInBackground();

        if (!animationStarted) {
            animationStarted = true;
            requestAnimationFrame(animate);
        }
    });

    window.addEventListener("resize", handleResize, { passive: true });
});