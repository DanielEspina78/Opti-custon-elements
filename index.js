function dani() {
  const inputIds = [
    "inputsenor",
    "inputiva",
    "inputcondicionventa",
    "inputvendedor",
    "inputcodigo",
    "inputtotal",
  ];

  const headers = inputIds.map((id) => document.getElementById(id).placeholder);
  const values = inputIds.map((id) => document.getElementById(id).value);

  // Construir tabla con estilos verdes
  let tablaHtml = `
      <table id="tablaGenerada" class="display styled-table" style="width:100%">
        <thead style="background-color: #198754; color: white;">
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${values.map((v) => `<td>${v}</td>`).join("")}
          </tr>
        </tbody>
      </table>
    `;

  document.getElementById("Tabla").innerHTML = tablaHtml;

  // Esperar DOM antes de iniciar DataTable
  setTimeout(() => {
    $("#tablaGenerada").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      },
    });
  }, 0);
}

function ocultarTabla() {
  const tablaContainer = document.getElementById("Tabla");
  if (tablaContainer && tablaContainer.innerHTML.trim() !== "") {
    tablaContainer.style.display = "none";
  }
}

function mostrarTabla() {
  const tablaContainer = document.getElementById("Tabla");
  if (tablaContainer && tablaContainer.innerHTML.trim() !== "") {
    tablaContainer.style.display = "block";
  }
}
