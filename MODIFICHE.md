# Cosa è cambiato

## Nuovi file
- `partials/navbar.html` — il menu di navigazione, ora **uno solo per tutto il sito**
- `partials/footer.html` — il footer, ora **uno solo per tutto il sito**
- `assets/css/style.css` — tutto lo stile del sito in un unico file (nuova veste grafica)
- `assets/js/include.js` — carica navbar e footer in ogni pagina ed evidenzia la voce di menu attiva
- `assets/js/pubblicazioni.js` — genera la pagina pubblicazioni a partire da `pubblicazioni.json`

## Come modificare il sito d'ora in poi

| Vuoi modificare... | Apri questo file |
|---|---|
| Una voce del menu, un link | `partials/navbar.html` |
| Il footer (contatti, copyright) | `partials/footer.html` |
| Colori, font, spaziature, stile di card/bottoni | `assets/css/style.css` |
| Aggiungere/togliere una pubblicazione | `pubblicazioni.json` (nessun HTML da toccare) |
| Il testo di una pagina specifica | Il file `.html` di quella pagina |

Per aggiungere una pubblicazione, apri `pubblicazioni.json` e aggiungi un blocco come questo in cima alla lista:

```json
{
  "year": "2026",
  "titolo": "Titolo dell'articolo",
  "autori": "Cognome, N., Cognome2, N2. (2026)",
  "rivista": "Nome della rivista",
  "keywords": ["parola chiave 1", "parola chiave 2"],
  "link": "https://dx.doi.org/...",
  "abstract": "Testo completo dell'abstract...",
  "abstract_short": "Versione breve (1-2 frasi) mostrata in home."
}
```

## Bug corretti
- Navbar diversa (bianca/scura) e menu diversi tra le pagine → ora identica ovunque
- Link "Education" rotti nel menu di `team.html` (puntavano a `#`)
- `education.html` e `fieldkit.html` non caricavano il JavaScript di Bootstrap: il menu su mobile non si apriva
- HTML non valido in `fieldkit.html` (navbar fuori dal `<body>`, tag `<style>` duplicato)
- Mancavano i tag `meta description` (importanti per SEO/condivisione link)
- `fieldkit.html` e `progetti.html` non avevano footer/contatti

## Cose che NON ho toccato
- I contenuti testuali delle pagine (li ho spostati, non riscritti)
- Le immagini in `image/` — sono piuttosto pesanti (in particolare `image/team`, 3.2MB): se vuoi
  posso comprimerle in un prossimo passaggio per velocizzare il caricamento del sito

## Come pubblicare le modifiche
1. Scompatta lo zip
2. Copia tutto il contenuto dentro il tuo repository locale (sovrascrivendo i file esistenti)
3. `git add . && git commit -m "Refactor: navbar/footer condivisi, CSS unico, pubblicazioni da JSON" && git push`

Se usi GitHub Pages, non serve nessun'altra configurazione: è tutto HTML/CSS/JS statico.
