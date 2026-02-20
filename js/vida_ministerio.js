(() => {
  const SHEET_ID = '1NDxtj4JdcpkumJEXrLWKR4zV5Ke7Vkp85L5Jmb2MpBg';

  const urls = {
    base: `https://opensheet.elk.sh/${SHEET_ID}/vida_ministerio`,
    tesoros: `https://opensheet.elk.sh/${SHEET_ID}/TESOROS_DE_LA_BIBLIA`,
    maestros: `https://opensheet.elk.sh/${SHEET_ID}/SEAMOS_MEJORES_MAESTROS`,
    vida: `https://opensheet.elk.sh/${SHEET_ID}/NUESTRA_VIDA_CRISTIANA`,
    finde: `https://opensheet.elk.sh/${SHEET_ID}/FIN_SEMANA`
  };

  const container = document.getElementById('vidaMinisterioContainer');
  const selector = document.getElementById('semanaSelector');
  if (!container || !selector) return;

  let DATA = {};

  Promise.all(Object.entries(urls).map(([k, u]) =>
    fetch(u).then(r => r.json()).then(d => DATA[k] = d)
  )).then(init);

  function init() {
    const semanas = [...new Set(DATA.base.map(x => x.SEMANA))];
    crearBotones(semanas);
    renderSemana(semanas[0]); // primera por defecto
  }

  function crearBotones(semanas) {
    selector.innerHTML = '';
    semanas.forEach(semana => {
      const btn = document.createElement('button');
      btn.textContent = semana;
      btn.onclick = () => renderSemana(semana);
      selector.appendChild(btn);
    });
  }

  function renderSemana(semana) {
    [...selector.children].forEach(b =>
      b.classList.toggle('active', b.textContent === semana)
    );

    const info = DATA.base.find(b => b.SEMANA === semana);
    if (!info) return;

    container.innerHTML = `
      <div class="sonido-card">
        <h2>Semana ${semana}</h2>
        <p><strong>Presidente:</strong> ${info.PRESIDENTE}</p>
        <p><strong>Canción:</strong> ${info.CANCION} – <strong>Oración:</strong> ${info.ORACION_INICIAL}</p>

        ${renderBloque('TESOROS DE LA BIBLIA', DATA.tesoros, semana, 'tesoros')}
        ${renderBloque('SEAMOS MEJORES MAESTROS', DATA.maestros, semana, 'maestros')}
        ${renderBloque('NUESTRA VIDA CRISTIANA', DATA.vida, semana, 'vida')}
        ${renderFinSemana(DATA.finde, semana)}
      </div>
    `;
  }


  function renderBloque(titulo, data, semana, tipo = '') {
    const filas = data.filter(f => f.SEMANA === semana);
    if (!filas.length) return '';

    const iconos = {
      tesoros: '💎',
      maestros: '🌾',
      vida: '🐑'
    };

    // Detectar si hay conductores o lectores cargados
    const hayConductor = filas.some(f => f.CONDUCTOR && f.CONDUCTOR.trim() !== '');
    const hayLector = filas.some(f => f.LECTOR && f.LECTOR.trim() !== '');

    // Cambiar nombre de columna en Maestros
    const nombreLector = tipo === 'maestros' ? 'Ayudante' : 'Lector';

    return `
    <section class="bloque ${tipo}">
      <h3 class="bloque-titulo">
        <span class="icono">${iconos[tipo] || ''}</span>
        ${titulo}
      </h3>

      <table class="sonido-table">
        <thead>
          <tr>
            <th>Tema</th>
            ${hayConductor ? '<th>Conductor</th>' : ''}
            ${hayLector ? `<th>${nombreLector}</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${filas.map(f => `
            <tr>
              <td class="titulo">${f.TITULO || ''}</td>
              ${hayConductor && f.CONDUCTOR && f.CONDUCTOR.trim() !== ''
        ? `<td class="conductor">${f.CONDUCTOR}</td>`
        : hayConductor ? '<td></td>' : ''
      }
              ${hayLector && f.LECTOR && f.LECTOR.trim() !== ''
        ? `<td class="lector">${f.LECTOR}</td>`
        : hayLector ? '<td></td>' : ''
      }
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
  }



  function renderFinSemana(data, semana) {
    const f = data.find(x => x.SEMANA === semana);
    if (!f) return '';

    return `
    <section class="bloque finde">
      <h3 class="bloque-titulo">
        📅 REUNIÓN DE FIN DE SEMANA
      </h3>

      <div class="finde-item">
        <span class="finde-label">Fecha</span>
        <span class="finde-value">${f.FECHA}</span>
      </div>

      <div class="finde-item">
        <span class="finde-label">Presidente</span>
        <span class="finde-value">${f.PRESIDENTE}</span>
      </div>

      <div class="finde-item">
        <span class="finde-label">Lectura Atalaya</span>
        <span class="finde-value">${f.LECTURA_ATALAYA}</span>
      </div>
    </section>
  `;
  }
})();
