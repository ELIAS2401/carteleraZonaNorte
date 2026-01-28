(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_ANUNCIOS = `https://opensheet.elk.sh/${SHEET_ID}/urls`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('anunciosContainer');
  const titulo = document.getElementById('tituloAnuncios');
  if (!container) return;

  // 👉 título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'anuncios');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${fila.titulo}`;
      }
    });

  // 👉 cargar PDF
  fetch(URL_ANUNCIOS)
    .then(r => r.json())
    .then(data => {
      console.log('DATA PDF:', data);

      const fila = data.find(
        f => f.SECCION?.toLowerCase() === 'anuncios'
      );

      console.log('FILA ANUNCIOS:', fila);

      const pdfUrl = fila?.PDF_URL?.trim();
      console.log('PDF URL:', pdfUrl);

      if (!pdfUrl) return;

      container.innerHTML = `
      <div class="anuncios-card">
        <iframe src="${pdfUrl}" class="pdf-frame"></iframe>
      </div>
    `;
    })
    .catch(err => console.error(err));
})();
