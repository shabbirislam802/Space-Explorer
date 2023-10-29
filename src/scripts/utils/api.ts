import {Article, Planet} from "./interfaces";
import {showError} from "./notification";

export async function fetchNewsAndCreateCards(offset: number) {
    try {
        const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=${offset}`);
        if (!response.ok) {
            showError(response.statusText);
            throw new Error('Netzwerkantwort war nicht ok ' + response.statusText);
        }
        const data = await response.json();
        const articles: Article[] = data.results;

        const cardsContainer = document.querySelector('#app .row') || document.createElement('div');
        cardsContainer.className = 'row';

        articles.forEach((article: Article) => {
            const cardHTML = `
        <div class="col-md-6">
          <div class="card mb-3">
            <img src="${article.image_url}" width="300" height="300" class="card-img-top" alt="${article.title}">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.summary}</p>
              <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${article.id}" aria-expanded="false" aria-controls="collapse${article.id}"> 
                Read more
              </button>
              <div class="collapse" id="collapse${article.id}"> 
                <div class="card card-body">
                  ${article.news_site} <a href="${article.url}" target="_blank">Read full story</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
            cardsContainer.innerHTML += cardHTML;
        });

        if (!document.querySelector('#app .row')) {
            const appElement = document.querySelector('#app');
            if (appElement) {
                appElement.appendChild(cardsContainer);
            } else {
                console.error('Das Element #app wurde nicht gefunden');
            }
        }
    } catch (error: any) {
        showError(error.message || 'Fehler beim Abrufen der Nachrichten');
        console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
}

export async function fetchPlanetData() {
    try {
        const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
        const data = await response.json();
        return data.bodies.filter((body: Planet) => body.isPlanet === true);
    } catch (error: any) {
        showError(error.message || 'Fehler beim Abrufen der Planetendaten');
        console.error('Fehler beim Abrufen der Planetendaten:', error);
        return [];
    }
}