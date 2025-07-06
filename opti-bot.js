import { enviarAOptiBackend } from "./server.js";

class OptiBot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lastFilename = null;
    this.lastFileType = null;
    this.lastBase64 = null;
    this.createCentralModal();
  }

  connectedCallback() {
    this.render();
    this.icon = this.shadowRoot.querySelector(".opti-icon");
    this.modal = this.shadowRoot.querySelector(".opti-modal");
    this.closeBtn = this.shadowRoot.querySelector(".opti-close");
    this.input = this.shadowRoot.querySelector(".opti-input");
    this.sendBtn = this.shadowRoot.querySelector(".opti-send");
    this.fileInput = this.shadowRoot.querySelector(".opti-file");
    this.body = this.shadowRoot.querySelector(".opti-body");

    this.icon.addEventListener("click", () => {
      const isVisible = this.modal.style.display === "flex";
      this.modal.style.display = isVisible ? "none" : "flex";
    });

    this.closeBtn.addEventListener("click", () => {
      this.modal.style.display = "none";
    });

    this.sendBtn.addEventListener("click", () => this.handleInput());

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleInput();
    });

    this.fileInput.addEventListener("change", (e) =>
      this.handleFile(e.target.files[0])
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.getElementById("opti-preview-modal");
        if (modal) {
          modal.style.display = "none";
          const content = modal.querySelector(".opti-preview-content");
          if (content) content.innerHTML = "";
        }
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .opti-icon {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 56px;
          height: 56px;
          background-image: url('assets/l2-pulpo.png');
          background-size: cover;
          background-position: center;
          border-radius: 50%;
          border: 2px solid #3a4f63;
          cursor: pointer;
          z-index: 10001;
        }

        .opti-modal {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 260px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          display: none;
          flex-direction: column;
          overflow: hidden;
          font-family: sans-serif;
          animation: slideInRight 0.3s ease;
          z-index: 10000;
        }

        .opti-header {
          background-color: #3a4f63;
          color: white;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .opti-title {
          font-weight: bold;
        }

        .opti-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: white;
          cursor: pointer;
        }

        .opti-body {
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
          font-size: 0.9rem;
        }

        .opti-file {
          margin: 10px;
          font-size: 0.9rem;
        }

        .opti-input-box {
          display: flex;
          padding: 10px;
          gap: 6px;
        }

        .opti-input-box input[type="text"] {
          flex: 1;
          padding: 6px;
        }

        .opti-send {
          padding: 6px 10px;
          background-color: #3a4f63;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      </style>

      <div class="opti-icon" title="Hablar con Opti"></div>

      <div class="opti-modal">
        <div class="opti-header">
          <span class="opti-title">Hola 👋 Soy Opti</span>
          <button class="opti-close" title="Cerrar">×</button>
        </div>
        <div class="opti-body">
          <p>¿En qué puedo ayudarte?</p>
        </div>
        <input type="file" class="opti-file" accept=".csv,image/*,application/pdf" />
        <div class="opti-input-box">
          <input type="text" class="opti-input" placeholder="Escribí tu instrucción..." />
          <button class="opti-send">→</button>
        </div>
      </div>
    `;
  }

  handleInput() {
    const text = this.input.value.trim();
    if (!text) return;
    this.body.innerHTML += `<p><strong>Vos:</strong> ${text}</p>`;
    this.input.value = "";

    const payload = {
      prompt: text,
      filename: this.lastFilename,
      type: this.lastFileType,
      content: this.lastBase64,
      elements: this.scanDOM(),
    };

    enviarAOptiBackend(payload)
      .then((actions) => this.runActions(actions))
      .catch((err) => {
        this.body.innerHTML += `<p><strong>Opti:</strong> Error al conectarme con el servidor.</p>`;
        console.error(err);
      });

    this.body.scrollTop = this.body.scrollHeight;
  }

  scanDOM() {
    const elementos = Array.from(document.querySelectorAll("input, button"));

    const descripciones = elementos.map((el) => {
      const tipo = el.tagName.toLowerCase();
      const id = el.id || "(sin id)";
      let detalle = `Tenés un ${tipo}`;

      detalle += ` con id ${id}`;

      if (el.placeholder) {
        detalle += `, cuyo placeholder es ${el.placeholder}`;
      }

      if (el.type) {
        detalle += ` y es de tipo ${el.type}`;
      }

      if (el.value) {
        detalle += `, con valor actual ${el.value}`;
      }

      if (el.onclick || el.getAttribute("onclick")) {
        detalle += `, y tiene una función onclick asociada.`;
      }

      return detalle + ".";
    });

    return descripciones.join("");
  }

  runActions(actions) {
    console.log("🔍 Acciones recibidas:", actions);

    let parsed;

    // Manejo de input tipo string
    if (typeof actions === "string") {
      try {
        parsed = JSON.parse(actions);
        console.log("✅ JSON parseado correctamente.");
      } catch (err) {
        console.error("❌ Error al parsear JSON:", err);
        this.body.innerHTML += `<p><strong>Opti:</strong> No pude interpretar las acciones del backend.</p>`;
        return;
      }
    } else {
      parsed = actions;
    }

    // Validación de array
    if (!Array.isArray(parsed)) {
      console.warn("⚠️ Acciones recibidas no son un array:", parsed);
      this.body.innerHTML += `<p><strong>Opti:</strong> Las acciones no tienen formato válido.</p>`;
      return;
    }

    parsed.forEach((a, i) => {
      if (!a || !a.action) {
        console.warn(`⚠️ Acción inválida en posición ${i}:`, a);
        this.body.innerHTML += `<p><strong>Opti:</strong> Acción no reconocida en el paso ${
          i + 1
        }.</p>`;
        return;
      }

      const el =
        document.getElementById(a.id) || this.shadowRoot.getElementById(a.id);

      switch (a.action) {
        case "fill":
          if (el) {
            el.value = a.value || "";
            this.body.innerHTML += `<p><strong>Opti:</strong> Completé con "${a.value}"</p>`;
          } else {
            console.warn("❌ ID no encontrado para 'fill':", a.id);
            this.body.innerHTML += `<p><strong>Opti:</strong> No encontré el campo para completar.</p>`;
          }
          break;

        case "click":
          if (el) {
            el.click();
            this.body.innerHTML += `<p><strong>Opti:</strong> Hice clic.</p>`;
          } else {
            console.warn("❌ ID no encontrado para 'click':", a.id);
            this.body.innerHTML += `<p><strong>Opti:</strong> No encontré el botón para presionar.</p>`;
          }
          break;

        case "say":
          if (typeof a.message === "string") {
            this.body.innerHTML += `<p><strong>Opti:</strong> ${a.message}</p>`;
          } else {
            console.warn("⚠️ Acción 'say' sin mensaje válido:", a);
            this.body.innerHTML += `<p><strong>Opti:</strong> Quise decirte algo, pero no encontré el mensaje 😅</p>`;
          }
          break;

        case "show":
          this.renderCentralModal(a.content || "<p>(Contenido vacío)</p>");
          this.body.innerHTML += `<p><strong>Opti:</strong> Te mostré contenido.</p>`;
          break;

        default:
          console.warn("⚠️ Acción desconocida:", a.action);
          this.body.innerHTML += `<p><strong>Opti:</strong> No reconozco la acción <code>${a.action}</code>.</p>`;
          break;
      }
    });

    // 🔁 Limpiar datos del archivo (solo se procesan una vez)
    this.lastFilename = null;
    this.lastFileType = null;
    this.lastBase64 = null;
    this.lastCSVtext = null;
    this.lastPDFtext = null;

    this.body.scrollTop = this.body.scrollHeight;
  }

  handleFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const raw = reader.result;
      const base64 = btoa(raw);

      this.lastFilename = file.name;
      this.lastFileType = file.type;
      this.lastBase64 = base64;

      if (file.type === "text/csv") {
        const text = raw;
        this.lastCSVtext = text;

        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const headers = lines[0]?.split(",") || [];
        const bodyRows = lines.slice(1);

        // Construir descripción en lenguaje natural
        const resumen = headers
          .map(
            (h, i) =>
              `• Columna "${h}" con ${bodyRows.length} fila${
                bodyRows.length !== 1 ? "s" : ""
              }`
          )
          .join("<br>");

        // Mostrar en la interfaz
        this.body.innerHTML += `
          <p><strong>Opti:</strong> CSV detectado ✅</p>
          <p><strong>Encabezados:</strong> ${headers.join(", ")}</p>
          <p>${resumen}</p>
        `;
        this.body.scrollTop = this.body.scrollHeight;
      } else if (file.type.startsWith("image/")) {
        this.body.innerHTML += `<p><strong>Opti:</strong> Imagen recibida 🧠📷</p>`;
        this.body.scrollTop = this.body.scrollHeight;
      } else if (file.type === "application/pdf") {
        this.body.innerHTML += `<p><strong>Opti:</strong> PDF cargado 🔍📄</p>`;
        this.body.scrollTop = this.body.scrollHeight;
      } else {
        this.body.innerHTML += `<p><strong>Opti:</strong> Archivo no soportado ❌</p>`;
        this.body.scrollTop = this.body.scrollHeight;
      }
    };

    reader.readAsBinaryString(file);
  }

  createCentralModal() {
    const modal = document.createElement("div");
    modal.id = "opti-preview-modal";
    modal.style = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10002;
    `;

    const content = document.createElement("div");
    content.className = "opti-preview-content";
    content.style = `
      background: white;
      padding: 20px;
      max-width: 90%;
      max-height: 80%;
      overflow: auto;
      border-radius: 12px;
      box-shadow: 0 6px 30px rgba(0,0,0,0.3);
    `;

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Cerrar";
    closeBtn.style = `
      margin-top: 15px;
      padding: 8px 14px;
      background: #3a4f63;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => {
      modal.style.display = "none";
      content.innerHTML = "";
    };

    modal.appendChild(content);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  }

  renderCentralModal(html) {
    const container = document.getElementById("opti-preview-modal");
    const content = container.querySelector(".opti-preview-content");
    content.innerHTML = html;
    container.style.display = "flex";
  }
}

customElements.define("opti-bot", OptiBot);
