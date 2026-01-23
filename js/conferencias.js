(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const SECCIONES = [
    {
      seccion: 'conferencias',
      url: `https://opensheet.elk.sh/${SHEET_ID}/conferencias`,
      tituloId: 'tituloConferencias',
      containerId: 'conferenciasContainer'
    },
    {
      seccion: 'conferenciasSalida',
      url: `https://opensheet.elk.sh/${SHEET_ID}/conferenciasSalida`,
      tituloId: 'tituloConferenciasSalida',
      containerId: 'conferenciasSalidaContainer'
    }
  ];

  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(titulos => {
      SECCIONES.forEach(sec => {
        setTitulo(titulos, sec.seccion, sec.tituloId);
        cargarConferencias(sec.url, sec.containerId);
      });
    });

  function setTitulo(data, seccion, tituloId) {
    const tituloEl = document.getElementById(tituloId);
    if (!tituloEl) return;

    // 1️⃣ primero buscar la que tenga subtítulo
    let fila = data.find(
      f => f.seccion === seccion && f.subtitulo && f.subtitulo.trim() !== ''
    );

    // 2️⃣ si no hay, usar la genérica
    if (!fila) {
      fila = data.find(f => f.seccion === seccion);
    }

    if (!fila) return;

    tituloEl.innerHTML = `
    <i class="fa-solid fa-microphone"></i>
    ${fila.titulo}
    ${fila.subtitulo ? `<div class="subtitle">${fila.subtitulo}</div>` : ''}
  `;
  }

  function cargarConferencias(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(url)
      .then(res => res.json())
      .then(data => renderConferencias(data, container))
      .catch(err => console.error(err));
  }

  function renderConferencias(data, container) {
    container.innerHTML = '';

    const porFecha = {};

    data.forEach(fila => {
      if (!porFecha[fila.FECHA]) porFecha[fila.FECHA] = [];
      porFecha[fila.FECHA].push(fila);
    });

    Object.keys(porFecha).forEach(fecha => {
      const card = document.createElement('div');
      card.className = 'conferencia-card';

      card.innerHTML = `
        <h2 class="conferencia-fecha">${fecha}</h2>

        <table class="conferencia-table">
          <thead>
            <tr>
              <th>🎤 Orador</th>
              <th>🏛️ Congregación</th>
              <th>📖 Título</th>
              <th>🎵 Canción</th>
            </tr>
          </thead>
          <tbody>
            ${porFecha[fecha].map(c => `
              <tr>
                <td>${c.NOMBRE}</td>
                <td>${c.CONGREGACION}</td>
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
