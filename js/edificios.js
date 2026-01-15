(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_EDIFICIOS = `https://opensheet.elk.sh/${SHEET_ID}/urls`;
  const URL_TITULOS    = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('edificiosContainer');
  const titulo = document.getElementById('tituloEdificios');
  if (!container) return;

  // 👉 título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'edificios');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${fila.titulo}`;
      }
    });

  // 👉 cargar PDF
  fetch(URL_EDIFICIOS)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return;

      const pdfUrl = data[2].PDF_URL;

      container.innerHTML = `
        <div class="territorio-card">
          <iframe 
            src="${pdfUrl}" 
            class="pdf-frame"
            loading="lazy">
          </iframe>
        </div>
      `;
    })
    .catch(err => console.error(err));
})();
