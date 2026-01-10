(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_CONFERENCIAS = `https://opensheet.elk.sh/${SHEET_ID}/conferencias`;
  const URL_TITULOS      = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('conferenciasContainer');
  const titulo = document.getElementById('tituloConferencias');

  if (!container) return;

  // 👉 Título dinámico
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'conferencias');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-microphone"></i> ${fila.titulo}`;
      }
    });

  // 👉 Cargar conferencias
  fetch(URL_CONFERENCIAS)
    .then(res => res.json())
    .then(data => renderConferencias(data))
    .catch(err => console.error(err));

  function renderConferencias(data) {
    container.innerHTML = '';

    const porFecha = {};

    data.forEach(fila => {
      if (!porFecha[fila.FECHA]) porFecha[fila.FECHA] = [];
      porFecha[fila.FECHA].push(fila);
    });

    Object.keys(porFecha).forEach(fecha => {
      const card = document.createElement('div');
      card.className = 'sonido-card';

      card.innerHTML = `
        <h2>${fecha}</h2>
        <table class="sonido-table">
          <thead>
            <tr>
              <th>🎤 Conferencista</th>
              <th>📖 Título</th>
              <th>🎵 Canción</th>
            </tr>
          </thead>
          <tbody>
            ${porFecha[fecha].map(c => `
              <tr>
                <td>${c.NOMBRE}</td>
                <td>${c.TITULO}</td>
                <td>${c.CANCION || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });
  }
})();
