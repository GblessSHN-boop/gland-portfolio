const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function setStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

contactForm?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const data = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        purpose: formData.get("purpose"),
        message: formData.get("message").trim()
    };

    if (!data.name || !data.email || !data.purpose || !data.message) {
        setStatus("Semua field wajib diisi.", "error");
        return;
    }

    setStatus("Mengirim pesan...", "loading");

    try {
        const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Pesan gagal dikirim.");
        }

        setStatus("Pesan berhasil dikirim.", "success");
        contactForm.reset();
    } catch (error) {
        console.error(error);
        setStatus("Backend belum aktif. Nanti pesan akan dikirim setelah server Python dibuat.", "error");
    }
});