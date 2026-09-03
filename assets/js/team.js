/**
 * Renderizza il team a partire da team.json.
 * Per aggiungere/modificare/rimuovere una persona, modifica SOLO team.json.
 *
 * Formato di ogni membro:
 * {
 *   "nome": "Dott. Nome Cognome",
 *   "ruolo": "Ruolo",
 *   "foto": "image/team/foto.jpg",
 *   "descrizione": "Breve bio mostrata sul fronte della card (HTML semplice, es. <br> ammesso)",
 *   "retro_titolo": "Titolo del retro (es. 'Progetti')",
 *   "retro_html": "Contenuto del retro (HTML semplice, link <a> ammessi)",
 *   "email": "nome.cognome@unimib.it",
 *   "linkedin": "https://linkedin.com/in/..."
 * }
 *
 * Formato di ogni studente in "studenti":
 * {
 *   "nome": "...", "ruolo": "...", "descrizione": "...",
 *   "foto": "image/team/....jpg", "email": "..."
 * }
 */
(function () {
  var membersRow = document.getElementById('team-members');
  var studentsRow = document.getElementById('team-students');
  if (!membersRow && !studentsRow) return;

  function memberCard(m) {
    return (
      '<div class="col-12 col-md-6">' +
      '<div class="identity-card-container my-4">' +
      '<div class="identity-card-inner">' +
      '<div class="identity-card-front identity-card">' +
      '<div class="identity-photo"><img src="' + m.foto + '" alt="' + m.nome + '"></div>' +
      '<div class="identity-content">' +
      '<div class="identity-title">' + m.nome + '</div>' +
      '<div class="identity-role">' + m.ruolo + '</div>' +
      '<div class="identity-desc">' + (m.descrizione || '') + '</div>' +
      '</div></div>' +
      '<div class="identity-card-back identity-card"><div>' +
      '<div class="identity-back-title">' + (m.retro_titolo || 'Contatti') + '</div>' +
      '<div class="identity-back-desc">' + (m.retro_html || '') + '</div>' +
      '<div class="identity-back-contacts mt-3">' +
      (m.email ? '<a href="mailto:' + m.email + '" title="Email"><i class="bi bi-envelope"></i></a>' : '') +
      (m.linkedin ? '<a href="' + m.linkedin + '" title="LinkedIn" target="_blank"><i class="bi bi-linkedin"></i></a>' : '') +
      '</div></div></div>' +
      '</div></div></div>'
    );
  }

  function studentCard(s) {
    return (
      '<div class="col">' +
      '<div class="card h-100 shadow">' +
      '<img src="' + s.foto + '" class="card-img-top" alt="' + s.nome + '">' +
      '<div class="card-body">' +
      '<h5 class="card-title">' + s.nome + '</h5>' +
      '<p class="card-subtitle mb-2 text-muted">' + s.ruolo + '</p>' +
      '<p class="card-text">' + (s.descrizione || '') + '</p>' +
      '<div class="d-grid gap-2">' +
      (s.email ? '<a href="mailto:' + s.email + '" class="btn btn-outline-dark"><i class="bi bi-envelope"></i> Contatta</a>' : '') +
      '</div></div></div></div>'
    );
  }

  function initFlip() {
    document.querySelectorAll('.identity-card-container').forEach(function (card) {
      card.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          card.querySelector('.identity-card-inner').classList.toggle('flipped');
        }
      });
      card.addEventListener('mouseover', function () {
        if (window.innerWidth > 768) card.querySelector('.identity-card-inner').classList.add('flipped');
      });
      card.addEventListener('mouseout', function () {
        if (window.innerWidth > 768) card.querySelector('.identity-card-inner').classList.remove('flipped');
      });
    });
  }

  fetch('team.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (membersRow) {
        membersRow.innerHTML = (data.membri || []).map(memberCard).join('');
      }
      if (studentsRow) {
        studentsRow.innerHTML = (data.studenti || []).map(studentCard).join('') ||
          '<p class="text-muted text-center">Nessuno studente attualmente elencato.</p>';
      }
      initFlip();
    })
    .catch(function (err) {
      console.error(err);
      if (membersRow) membersRow.innerHTML = '<p class="text-center text-danger">Errore nel caricamento del team.</p>';
    });
})();
