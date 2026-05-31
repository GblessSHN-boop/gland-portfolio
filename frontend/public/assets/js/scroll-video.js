document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".scroll-sequence-section");
    const shell = document.getElementById("sequence-shell");
    const canvas = document.getElementById("scroll-sequence-canvas");

    if (!section || !shell || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const frameCount = Math.max(1, Number(shell.dataset.frameCount || 1));
    const framePath = shell.dataset.framePath || "assets/images/scroll-interaction/scroll-video-frames/";
    const framePrefix = shell.dataset.framePrefix || "frame_";
    const frameExtension = shell.dataset.frameExtension || "png";
    const framePadding = Number(shell.dataset.framePadding || 4);

    const images = new Array(frameCount);
    const loaded = new Array(frameCount).fill(false);

    let targetFrame = 0;
    let smoothFrame = 0;
    let lastDrawnFrame = -1;
    let renderQueued = false;
    let resizeQueued = false;
    let progressiveIndex = 0;
    let progressiveStarted = false;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getFrameSrc(index) {
        const frameNumber = String(index + 1).padStart(framePadding, "0");
        return `${framePath}${framePrefix}${frameNumber}.${frameExtension}`;
    }

    function loadFrame(index, priority = "auto") {
        if (index < 0 || index >= frameCount) return null;
        if (images[index]) return images[index];

        const image = new Image();
        image.decoding = "async";

        if ("fetchPriority" in image) {
            image.fetchPriority = priority;
        }

        image.onload = () => {
            loaded[index] = true;

            if (index === 0) {
                drawFrame(0);
                shell.classList.add("is-sequence-ready");
            }

            if (index === targetFrame || index === Math.round(smoothFrame)) {
                requestRender();
            }
        };

        image.src = getFrameSrc(index);
        images[index] = image;

        return image;
    }

    function loadNearbyFrames(index) {
        loadFrame(index, "high");
        loadFrame(index - 1, "high");
        loadFrame(index + 1, "high");
        loadFrame(index - 2);
        loadFrame(index + 2);
        loadFrame(index - 3);
        loadFrame(index + 3);
        loadFrame(index - 4);
        loadFrame(index + 4);
    }

    function startProgressivePreload() {
        if (progressiveStarted) return;
        progressiveStarted = true;

        function preloadBatch() {
            let batch = 0;

            while (progressiveIndex < frameCount && batch < 6) {
                loadFrame(progressiveIndex);
                progressiveIndex += 1;
                batch += 1;
            }

            if (progressiveIndex < frameCount) {
                if ("requestIdleCallback" in window) {
                    window.requestIdleCallback(preloadBatch, { timeout: 500 });
                }
                else {
                    window.setTimeout(preloadBatch, 24);
                }
            }
        }

        preloadBatch();
    }

    function setupCanvasSize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        requestRender(true);
    }

    function drawImageCover(image) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth = image.naturalWidth || image.width;
        const imageHeight = image.naturalHeight || image.height;

        if (!canvasWidth || !canvasHeight || !imageWidth || !imageHeight) return;

        const canvasRatio = canvasWidth / canvasHeight;
        const imageRatio = imageWidth / imageHeight;

        let sourceWidth = imageWidth;
        let sourceHeight = imageHeight;
        let sourceX = 0;
        let sourceY = 0;

        if (imageRatio > canvasRatio) {
            sourceWidth = imageHeight * canvasRatio;
            sourceX = (imageWidth - sourceWidth) / 2;
        }
        else {
            sourceHeight = imageWidth / canvasRatio;
            sourceY = (imageHeight - sourceHeight) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvasWidth, canvasHeight);
    }

    function findDrawableFrame(index) {
        if (loaded[index]) return index;

        for (let distance = 1; distance < 18; distance++) {
            const previous = index - distance;
            const next = index + distance;

            if (previous >= 0 && loaded[previous]) return previous;
            if (next < frameCount && loaded[next]) return next;
        }

        return loaded[0] ? 0 : -1;
    }

    function drawFrame(index) {
        const drawableIndex = findDrawableFrame(index);

        if (drawableIndex < 0) return;
        if (drawableIndex === lastDrawnFrame && !resizeQueued) return;

        const image = images[drawableIndex];

        if (!image || !image.complete) return;

        drawImageCover(image);
        lastDrawnFrame = drawableIndex;
        resizeQueued = false;
    }

    function getScrollProgress() {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollDistance = section.offsetHeight - window.innerHeight;

        if (scrollDistance <= 0) return 0;

        const rawProgress = (window.scrollY - sectionTop) / scrollDistance;
        return clamp(rawProgress, 0, 1);
    }

    function updateTargetFrame() {
        const progress = getScrollProgress();

        targetFrame = Math.round(progress * (frameCount - 1));
        targetFrame = clamp(targetFrame, 0, frameCount - 1);

        loadNearbyFrames(targetFrame);
        requestRender();
    }

    function renderLoop() {
        renderQueued = false;

        const difference = targetFrame - smoothFrame;
        smoothFrame += difference * 0.2;

        if (Math.abs(difference) < 0.06) {
            smoothFrame = targetFrame;
        }

        const frameToDraw = clamp(Math.round(smoothFrame), 0, frameCount - 1);

        drawFrame(frameToDraw);

        if (Math.abs(targetFrame - smoothFrame) > 0.06) {
            requestRender();
        }
    }

    function requestRender(force = false) {
        if (force) {
            lastDrawnFrame = -1;
            resizeQueued = true;
        }

        if (renderQueued) return;

        renderQueued = true;
        window.requestAnimationFrame(renderLoop);
    }

    function onScroll() {
        updateTargetFrame();
        startProgressivePreload();
    }

    function onResize() {
        setupCanvasSize();
        updateTargetFrame();
    }

    loadFrame(0, "high");
    loadFrame(1, "high");
    loadFrame(2, "high");

    setupCanvasSize();
    updateTargetFrame();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startProgressivePreload();
                updateTargetFrame();
            }
        });
    }, {
        threshold: 0.05
    });

    observer.observe(section);
});
