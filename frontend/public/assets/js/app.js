document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
    });

    if (prefersReducedMotion) {
        return;
    }

    initHeroParallax();
    initMagneticButtons();
    initScrollReveal();
});

/* ===============================
   HERO IMAGE PARALLAX
================================ */
function initHeroParallax() {
    const hero = document.querySelector(".hero-section");
    const browserImage = document.querySelector(".hero-browser-img");

    if (!hero || !browserImage) return;

    let rect = hero.getBoundingClientRect();

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let velocityX = 0;
    let velocityY = 0;

    let isInside = false;

    function updateRect() {
        rect = hero.getBoundingClientRect();
    }

    function onPointerMove(event) {
        updateRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        targetX = x;
        targetY = y;
        isInside = true;
    }

    function onPointerLeave() {
        targetX = 0;
        targetY = 0;
        isInside = false;
    }

    function animate() {
        const time = performance.now() * 0.001;

        const spring = 0.075;
        const friction = 0.82;

        velocityX += (targetX - currentX) * spring;
        velocityY += (targetY - currentY) * spring;

        velocityX *= friction;
        velocityY *= friction;

        currentX += velocityX;
        currentY += velocityY;

        const idleX = Math.sin(time * 1.4) * 4;
        const idleY = Math.cos(time * 1.15) * 5;
        const idleRotate = Math.sin(time * 1.2) * 1.2;

        const moveX = currentX * 56 + idleX;
        const moveY = currentY * 42 + idleY;

        const rotateX = currentY * -16;
        const rotateY = currentX * 18;
        const rotateZ = currentX * 4 + idleRotate;

        const scale = isInside ? 1.055 : 1.02;

        browserImage.style.transform = `
            translate3d(${moveX}px, ${moveY}px, 0)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
        `;

        requestAnimationFrame(animate);
    }

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", updateRect);

    animate();
}

/* ===============================
   MAGNETIC ACTION BUTTONS
================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll(".action-link");

    buttons.forEach((button) => {
        button.addEventListener("pointermove", (event) => {
            const rect = button.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.12;
            const moveY = y * 0.18;

            button.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        button.addEventListener("pointerleave", () => {
            button.style.transform = "translate3d(0, 0, 0)";
        });
    });
}

/* ===============================
   VIDEO SECTION REVEAL
================================ */
function initScrollReveal() {
    const videoStage = document.querySelector(".video-stage");

    if (!videoStage) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoStage.classList.add("is-visible");
                }
            });
        },
        {
            threshold: 0.28
        }
    );

    observer.observe(videoStage);
}