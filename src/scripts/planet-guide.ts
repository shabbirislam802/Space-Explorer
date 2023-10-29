import * as bootstrap from 'bootstrap';
import '../styles/style.css'

import {validateForm} from './utils/validation';
import {fetchPlanetData} from "./utils/api";
import {Planet} from "./utils/interfaces";


document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        addPlanetFiltering();
        loadSpaceContent();
    } else {
        showLoginForm();
    }
});

async function loadSpaceContent(): Promise<void> {
    const appDiv = document.querySelector<HTMLDivElement>('#planet-guide-content');
    if (!appDiv) return;

    const planetData = await fetchPlanetData();
    displayPlanets(planetData);
}

function addPlanetFiltering(): void {
    const planetsGuideDiv = document.querySelector<HTMLDivElement>('#planet-guide-filter');
    if (!planetsGuideDiv) return;

    const filterDiv = document.createElement('div');
    filterDiv.className = 'd-flex justify-content-between flex-wrap align-items-center mb-3';
    filterDiv.id = 'filter-block';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for a planet...';
    searchInput.className = 'form-control';
    filterDiv.appendChild(searchInput);

    const favoriteDiv = document.createElement('div');
    favoriteDiv.className = 'form-check form-check-inline mt-2';

    const favoriteCheckbox = document.createElement('input');
    favoriteCheckbox.type = 'checkbox';
    favoriteCheckbox.id = 'favorite-checkbox';
    favoriteCheckbox.className = 'form-check-input';
    favoriteDiv.appendChild(favoriteCheckbox);

    const favoriteLabel = document.createElement('label');
    favoriteLabel.htmlFor = 'favorite-checkbox';
    favoriteLabel.innerText = ' Show only favorites';
    favoriteLabel.className = 'form-check-label';
    favoriteDiv.appendChild(favoriteLabel);

    filterDiv.appendChild(favoriteDiv);

    planetsGuideDiv.prepend(filterDiv);

    searchInput.addEventListener('input', async () => {
        filterAndDisplayPlanets(searchInput, favoriteCheckbox);
    });

    favoriteCheckbox.addEventListener('change', async () => {
        filterAndDisplayPlanets(searchInput, favoriteCheckbox);
    });
}

async function filterAndDisplayPlanets(searchInput: HTMLInputElement, favoriteCheckbox: HTMLInputElement) {
    const query = searchInput.value.toLowerCase();
    const showFavorites = favoriteCheckbox.checked;
    const planetData = await fetchPlanetData();
    const filteredData = planetData.filter((planet: Planet) =>
        planet.englishName.toLowerCase().includes(query) &&
        (!showFavorites || JSON.parse(localStorage.getItem('favorites') || '[]').includes(planet.englishName))
    );
    displayPlanets(filteredData);
}


function displayPlanets(planetData: Planet[]): void {
    const planetsGuideDiv = document.querySelector<HTMLDivElement>('#planet-guide-content');
    if (!planetsGuideDiv) return;
    planetsGuideDiv.innerHTML = '<h2>Planets Guide</h2>';

    planetData.forEach((planet) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';

        // Planeteninformationen
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.innerText = planet.englishName;
        cardBody.appendChild(title);

        const text = document.createElement('p');
        text.className = 'card-text';
        text.innerHTML = `
            Mass: ${planet.mass?.massValue ?? 'N/A'} ${planet.mass?.massExponent ?? ''} kg<br>
            Diameter: ${planet.meanRadius ?? 'N/A'} km<br>
            Density: ${planet.density ?? 'N/A'} g/cm³<br>
            Temperature: ${planet.avgTemp ?? 'N/A'}°C<br>
            Discovered by: ${planet.discoveredBy ?? 'N/A'}<br>
            Discovered on: ${planet.discoveryDate ?? 'N/A'}<br>
            Radius: ${planet.meanRadius ?? 'N/A'} km
        `;
        cardBody.appendChild(text);

        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.innerText = JSON.parse(localStorage.getItem('favorites') || '[]').includes(planet.englishName) ? 'Unfavorite' : 'Favorite';
        button.addEventListener('click', () => toggleFavorite(planet.englishName));
        cardBody.appendChild(button);

        card.appendChild(cardBody);
        planetsGuideDiv.appendChild(card);
    });
}

function toggleFavorite(planetName: string): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(planetName);
    if (index !== -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(planetName);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadSpaceContent();
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

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formValid = validateForm(form);
            if (formValid) {
                sessionStorage.setItem('token', 'access-token');
                closeModal();
                addPlanetFiltering();
                loadSpaceContent();
            }
        });
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function closeModal(): void {
    const modal = document.getElementById('login-modal');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    }
}
