/* =========================================
   UTILS
========================================= */

const searchInput = document.querySelector(".search-box input");
const categoriesPanel = document.querySelector('.categories-panel');
const addGameSection = document.querySelector('#add-game-section');
const addGameForm = document.querySelector('#add-game-form');
const gamesContainer = document.querySelector('.games-container');
const STORAGE_KEY = 'syncGamesAdded';

function getSavedGames() {
    if (typeof localStorage === 'undefined') return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.warn('Erro ao ler jogos salvos:', error);
        return [];
    }
}

function saveGames(games) {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
        console.warn('Erro ao salvar jogos:', error);
    }
}

function addGameToStorage(gameData) {
    const saved = getSavedGames();
    saved.push(gameData);
    saveGames(saved);
}

function loadSavedGames() {
    const savedGames = getSavedGames();
    savedGames.forEach(game => addGameCard(game, false));
}

function getGameCards() {
    return document.querySelectorAll('.game-card');
}

function filterGamesByText(value) {
    getGameCards().forEach(card => {
        const titleEl = card.querySelector('h2');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        card.style.display = title.includes(value) ? 'block' : 'none';
    });
}

function resetFilters() {
    if (searchInput) searchInput.value = '';
    filterGamesByText('');
}

function setupTagFilter(context = document) {
    const tags = context.querySelectorAll('.tags span');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedTag = (tag.textContent || '').toLowerCase();
            getGameCards().forEach(card => {
                const tagsEl = card.querySelector('.tags');
                const cardTags = tagsEl ? tagsEl.textContent.toLowerCase() : '';
                card.style.display = cardTags.includes(selectedTag) ? 'block' : 'none';
            });
        });
    });
}

function buildCategoriesPanel() {
    if (!categoriesPanel) return;
    categoriesPanel.innerHTML = '';
    categoriesPanel.style.display = 'flex';
    categoriesPanel.style.padding = '10px 20px';
    categoriesPanel.style.background = '#fff';
    categoriesPanel.style.borderBottom = '1px solid #ddd';
    categoriesPanel.style.gap = '10px';
    categoriesPanel.style.flexWrap = 'wrap';

    const uniqueTags = new Set();
    document.querySelectorAll('.tags span').forEach(t => uniqueTags.add((t.textContent || '').trim()));

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Todos';
    btnAll.className = 'category-btn';
    btnAll.addEventListener('click', resetFilters);
    categoriesPanel.appendChild(btnAll);

    uniqueTags.forEach(tagName => {
        const b = document.createElement('button');
        b.textContent = tagName;
        b.className = 'category-btn';
        b.addEventListener('click', () => {
            getGameCards().forEach(card => {
                const tagsEl = card.querySelector('.tags');
                const cardTags = tagsEl ? tagsEl.textContent.toLowerCase() : '';
                card.style.display = cardTags.includes(tagName.toLowerCase()) ? 'block' : 'none';
            });
        });
        categoriesPanel.appendChild(b);
    });
}

function hideAddGameSection() {
    if (addGameSection) addGameSection.style.display = 'none';
}

function showAddGameSection() {
    if (addGameSection) {
        if (categoriesPanel) categoriesPanel.style.display = 'none';
        addGameSection.style.display = 'block';
        addGameSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleCategoriesPanel() {
    if (!categoriesPanel) return;
    hideAddGameSection();
    if (categoriesPanel.style.display === 'flex') {
        categoriesPanel.style.display = 'none';
        return;
    }
    buildCategoriesPanel();
}

function createGameCard(data) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.name;
    card.appendChild(img);

    const info = document.createElement('div');
    info.className = 'game-info';

    const title = document.createElement('h2');
    title.textContent = data.name;
    info.appendChild(title);

    const description = document.createElement('p');
    description.textContent = data.description;
    info.appendChild(description);

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';
    data.categories.forEach(tagText => {
        const span = document.createElement('span');
        span.textContent = tagText;
        tagsContainer.appendChild(span);
    });
    info.appendChild(tagsContainer);

    card.appendChild(info);
    return card;
}

function addGameCard(gameData, save = false) {
    const newCard = createGameCard(gameData);
    gamesContainer.appendChild(newCard);
    setupTagFilter(newCard);
    if (save) {
        addGameToStorage(gameData);
    }
    if (categoriesPanel && categoriesPanel.style.display === 'flex') {
        buildCategoriesPanel();
    }
}

function parseTags(value) {
    return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

if (searchInput) {
    searchInput.addEventListener('input', () => {
        filterGamesByText((searchInput.value || '').toLowerCase());
    });
}

if (addGameForm) {
    addGameForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.querySelector('#game-name');
        const imageInput = document.querySelector('#game-image');
        const categoriesInput = document.querySelector('#game-categories');
        const descriptionInput = document.querySelector('#game-description');

        if (!nameInput || !imageInput || !categoriesInput || !descriptionInput) return;

        const name = nameInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const categories = parseTags(categoriesInput.value);
        const description = descriptionInput.value.trim();

        if (!name || !imageUrl || !description || categories.length === 0) {
            alert('Por favor, preencha todos os campos e adicione pelo menos uma categoria.');
            return;
        }

        addGameCard({ name, imageUrl, description, categories }, true);

        nameInput.value = '';
        imageInput.value = '';
        categoriesInput.value = '';
        descriptionInput.value = '';

        alert('Jogo adicionado com sucesso!');
    });
}

setupTagFilter();
loadSavedGames();

window.addEventListener('load', () => {
    console.log('Biblioteca carregada com sucesso!');
});

/* =========================================
   NAVEGAÇÃO DO HEADER
========================================= */

const navLinks = document.querySelectorAll('nav a[data-action]');

if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.dataset.action;

            if (action === 'home') {
                const banner = document.querySelector('.banner');
                if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (action === 'games') {
                hideAddGameSection();
                const games = document.querySelector('.games-container');
                if (games) games.scrollIntoView({ behavior: 'smooth' });
            }

            if (action === 'categories') {
                toggleCategoriesPanel();
            }

            if (action === 'add') {
                showAddGameSection();
            }

            if (action === 'contact') {
                hideAddGameSection();
                const footer = document.querySelector('footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    alert('Para entrar em contato, envie um e-mail para contato@gamelibrary.com');
                }, 600);
            }
        });
    });
}
