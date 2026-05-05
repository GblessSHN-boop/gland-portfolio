const cursor = document.querySelector(".custom-cursor");
const follower = document.querySelector(".cursor-follower");

const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

function updateCursorPosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (cursor) {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
}

function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;

    if (follower) {
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateFollower);
}

function setupHoverTargets() {
    const targets = document.querySelectorAll("a, button, .video-shell");

    targets.forEach((target) => {
        target.addEventListener("mouseenter", () => {
            follower?.classList.add("cursor-active");
        });

        target.addEventListener("mouseleave", () => {
            follower?.classList.remove("cursor-active");
        });
    });
}

function initCustomCursor() {
    if (isTouchDevice || !cursor || !follower) {
        return;
    }

    document.addEventListener("mousemove", updateCursorPosition);
    setupHoverTargets();
    animateFollower();
}

document.addEventListener("DOMContentLoaded", initCustomCursor);