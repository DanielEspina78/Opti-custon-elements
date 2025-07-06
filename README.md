# 🤖 Opti · El copiloto inteligente para tu interfaz web

**Opti** es un bot ligero, semántico y personalizable que se integra directamente a tus páginas web para ayudarte a entender la intención del usuario, interpretar el DOM y ejecutar acciones dinámicamente con la ayuda de IA.

Desarrollado como parte de la visión de **Optimaria**, Opti es tu compañero de interfaz en tiempo real.

---

## 🎥 Demo en YouTube

[![Ver demo en YouTube](https://img.youtube.com/vi/RvQHvCY0iEc/0.jpg)](https://www.youtube.com/watch?v=RvQHvCY0iEc)

---

## 🧠 ¿Qué hace Opti?

- 🔍 Extrae y mapea inputs, selects, botones y otros elementos interactivos.
- 💬 Envía la información al backend junto a consultas en lenguaje natural.
- ⚙️ Recibe instrucciones desde un modelo de IA (como un LLM) y las ejecuta localmente:
  - Autocompleta
  - Hace clics
  - Selecciona opciones, etc.
- 🌐 Funciona con **vanilla JavaScript** y se instala en segundos.

### ✅ Inyección rápida

```html
<script src="opti-bot.js"></script>
<opti-bot></opti-bot>
```
---
🧪 Cómo funciona
El usuario escribe una intención como:
```html
"Completá el número de consolidación y presioná enviar".Opti analiza los elementos interactivos con IDs descriptivos como inputnumeroconsolidacion o botonenviar.
---
🔁 Payload enviado al backend:
{
  "consulta_usuario": "completar el número de consolidación",
  "elementos": [ /* inputs, selects, checks, etc. */ ]
}
---
🔄 Respuesta del backend (IA):
[
  { "action": "fill", "id": "inputnumeroconsolidacion", "value": "ABC123" },
  { "action": "click", "id": "botonenviar" }
]
```
---
🚀 Características
⚡ Cero dependencias: solo JavaScript nativo

🧩 Fácil de integrar en cualquier sitio

🛡️ Seguro: acciona solo sobre elementos permitidos

📦 Ideal para:

Demos interactivas

Asistentes embebidos

Flujos guiados

Automatización de interfaz
---
💡 Inspiración
Opti nace como una combinación entre web scraping, RPA y asistentes inteligentes, pero pensado desde el lado de la UX semántica embebida.

No reemplaza al usuario: lo potencia.

📎 Licencia
MIT, porque creemos en compartir buenas ideas.

