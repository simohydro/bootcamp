/**
 * Renderizza le card dei corsi (Teaching) a partire da insegnamenti.json,
 * con un menu a tendina per filtrare per anno accademico.
 * Per aggiungere/modificare/rimuovere un corso, modifica SOLO insegnamenti.json.
 *
 * Formato di ogni corso:
 * {
 *   "anno_accademico": "2025/2026",
 *   "titolo": "Nome del corso",
 *   "docente": "Prof. Nome Cognome",
 *   "cfu": 6,
 *   "corso_laurea": "Laurea Magistrale in ...",
 *   "link": "https://... (pagina ufficiale del corso, opzionale)",
 *   "descrizione": "Testo mostrato sul retro della card, girandola"
 * }
 */
(function () {
  var container = document.getElementById('teaching-courses');
  var yearSelect = document.getElementById('teachingYearFilter');
  if (!container) return;

  var courses = [];

  function courseCard(c) {
    return (
      '<div class="col-md-6 col-lg-4">' +
      '<div class="course-card-container">' +
      '<div class="course-card-inner">' +
      '<div class="course-card-front">' +
      '<div class="course-title">' + c.titolo + '</div>' +
      '<div class="course-meta"><i class="bi bi-person-badge"></i> ' + c.docente + '</div>' +
      '<div class="course-meta"><i class="bi bi-award"></i> ' + c.cfu + ' CFU</div>' +
      '<div class="course-meta"><i class="bi bi-mortarboard"></i> ' + c.corso_laurea + '</div>' +
      '<div class="course-meta"><i class="bi bi-calendar3"></i> A.A. ' + c.anno_accademico + '</div>' +
      '<div class="course-card-footer">' +
      (c.link ? '<a href="' + c.link + '" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary">Scopri di più</a>' : '<span></span>') +
      '<button type="button" class="btn btn-sm btn-flip" aria-label="Mostra descrizione"><i class="bi bi-arrow-repeat"></i></button>' +
      '</div>' +
      '</div>' +
      '<div class="course-card-back">' +
      '<button type="button" class="btn btn-sm btn-flip btn-flip-back" aria-label="Torna indietro"><i class="bi bi-arrow-repeat"></i></button>' +
      '<div class="course-back-title">Descrizione del corso</div>' +
      '<div class="course-back-desc">' + (c.descrizione || '') + '</div>' +
      '</div>' +
      '</div></div></div>'
    );
  }

  function populateYears() {
    if (!yearSelect) return;
    var years = Array.from(new Set(courses.map(function (c) { return c.anno_accademico; })))
      .sort(function (a, b) { return b.localeCompare(a); });
    yearSelect.innerHTML = '<option value="all">Tutti gli anni</option>' +
      years.map(function (y) { return '<option value="' + y + '">' + y + '</option>'; }).join('');
  }

  function render() {
    var selected = yearSelect ? yearSelect.value : 'all';
    var filtered = selected === 'all' ? courses : courses.filter(function (c) { return c.anno_accademico === selected; });
    container.innerHTML = filtered.map(courseCard).join('') ||
      '<p class="text-center text-muted">Nessun corso per l\'anno selezionato.</p>';
  }

  fetch('insegnamenti.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      courses = data;
      populateYears();
      // Seleziona di default l'anno accademico più recente, se presente
      if (yearSelect && yearSelect.options.length > 1) {
        yearSelect.selectedIndex = 1;
      }
      render();
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<p class="text-center text-danger">Errore nel caricamento dei corsi.</p>';
    });

  if (yearSelect) yearSelect.addEventListener('change', render);

  // Solo il pulsante con la freccetta gira la card (fronte o retro)
  container.addEventListener('click', function (e) {
    var flipBtn = e.target.closest('.btn-flip');
    if (!flipBtn) return;
    var card = flipBtn.closest('.course-card-container');
    if (card) card.querySelector('.course-card-inner').classList.toggle('flipped');
  });
})();

