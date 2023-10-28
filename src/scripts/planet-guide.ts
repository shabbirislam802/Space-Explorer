import '../styles/style.css'
const API_KEY = 'GN6NdjDnn5zYmh2gZMYDwKsRqI9ahmZ6iQeMeipU ';

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        loadSpaceContent();
    } else {
        showLoginForm();
    }
});

const API_URL = 'https://api.le-systeme-solaire.net/rest/bodies/';

async function fetchPlanetData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data.bodies.filter((body: any) => body.isPlanet === true));
        return data.bodies.filter((body: any) => body.isPlanet === true);
    } catch (error) {
        console.error('Fehler beim Abrufen der Planetendaten:', error);
        return [];
    }
}

async function fetchPlanetImages() {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?count=10&api_key=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Planetenbilder:', error);
        return [];
    }
}

async function loadSpaceContent(): Promise<void> {
    const appDiv = document.querySelector<HTMLDivElement>('#planet-guide');
    if (!appDiv) return;

    // Planets Guide Content
    const planetsGuideDiv = document.createElement('div');
    planetsGuideDiv.id = 'planets-guide';
    planetsGuideDiv.innerHTML = '<h2>Planets Guide</h2>';
    appDiv.appendChild(planetsGuideDiv);

    const planetData = await fetchPlanetData();
    const planetImages = await fetchPlanetImages();

    displayPlanets(planetData, planetImages);
}

async function addPlanetFiltering(): Promise<void> {
    const planetsGuideDiv = document.querySelector<HTMLDivElement>('#planets-guide');
    if (!planetsGuideDiv) return;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for a planet...';
    planetsGuideDiv.appendChild(searchInput);

    searchInput.addEventListener('input', async (event) => {
        const query = (event.target as HTMLInputElement).value.toLowerCase();
        const planetData = await fetchPlanetData();
        const filteredData = planetData.filter(photo => photo.rover.name.toLowerCase().includes(query));  // Annahme: Datenstruktur basierend auf dem API-Endpunkt
        displayPlanets(filteredData);
    });
}

function displayPlanets(planetData: any[], planetImages: any[]): void {
    const planetsGuideDiv = document.querySelector<HTMLDivElement>('#planets-guide');
    if (!planetsGuideDiv) return;

    planetsGuideDiv.innerHTML = '';  // Löschen des vorhandenen Inhalts (wenn vorhanden)

    planetData.forEach((planet, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const carouselId = `carousel${index}`;

        // Karussell für Planetenbilder
        const carousel = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${planetImages.map((image, idx) => `
                        <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                            <img src="${image.url}" class="d-block w-100" alt="${planet.englishName} image ${idx + 1}">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;

        // Planeteninformationen
        const cardBody = `
            <div class="card-body">
                <h5 class="card-title">${planet.englishName}</h5>
                <p class="card-text">Mass: ${planet.mass.massValue} ${planet.mass.massExponent} kg, Diameter: ${planet.meanRadius} km</p>
            </div>
        `;

        card.innerHTML = carousel + cardBody;
        planetsGuideDiv.appendChild(card);
    });
}

function addPlanetToFavorites(planetName: string): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(planetName)) {
        favorites.push(planetName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removePlanetFromFavorites(planetName: string): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(planetName);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function showLoginForm(): void {
    let modal = document.getElementById('login-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.className = 'modal fade';
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Access Form</h5>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="mb-3 row">
                            <label for="username" class="col-sm-2 col-form-label">Username </label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="username" name="username" required>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="email" class="col-sm-2 col-form-label">Email </label>
                            <div class="col-sm-10">
                                <input type="email" class="form-control" id="email" name="email" required>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="password" class="col-sm-2 col-form-label">Password </label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="password" name="password" required minlength="8">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    `;

        document.body.appendChild(modal);
    }

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        if (username && validateEmail(email) && password.length >= 8) {
            sessionStorage.setItem('token', 'aksdGsasda12mvw123');  // Set a token value
            closeModal();
            loadSpaceContent();
        } else {
            alert('Please enter valid information.');
        }
    });

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}


function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function closeModal(): void {
    const modal = document.getElementById('login-modal');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
    }
}
