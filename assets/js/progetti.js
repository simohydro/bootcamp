/**
 * Renderizza i progetti a partire da progetti.json.
 * Per aggiungere/modificare/rimuovere un progetto, modifica SOLO progetti.json.
 *
 * Formato di ogni progetto:
 * {
 *   "nome": "Nome del progetto",
 *   "stato": "attivo" | "concluso",
 *   "logo": "image/logo/nome-file.png",
 *   "descrizione": "Breve descrizione del progetto",
 *   "link": "https://... (opzionale, pagina/sito del progetto)"
 * }
 *
 * Il filtro Attivi/Tutti e il titolo si basano sul parametro ?filter= nell'URL
 * (tutti | attivi | conclusi), esattamente come prima.
 */
(function () {
  var container = document.getElementById('progetti-container');
  var titleEl = document.getElementById('dynamicTitle');
  if (!container) return;

  var projects = [];

  function card(p) {
    return (
      '<div class="col-md-6 col-lg-4 project-card" data-status="' + p.stato + '">' +
      '<div class="card h-100">' +
      (p.logo ? '<div class="project-logo-wrapper"><img src="' + p.logo + '" class="project-logo" alt="' + p.nome + '"></div>' : '') +
      '<div class="card-body">' +
      '<h5 class="card-title">' + p.nome + '</h5>' +
      '<p class="badge ' + (p.stato === 'attivo' ? 'bg-success' : 'bg-secondary') + ' mb-2">' +
      (p.stato === 'attivo' ? 'Attivo' : 'Concluso') + '</p>' +
      '<p class="card-text">' + (p.descrizione || '') + '</p>' +
      (p.link ? '<a href="' + p.link + '" class="btn btn-sm btn-outline-primary" target="_blank">Scopri di più</a>' : '') +
      '</div></div></div>'
    );
  }

  function currentFilter() {
    var params = new URLSearchParams(window.location.search);
    return params.get('filter') || 'tutti';
  }

  function applyFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    document.querySelectorAll('.project-card').forEach(function (el) {
      var show = filter === 'tutti' ||
        (filter === 'attivi' && el.dataset.status === 'attivo') ||
        (filter === 'conclusi' && el.dataset.status === 'concluso');
      el.classList.toggle('hidden', !show);
    });
    if (titleEl) {
      titleEl.textContent = filter === 'attivi' ? 'Progetti Attivi' :
        filter === 'conclusi' ? 'Progetti Conclusi' : 'Progetti di Ricerca';
    }
  }

  fetch('progetti.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      projects = data;
      container.innerHTML = projects.map(card).join('') ||
        '<p class="text-center text-muted">Nessun progetto disponibile.</p>';
      applyFilter(currentFilter());
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<p class="text-center text-danger">Errore nel caricamento dei progetti.</p>';
    });

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var filter = btn.dataset.filter;
      history.replaceState(null, '', '?filter=' + filter);
      applyFilter(filter);
    });
  });
})();
