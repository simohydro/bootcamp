/**
 * Pagina di dettaglio generica per un singolo progetto.
 * Legge lo "slug" dalla querystring (progetto.html?slug=ambra), lo cerca
 * dentro progetti.json e mostra nome, descrizione e un carosello con le
 * immagini elencate in "immagini". Non serve creare una pagina HTML per
 * ogni progetto: basta compilare bene progetti.json.
 */
(function () {
  var root = document.getElementById('progetto-dettaglio');
  if (!root) return;

  function carousel(id, immagini, nome) {
    if (!immagini || immagini.length === 0) {
      return '<p class="text-muted">Nessuna immagine disponibile per questo progetto.</p>';
    }
    var items = immagini.map(function (src, i) {
      return (
        '<div class="carousel-item' + (i === 0 ? ' active' : '') + '">' +
        '<img src="' + src + '" class="d-block w-100 project-carousel-img" alt="' + nome + '">' +
        '</div>'
      );
    }).join('');

    var indicators = immagini.map(function (_, i) {
      return '<button type="button" data-bs-target="#' + id + '" data-bs-slide-to="' + i + '"' +
        (i === 0 ? ' class="active" aria-current="true"' : '') + ' aria-label="Slide ' + (i + 1) + '"></button>';
    }).join('');

    var controls = immagini.length > 1 ? (
      '<button class="carousel-control-prev" type="button" data-bs-target="#' + id + '" data-bs-slide="prev">' +
      '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Precedente</span></button>' +
      '<button class="carousel-control-next" type="button" data-bs-target="#' + id + '" data-bs-slide="next">' +
      '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Successiva</span></button>'
    ) : '';

    return (
      '<div id="' + id + '" class="carousel slide project-carousel" data-bs-ride="carousel">' +
      (immagini.length > 1 ? '<div class="carousel-indicators">' + indicators + '</div>' : '') +
      '<div class="carousel-inner">' + items + '</div>' +
      controls +
      '</div>'
    );
  }

  function render(project) {
    document.title = project.nome + ' - Idrogeologia Ambientale';
    var pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = document.title;

    root.innerHTML =
      '<a href="progetti.html" class="btn btn-sm btn-outline-secondary mb-4"><i class="bi bi-arrow-left"></i> Torna ai progetti</a>' +
      '<div class="row g-5">' +
      '<div class="col-lg-6">' + carousel('progettoCarousel', project.immagini, project.nome) + '</div>' +
      '<div class="col-lg-6">' +
      '<h1>' + project.nome + '</h1>' +
      '<span class="badge ' + (project.stato === 'attivo' ? 'bg-success' : 'bg-secondary') + ' mb-3">' +
      (project.stato === 'attivo' ? 'Attivo' : 'Concluso') + '</span>' +
      '<p class="lead">' + (project.descrizione || '') + '</p>' +
      '</div></div>';
  }

  function renderNotFound(slug) {
    root.innerHTML =
      '<div class="text-center">' +
      '<h1>Progetto non trovato</h1>' +
      '<p class="text-muted">Nessun progetto con identificativo "' + (slug || '') + '" in progetti.json.</p>' +
      '<a href="progetti.html" class="btn btn-outline-primary">Torna ai progetti</a>' +
      '</div>';
  }

  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    renderNotFound();
    return;
  }

  fetch('progetti.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var project = data.find(function (p) { return p.slug === slug; });
      if (project) render(project); else renderNotFound(slug);
    })
    .catch(function (err) {
      console.error(err);
      root.innerHTML = '<p class="text-center text-danger">Errore nel caricamento del progetto.</p>';
    });
})();
