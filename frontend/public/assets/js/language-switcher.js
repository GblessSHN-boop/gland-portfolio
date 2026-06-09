document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        id: {
            pageTitle: "Gland Jermano Blessed Siahaan - Portfolio",
            navWorks: "karya",
            navAbout: "tentang",
            navBlog: "blog",
            navContact: "kontak",
            emailButton: "email",
            cvButton: "cv",
            videoLabel: "Motion Interaction",
            videoHeading: "Interaksi frame berbasis scroll",
            semesterLabel: "awal mula",
            semesterHeading: "Cerita Dimulai<br>dari Semester II",
            semesterSideNote: "Bukan fase ketika saya paling banyak teori, tetapi fase ketika saya mulai paling banyak membangun.",
            semesterParagraph1: "Di semester 2, saya mulai lebih sering vibe coding. Bukan karena saya tidak paham flow atau alur, tetapi karena saya merasa lebih cepat belajar ketika ide langsung saya ubah menjadi sesuatu yang nyata.",
            semesterParagraph2: "Saya masih punya banyak waktu untuk explore. Karena itu, saya lebih senang mencoba berbagai ide, melihat hasilnya langsung di browser, lalu memperbaikinya sedikit demi sedikit sampai jadi website yang benar-benar terasa hidup.",
            semesterParagraph3: "Biasanya saya mulai dari membuat desain page terlebih dahulu. Setelah itu, saya gunakan AI untuk membantu mengubah desain tersebut menjadi kode, sambil tetap saya pahami struktur, logika, dan cara kerjanya.",
            semesterParagraph4: "Bagi saya, vibe coding bukan berarti asal jadi. Justru ini cara saya belajar sambil membangun, supaya setiap ide bisa benar-benar berubah menjadi pengalaman digital yang nyata.",
            semesterProcessLabel: "how i build",
            processTitle1: "Start with an idea",
            processText1: "Saya mulai dari ide yang ingin saya lihat jadi nyata.",
            processTitle2: "Design the page",
            processText2: "Saya susun dulu arah visual dan layout utamanya.",
            processTitle3: "Translate into code",
            processText3: "AI membantu mengubah desain menjadi kode yang bisa saya pelajari.",
            processTitle4: "Refine and debug",
            processText4: "Saya rapikan, uji, dan perbaiki sampai hasilnya terasa pas.",
            toolLabel1: "ai learning tool",
            toolText1: "Membantu saya survive dalam IT, belajar IT, memahami error, dan mengubah desain atau gambar menjadi kode.",
            toolLabel2: "design tool",
            toolText2: "Saya gunakan untuk membuat desain landing page sebelum masuk ke proses coding.",
            toolLabel3: "editing tool",
            toolText3: "Saya gunakan untuk membuat logo, icon, dan aset visual pendukung website.",
            toolLabel4: "build mindset",
            toolText4: "Cara saya belajar sambil membangun, mengeksplorasi ide, dan mengubah inspirasi menjadi website nyata."
        },
        en: {
            pageTitle: "Gland Jermano Blessed Siahaan - Portfolio",
            navWorks: "works",
            navAbout: "about",
            navBlog: "blog",
            navContact: "contact",
            emailButton: "email",
            cvButton: "cv",
            videoLabel: "Motion Interaction",
            videoHeading: "Scroll frame interaction",
            semesterLabel: "awal mula",
            semesterHeading: "Cerita Dimulai<br>dari Semester II",
            semesterSideNote: "Not the phase when I learned the most theory, but the phase when I started building the most.",
            semesterParagraph1: "In semester 2, I started doing vibe coding more often. Not because I do not understand flow or logic, but because I learn faster when I turn ideas directly into something real.",
            semesterParagraph2: "I still have a lot of time to explore. That is why I enjoy trying many ideas, seeing the result directly in the browser, and refining them little by little until they become websites that truly feel alive.",
            semesterParagraph3: "Usually, I start by designing the page first. After that, I use AI to help transform the design into code, while still understanding the structure, logic, and how it works.",
            semesterParagraph4: "For me, vibe coding does not mean building carelessly. It is actually my way of learning while building, so every idea can become a real digital experience.",
            semesterProcessLabel: "how i build",
            processTitle1: "Start with an idea",
            processText1: "I start from an idea that I want to turn into something real.",
            processTitle2: "Design the page",
            processText2: "I shape the visual direction and main layout first.",
            processTitle3: "Translate into code",
            processText3: "AI helps transform the design into code that I can study.",
            processTitle4: "Refine and debug",
            processText4: "I refine, test, and fix it until it feels right.",
            toolLabel1: "ai learning tool",
            toolText1: "Helps me survive in IT, learn IT, understand errors, and turn designs or images into code.",
            toolLabel2: "design tool",
            toolText2: "I use it to create landing page designs before entering the coding process.",
            toolLabel3: "editing tool",
            toolText3: "I use it to create logos, icons, and supporting visual assets for the website.",
            toolLabel4: "build mindset",
            toolText4: "My way of learning while building, exploring ideas, and turning inspiration into real websites."
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


