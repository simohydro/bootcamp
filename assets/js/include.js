/**
 * Carica navbar e footer condivisi da /partials/ e li inietta nella pagina.
 * Per modificare il menu o il footer su TUTTO il sito, basta modificare
 * partials/navbar.html o partials/footer.html: non serve toccare le singole pagine.
 */
(function () {
  function markActiveLink() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#main-nav [data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === current) {
        link.classList.add('active');
      }
    });
  }

  function loadPartial(url, placeholderId, afterInsert) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Impossibile caricare ' + url);
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
        if (afterInsert) afterInsert();
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadPartial('partials/navbar.html', 'navbar-placeholder', markActiveLink);
    loadPartial('partials/footer.html', 'footer-placeholder');
  });
})();
