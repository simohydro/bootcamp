/**
 * Renderizza la lista pubblicazioni a partire da pubblicazioni.json.
 * Per aggiungere/modificare/rimuovere una pubblicazione, modifica SOLO
 * il file pubblicazioni.json (non serve toccare questo script né l'HTML).
 *
 * Formato di ogni voce in pubblicazioni.json:
 * {
 *   "year": "2025",
 *   "titolo": "...",
 *   "autori": "...",
 *   "rivista": "...",
 *   "keywords": ["...", "..."],
 *   "link": "https://...",
 *   "abstract": "..."
 * }
 */
(function () {
  var listEl = document.getElementById('publications-list');
  var yearFilter = document.getElementById('yearFilter');
  var searchInput = document.getElementById('keywordFilter');
  var searchButton = document.getElementById('searchButton');
  if (!listEl) return;

  var publications = [];

  function cardTemplate(pub, index) {
    var badges = (pub.keywords || [])
      .map(function (k) { return '<span class="badge bg-secondary">' + escapeHtml(k) + '</span>'; })
      .join(' ');
    return (
      '<div class="col-12" data-year="' + escapeHtml(pub.year) + '" data-keywords="' +
      escapeHtml((pub.keywords || []).join(',').toLowerCase()) + '">' +
      '<div class="card card-publication h-100 mb-3">' +
      '<div class="card-body">' +
      '<h5>' + escapeHtml(pub.titolo) + '</h5>' +
      '<p class="text-muted mb-1">' + escapeHtml(pub.autori) + '</p>' +
      '<p class="text-secondary mb-2"><em>' + escapeHtml(pub.rivista) + '</em></p>' +
      '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2">' +
      '<div>' + badges + '</div>' +
      '<div>' +
      (pub.link ? '<a href="' + escapeAttr(pub.link) + '" target="_blank" rel="noopener" class="btn btn-sm btn-primary me-2"><i class="bi bi-link-45deg"></i> Link</a>' : '') +
      (pub.abstract ? '<button class="btn btn-sm btn-outline-primary toggle-abstract" data-target="abstract-' + index + '">View Abstract</button>' : '') +
      '</div></div>' +
      (pub.abstract ? '<div class="abstract-panel mt-3 p-3 rounded" id="abstract-' + index + '" style="display:none;"><h6 class="mb-2">Abstract</h6><p class="mb-0">' + escapeHtml(pub.abstract) + '</p></div>' : '') +
      '</div></div></div>'
    );
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/"/g, '&quot;'); }

  function render(pubs) {
    listEl.innerHTML = pubs.map(cardTemplate).join('') ||
      '<p class="text-center text-muted">Nessuna pubblicazione trovata.</p>';

    listEl.querySelectorAll('.toggle-abstract').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.dataset.target);
        var isOpen = panel.style.display === 'block';
        panel.style.display = isOpen ? 'none' : 'block';
        btn.textContent = isOpen ? 'View Abstract' : 'Hide Abstract';
      });
    });
  }

  function applyFilters() {
    var year = yearFilter ? yearFilter.value : 'all';
    var term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    var filtered = publications.filter(function (pub) {
      var matchYear = year === 'all' || pub.year === year;
      var matchTerm = term === '' || (pub.keywords || []).some(function (k) {
        return k.toLowerCase().includes(term);
      }) || pub.titolo.toLowerCase().includes(term);
      return matchYear && matchTerm;
    });

    // Ordina per anno decrescente
    filtered.sort(function (a, b) { return b.year.localeCompare(a.year); });
    render(filtered);
  }

  fetch('pubblicazioni.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      publications = data;
      applyFilters();
    })
    .catch(function (err) {
      listEl.innerHTML = '<p class="text-center text-danger">Errore nel caricamento delle pubblicazioni.</p>';
      console.error(err);
    });

  if (yearFilter) yearFilter.addEventListener('change', applyFilters);
  if (searchButton) searchButton.addEventListener('click', applyFilters);
  if (searchInput) searchInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') applyFilters();
  });
})();
