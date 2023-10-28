import '../styles/style.css'
/*setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)*/
interface Article {
    title: string;
    description: string;
    urlToImage: string;
    source: {
        id: string;
    };
    content: string;
    url: string;
}

let currentPage = 1;

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentPage++;
        fetchNewsAndCreateCards(currentPage);
    }
});

async function fetchNewsAndCreateCards(page: number) {
    try {
        const response = await fetch(`http://newsapi.org/v2/everything?q=space&apiKey=1650a99552464f888839d27b052bf422&pageSize=10&page=${page}`);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok ' + response.statusText);
        }
        const data = await response.json();
        const articles: Article[] = data.articles;

        const cardsContainer = document.querySelector('#app .row') || document.createElement('div');
        cardsContainer.className = 'row';

        articles.forEach((article: Article) => {
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
                  ${article.content} <a href="${article.url}" target="_blank">Read full story</a>
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

fetchNewsAndCreateCards(currentPage);

