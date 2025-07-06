export async function enviarAOptiBackend(payload) {
  const endpoint = "https://optimaria.com"; // reemplazá con tu URL real

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.statusText}`);
  }

  return await response.json();
}
// Devuelve [{ action, id, value }]
//[{ action: "say", message: "Todo listo para consolidar datos 🔍" }]
//[{action: "show", content: "<table border='1'><tr><th>Viaje</th><td>Mar del Plata</td></tr><tr><th>Fecha</th><td>12/07/2025</td></tr></table>"}]
//[{ action: "click", id: "botonenviar" }]
//[{ action: "fill", id: "inputnumeroconsolidacion", value: "ABC123" }]
//********************************/
