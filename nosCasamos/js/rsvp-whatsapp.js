// Número de WhatsApp que recibirá las confirmaciones.
// Formato internacional, solo números, sin "+" ni espacios. Bolivia = 591.
// Ejemplo: 59170000000
const WHATSAPP_NUMBER = "59178238189";

const form = document.getElementById("rsvpForm");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();

    if (!name) {
      alert("Por favor, escribe tu nombre completo.");
      form.elements["name"].focus();
      return;
    }

    const attending = data.get("attending") === "no" ? "no" : "yes";
    const mealSelect = form.elements["meal"];
    const meal = mealSelect.options[mealSelect.selectedIndex].textContent.trim();
    const song = String(data.get("song") || "").trim();
    const note = String(data.get("note") || "").trim();

    const lines = ["Hola Alex y Noelia", ""];

    if (attending === "yes") {
      lines.push("¡Confirmo mi asistencia a la boda!");
      lines.push("Nombre: " + name);
      lines.push("Invitados: " + data.get("guests"));
      lines.push("Menú: " + meal);
      if (song) lines.push("Canción para bailar: " + song);
    } else {
      lines.push("Lamentablemente no podré asistir a la boda.");
      lines.push("Nombre: " + name);
    }

    if (note) lines.push("Nota: " + note);

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });
}
