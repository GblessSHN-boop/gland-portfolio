document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        id: {
            pageTitle: "Gland Jermano Blessed Siahaan — Portfolio",
            navWorks: "karya",
            navAbout: "tentang",
            navBlog: "blog",
            navContact: "kontak",
            heroIntro: "Hi, saya Gland Jermano Blessed Siahaan,<br>A.K.A The Web Warrior.",
            heroDescription: "Saya sedang bertumbuh sebagai web developer muda yang suka mengubah ide menjadi tampilan digital yang rapi, interaktif, dan bermakna. Bukan cuma pengguna teknologi, saya ingin menjadi pembuat solusi lewat kode.",
            emailButton: "email",
            cvButton: "cv",
            videoLabel: "Motion Interaction",
            videoHeading: "Video berjalan otomatis"
        },
        en: {
            pageTitle: "Gland Jermano Blessed Siahaan — Portfolio",
            navWorks: "works",
            navAbout: "about",
            navBlog: "blog",
            navContact: "contact",
            heroIntro: "Hi, I am Gland Jermano Blessed Siahaan,<br>A.K.A The Web Warrior.",
            heroDescription: "I am growing as a young web developer who enjoys turning ideas into clean, interactive, and meaningful digital interfaces. I do not only want to use technology, I want to build solutions through code.",
            emailButton: "email",
            cvButton: "cv",
            videoLabel: "Motion Interaction",
            videoHeading: "Autoplay video experience"
        }
    };

    const languageButtons = document.querySelectorAll("[data-lang-switch]");
    const textElements = document.querySelectorAll("[data-i18n]");
    const htmlElements = document.querySelectorAll("[data-i18n-html]");
    const savedLanguage = localStorage.getItem("gland-language");
    const defaultLanguage = savedLanguage || "id";

    function setLanguage(language) {
        const selectedTranslations = translations[language];

        if (!selectedTranslations) return;

        document.documentElement.lang = language;
        document.title = selectedTranslations.pageTitle;

        textElements.forEach((element) => {
            const key = element.dataset.i18n;

            if (selectedTranslations[key]) {
                element.textContent = selectedTranslations[key];
            }
        });

        htmlElements.forEach((element) => {
            const key = element.dataset.i18nHtml;

            if (selectedTranslations[key]) {
                element.innerHTML = selectedTranslations[key];
            }
        });

        languageButtons.forEach((button) => {
            const isActive = button.dataset.langSwitch === language;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        localStorage.setItem("gland-language", language);
    }

    languageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.langSwitch);
        });
    });

    setLanguage(defaultLanguage);
});