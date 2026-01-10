(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_EVENTOS = `https://opensheet.elk.sh/${SHEET_ID}/eventos`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('eventosContainer');
  const titulo = document.getElementById('tituloEventos');

  if (!container) return;

  // 👉 Título dinámico
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'eventos');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${fila.titulo}`;
      }
    });

  // 👉 Cargar eventos
  fetch(URL_EVENTOS)
    .then(res => res.json())
    .then(data => renderEventos(data))
    .catch(err => console.error(err));

  function renderEventos(data) {
    container.innerHTML = '';

    // 👉 Ordenar por fecha (dd/mm/yyyy)
    data.sort((a, b) => parseFecha(a.FECHA) - parseFecha(b.FECHA));

    data.forEach(e => {
      const card = document.createElement('div');
      card.className = 'sonido-card';

      card.innerHTML = `
        <h2>${e.FECHA}</h2>
        <table class="sonido-table">
          <tbody>
            <tr>
              <th style="width:140px">📍 Lugar</th>
              <td>${e.LUGAR}</td>
            </tr>
            <tr>
              <th>📝 Información</th>
              <td>${e.INFORMACION}</td>
            </tr>
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });
  }

  function parseFecha(fecha) {
    // formato dd/mm/yyyy
    const [d, m, y] = fecha.split('/');
    return new Date(y, m - 1, d);
  }
})();
