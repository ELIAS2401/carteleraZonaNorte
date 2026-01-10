(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_EXHIBIDORES = `https://opensheet.elk.sh/${SHEET_ID}/exhibidores`;
  const URL_TITULOS     = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('exhibidoresContainer');
  const titulo = document.getElementById('tituloExhibidores');

  if (!container) return;

  // 👉 Título dinámico
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'exhibidores');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-cart-flatbed"></i> ${fila.titulo}`;
      }
    });

  // 👉 Datos principales
  fetch(URL_EXHIBIDORES)
    .then(res => res.json())
    .then(data => renderExhibidores(data))
    .catch(err => console.error(err));

  function renderExhibidores(data) {
    container.innerHTML = '';

    const porDia = {};

    data.forEach(fila => {
      if (!porDia[fila.DIA]) porDia[fila.DIA] = [];
      porDia[fila.DIA].push(fila);
    });

    Object.keys(porDia).forEach(dia => {
      const card = document.createElement('div');
      card.className = 'sonido-card';

      card.innerHTML = `
        <h2>${dia}</h2>
        <table class="sonido-table">
          <thead>
            <tr>
              <th>⏰ Horario</th>
              <th>👥 Hermanos/as</th>
              <th>🛒 Carrito</th>
              <th>📚 Exhibidor</th>
              <th>📍 Lugar</th>
            </tr>
          </thead>
          <tbody>
            ${porDia[dia].map(f => `
              <tr>
                <td>${f.MAÑANA || f.TARDE || '—'}</td>
                <td>
                  ${f.HERMANO_1 || ''}${f.HERMANO_2 ? '<br>' + f.HERMANO_2 : ''}
                </td>
                <td>${f.CAR ? '✔' : '—'}</td>
                <td>${f.EX ? '✔' : '—'}</td>
                <td>${f.LUGAR || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });
  }
})();
