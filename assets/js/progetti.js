/**
 * Renderizza i progetti a partire da progetti.json, divisi in due sezioni
 * fisse: "Attivi" (in alto) e "Conclusi" (in basso). Per aggiungere,
 * modificare o rimuovere un progetto, modifica SOLO progetti.json.
 *
 * Formato di ogni progetto:
 * {
 *   "nome": "Nome del progetto",
 *   "stato": "attivo" | "concluso",
 *   "logo": "image/logo/nome-file.png",
 *   "descrizione": "Breve descrizione mostrata nella card",
 *   "link": "https://... (opzionale: se presente, il bottone porta a questo URL esterno)",
 *   "slug": "nome-breve-senza-spazi (usato per generare la pagina di dettaglio interna)",
 *   "immagini": ["image/logo/foto1.jpg", "image/logo/foto2.jpg"] (opzionale, per il carosello nella pagina di dettaglio)
 * }
 *
 * Se "link" è vuoto/assente ma "slug" è presente, il bottone "Scopri di più"
 * porta automaticamente a progetto.html?slug=<slug>, una pagina generica che
 * mostra descrizione + carosello immagini per quel progetto.
 */
(function () {
  var attiviContainer = document.getElementById('progetti-attivi');
  var conclusiContainer = document.getElementById('progetti-conclusi');
  if (!attiviContainer && !conclusiContainer) return;

  function projectLink(p) {
    if (p.link) return { href: p.link, external: true };
    if (p.slug) return { href: 'progetto.html?slug=' + encodeURIComponent(p.slug), external: false };
    return null;
  }

  function card(p) {
    var link = projectLink(p);
    return (
      '<div class="col-md-6 col-lg-4">' +
      '<div class="card h-100">' +
      (p.logo ? '<div class="project-logo-wrapper"><img src="' + p.logo + '" class="project-logo" alt="' + p.nome + '"></div>' : '') +
      '<div class="card-body">' +
      '<h5 class="card-title">' + p.nome + '</h5>' +
      '<p class="badge ' + (p.stato === 'attivo' ? 'bg-success' : 'bg-secondary') + ' mb-2">' +
      (p.stato === 'attivo' ? 'Attivo' : 'Concluso') + '</p>' +
      '<p class="card-text">' + (p.descrizione || '') + '</p>' +
      (link ? '<a href="' + link.href + '" class="btn btn-sm btn-outline-primary"' + (link.external ? ' target="_blank" rel="noopener"' : '') + '>Scopri di più</a>' : '') +
      '</div></div></div>'
    );
  }

  function render(list, container, emptyMsg) {
    if (!container) return;
    container.innerHTML = list.map(card).join('') ||
      '<p class="text-center text-muted">' + emptyMsg + '</p>';
  }

  fetch('progetti.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var attivi = data.filter(function (p) { return p.stato === 'attivo'; });
      var conclusi = data.filter(function (p) { return p.stato === 'concluso'; });
      render(attivi, attiviContainer, 'Nessun progetto attivo al momento.');
      render(conclusi, conclusiContainer, 'Nessun progetto concluso elencato.');

      // Se la pagina è stata aperta con un'ancora (es. progetti.html#conclusi),
      // scorri fino a quella sezione dopo che il contenuto è stato renderizzato.
      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
    .catch(function (err) {
      console.error(err);
      if (attiviContainer) attiviContainer.innerHTML = '<p class="text-center text-danger">Errore nel caricamento dei progetti.</p>';
      if (conclusiContainer) conclusiContainer.innerHTML = '';
    });

  // Pulsanti di navigazione rapida Tutti / Attivi / Conclusi: scorrono alla sezione
  document.querySelectorAll('.filter-btn[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var target = document.querySelector(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', btn.dataset.target === '#top' ? window.location.pathname : btn.dataset.target);
    });
  });
})();
