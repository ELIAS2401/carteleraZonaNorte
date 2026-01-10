(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_GRUPOS  = `https://opensheet.elk.sh/${SHEET_ID}/grupos`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('gruposContainer');
  const titulo = document.getElementById('tituloGrupos');

  if (!container) return;

  // 👉 Título dinámico
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'grupos');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-users"></i> ${fila.titulo}`;
      }
    });

  // 👉 Datos de grupos
  fetch(URL_GRUPOS)
    .then(res => res.json())
    .then(data => renderGrupos(data))
    .catch(err => console.error(err));

  function renderGrupos(data) {
    container.innerHTML = '';

    const porGrupo = {};

    data.forEach(fila => {
      if (!porGrupo[fila.GRUPO]) porGrupo[fila.GRUPO] = [];
      porGrupo[fila.GRUPO].push(fila);
    });

    Object.keys(porGrupo).forEach(grupo => {
      const personas = porGrupo[grupo];

      const card = document.createElement('div');
      card.className = 'sonido-card';

      card.innerHTML = `
        <h2>${grupo} <span style="font-size:.85rem;color:#666">(${personas.length})</span></h2>
        <table class="sonido-table">
          <thead>
            <tr>
              <th>👤 Nombre</th>
              <th>🏷 Roles</th>
            </tr>
          </thead>
          <tbody>
            ${personas.map(p => `
              <tr>
                <td>${p.NOMBRE}</td>
                <td>${formatRoles(p.ROLES)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });

    // 👉 Total general
    const total = data.length;
    const totalDiv = document.createElement('div');
    totalDiv.className = 'sonido-card';
    totalDiv.innerHTML = `
      <h2>Total</h2>
      <p style="text-align:center;font-size:1.2rem;font-weight:600">
        ${total}
      </p>
    `;
    container.appendChild(totalDiv);
  }

  function formatRoles(roles) {
    if (!roles) return '—';

    return roles
      .split(',')
      .map(r => `<span class="rol-badge">${r.trim()}</span>`)
      .join(' ');
  }
})();
