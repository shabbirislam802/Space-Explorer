import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import axios from 'axios';

/*document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)*/
async function fetchNewsAndCreateCards() {
    try {
        // API-Aufruf (ersetzen Sie dies durch den tatsächlichen API-Endpunkt und -Schlüssel)
        const response = await axios.get('https://newsapi.org/v2/everything?q=space&apiKey=1650a99552464f888839d27b052bf422');
        const articles = response.data.articles;

        // Karten erstellen
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'row';

        articles.forEach(article => {
            const cardHTML = `
        <div class="col-md-6">
          <div class="card mb-3">
            <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description}</p>
              <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${article.source.id}" aria-expanded="false" aria-controls="collapse${article.source.id}">
                Read more
              </button>
              <div class="collapse" id="collapse${article.source.id}">
                <div class="card card-body">
                  ${article.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
            cardsContainer.innerHTML += cardHTML;
        });

        document.querySelector('#app').appendChild(cardsContainer);
    } catch (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
}

// Funktion aufrufen
fetchNewsAndCreateCards();
