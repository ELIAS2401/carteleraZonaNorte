(() => {
  const SHEET_ID = '1NDxtj4JdcpkumJEXrLWKR4zV5Ke7Vkp85L5Jmb2MpBg';

  // 👉 ruta local o de GitHub (raw)
  const IMG_TERRITORIO = '../territorio.jpg';

  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('territorioContainer');
  const titulo = document.getElementById('tituloTerritorio');

  if (!container) return;

  // 👉 título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'territorio');
      if (fila && titulo) {
        titulo.innerHTML = `
          <i class="fa-solid fa-map-location-dot"></i>
          ${fila.titulo}
        `;
      }
    })
    .catch(err => console.error(err));

  // 👉 mostrar imagen (SIN fetch)
  container.innerHTML = `
    <div class="territorio-card">
      <img
        src="${IMG_TERRITORIO}"
        alt="Mapa del territorio"
        class="territorio-img"
        loading="lazy"
      />
    </div>
  `;
})();
