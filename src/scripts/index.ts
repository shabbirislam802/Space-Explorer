import '../styles/style.css'

let currentOffset = 10;

interface Article {
    title: string;
    summary: string;
    image_url: string;
    id: string;
    url: string;
    news_site: string;
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentOffset += 10;
        fetchNewsAndCreateCards(currentOffset);
    }
});

async function fetchNewsAndCreateCards(offset: Number) {
    try {
        const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok ' + response.statusText);
        }
        const data = await response.json();
        const articles: Article[] = data.results;  // geändert von data.articles zu data.docs

        const cardsContainer = document.querySelector('#app .row') || document.createElement('div');
        cardsContainer.className = 'row';

        articles.forEach((article: Article) => {
            const cardHTML = `
        <div class="col-md-6">
          <div class="card mb-3">
            <img src="${article.image_url}" class="card-img-top" alt="${article.title}">  <!-- geändert von urlToImage zu imageUrl -->
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.summary}</p>
              <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${article.id}" aria-expanded="false" aria-controls="collapse${article.id}">  <!-- geändert von source.id zu id -->
                Read more
              </button>
              <div class="collapse" id="collapse${article.id}">  <!-- geändert von source.id zu id -->
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
    } catch (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
}

fetchNewsAndCreateCards(currentOffset);
