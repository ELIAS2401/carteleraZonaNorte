(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_ACOMODADORES = `https://opensheet.elk.sh/${SHEET_ID}/acomodadores`;
  const URL_TITULOS      = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('acomodadoresContainer');
  const titulo = document.getElementById('tituloAcomodadores');

  if (!container) return;

  // 👉 Cargar título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'acomodadores');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-people-arrows"></i> ${fila.titulo}`;
      }
    })
    .catch(err => console.error(err));

  // 👉 Cargar datos de acomodadores
  fetch(URL_ACOMODADORES)
    .then(res => res.json())
    .then(data => renderAcomodadores(data))
    .catch(err => console.error(err));

  function renderAcomodadores(data) {
    container.innerHTML = '';

    const porFecha = {};

    data.forEach(fila => {
      if (!porFecha[fila.FECHA]) porFecha[fila.FECHA] = [];
      porFecha[fila.FECHA].push(fila);
    });

    Object.keys(porFecha).forEach(fecha => {
      const card = document.createElement('div');
      card.className = 'sonido-card'; // reutilizamos el mismo estilo

      card.innerHTML = `
        <h2>${fecha}</h2>
        <table class="sonido-table">
          <thead>
            <tr>
              <th>🏛️ Auditorio</th>
              <th>🚪 Puertas</th>
            </tr>
          </thead>
          <tbody>
            ${porFecha[fecha].map(f => `
              <tr>
                <td>${f['AUDITORIO'] || '—'}</td>
                <td>${f.PUERTAS || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });
  }
})();
