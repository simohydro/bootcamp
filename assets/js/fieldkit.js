/**
 * Renderizza gli strumenti FieldKit a partire da fieldkit.json.
 * Per aggiungere/modificare/rimuovere uno strumento, modifica SOLO fieldkit.json.
 *
 * Formato di ogni voce:
 * {
 *   "categoria": "acquisizione" | "laboratorio" | (altra categoria a scelta),
 *   "icona": "bi-thermometer-sun"  (nome icona Bootstrap Icons, senza "bi " davanti),
 *   "nome": "Nome dello strumento",
 *   "descrizione": "Breve descrizione",
 *   "modello": "Nome/codice modello"
 * }
 */
(function () {
  var container = document.getElementById('strumenti-container');
  if (!container) return;

  var tools = [];

  function card(t) {
    return (
      '<div class="col-lg-4 col-md-6 strumento" data-category="' + t.categoria + '">' +
      '<div class="card h-100 shadow-sm">' +
      '<div class="card-body text-center">' +
      '<i class="bi ' + t.icona + ' display-4 text-primary mb-3"></i>' +
      '<h5 class="card-title">' + t.nome + '</h5>' +
      '<div class="card-text">' +
      '<p class="text-muted">' + t.descrizione + '</p>' +
      '<hr><small>Modello: ' + t.modello + '</small>' +
      '</div></div></div></div>'
    );
  }

  function render() {
    container.innerHTML = tools.map(card).join('') ||
      '<p class="text-center text-muted">Nessuno strumento disponibile.</p>';
  }

  function initFilters() {
    var buttons = document.querySelectorAll('#filter-buttons button');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        button.classList.add('active');
        var category = button.dataset.category;
        document.querySelectorAll('.strumento').forEach(function (el) {
          el.style.display = (category === 'all' || el.dataset.category === category) ? 'block' : 'none';
        });
      });
    });
  }

  fetch('fieldkit.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      tools = data;
      render();
      initFilters();
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<p class="text-center text-danger">Errore nel caricamento degli strumenti.</p>';
    });
})();
