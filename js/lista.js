/* =========================================
   UTILS
========================================= */

const searchInput = document.querySelector(".search-box input");
const categoriesPanel = document.querySelector('.categories-panel');
const addGameSection = document.querySelector('#add-game-section');
const manageGamesSection = document.querySelector('#manage-games-section');
const manageGamesList = document.querySelector('#manage-games-list');
const editGameForm = document.querySelector('#edit-game-form');
const gameDetailSection = document.querySelector('#game-detail-section');
const detailContent = document.querySelector('#detail-content');
const backToGamesButton = document.querySelector('#back-to-games');
const gamesContainer = document.querySelector('.games-container');
const addGameForm = document.querySelector('#add-game-form');
const themeToggleButton = document.querySelector('#theme-toggle');
const categoryToggleButton = document.querySelector('#category-toggle');
const STORAGE_KEY = 'syncGamesAdded';
const defaultGamesGrid = document.querySelector('#default-games-grid');

const defaultGames = [
    {
        id: 'resident-evil-4',
        name: 'Resident Evil 4',
        imageUrl: 'https://media.senscritique.com/media/000021509526/0/resident_evil_4.png',
        gallery: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPjJIuIq54wcW2n1UyrqXj8r_B35R6bzOB-A&s',
            'https://assets-prd.ignimgs.com/2023/03/22/resident-evil-4-header-1679522230670.jpg'
        ],
        description: 'Leon Kennedy é enviado para resgatar a filha do presidente em uma vila dominada por uma ameaça sombria. Entre criaturas perigosas e ação intensa, ele luta para sobreviver e descobrir a verdade.',
        categories: ['Ação', 'Terror', 'Sobrevivência'],
        releaseDate: '2023-03-09',
        price: 59.99
    },
    {
        id: 'minecraft',
        name: 'Minecraft',
        imageUrl: 'https://preview.redd.it/what-is-the-java-edition-seed-for-minecrafts-cover-art-v0-alwc1nswqdw51.png?width=767&format=png&auto=webp&s=4d67aab7260383ca7b48bc5d5e8a0916dccdc2b3',
        gallery: [
            'https://preview.redd.it/what-is-the-java-edition-seed-for-minecrafts-cover-art-v0-alwc1nswqdw51.png?width=767&format=png&auto=webp&s=4d67aab7260383ca7b48bc5d5e8a0916dccdc2b3'
        ],
        description: 'Os jogadores exploram um mundo aberto feito de blocos, podendo construir, minerar e sobreviver. O jogo mistura criatividade, aventura e exploração em diferentes modos de jogo.',
        categories: ['Sandbox', 'Construção', 'Online'],
        releaseDate: '2011-11-18',
        price: 26.99
    },
    {
        id: 'valorant',
        name: 'Valorant',
        imageUrl: 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S2_1200x1600-5b905ef8bbc4437fb4388ba8aa1f958d',
        description: 'Equipes de agentes com habilidades únicas se enfrentam em partidas táticas de tiro 5v5. O jogo combina estratégia, precisão e poderes especiais em combates competitivos intensos.',
        categories: ['FPS', 'Competitivo', 'Online'],
        releaseDate: '2020-06-02',
        price: 0.00
    },
    {
        id: 'silent-hill-2',
        name: 'Silent Hill 2',
        imageUrl: 'https://midias.em.com.br/_midias/jpg/2024/10/04/520x405/1_silent_hill_2_remake-40442944.jpg?20241004175310?20241004175310',
        description: 'James retorna à cidade de Silent Hill após receber uma carta de sua esposa falecida. Entre monstros e mistérios, ele enfrenta seus próprios traumas psicológicos.',
        categories: ['Survival Horror', 'Terror', 'Suspense'],
        releaseDate: '2024-10-02',
        price: 69.99
    },
    {
        id: 'dead-by-daylight',
        name: 'Dead by Daylight',
        imageUrl: 'https://tm.ibxk.com.br/2022/02/16/16171456629489.jpg',
        gallery: [
            'https://tm.ibxk.com.br/2022/02/16/16171456629489.jpg',
            'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg'
        ],
        description: 'Quatro sobreviventes tentam escapar de um assassino implacável em partidas de terror multiplayer. Cada jogo mistura estratégia, perseguição e sobrevivência em cenários sombrios.',
        categories: ['Terror', 'Multiplayer', 'Sobrevivência'],
        releaseDate: '2016-06-14',
        price: 19.99
    },
    {
        id: 'resident-evil-requiem',
        name: 'Resident Evil Requiem',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfyM2nYwjWN4X2alFe97ikNPYMuVPLX6Y07g&s',
        description: 'Uma nova ameaça biológica coloca sobreviventes diante de horrores e conspirações mortais. Em meio ao caos, eles precisam lutar para descobrir a verdade e sobreviver.',
        categories: ['Survival Horror', 'Terror', 'Ação'],
        releaseDate: '2021-05-07',
        price: 49.99
    }
];

function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `game-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

let selectedCategories = [];
let currentSearch = '';

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

function updateGameInStorage(gameData) {
    const saved = getSavedGames();
    const updatedGames = saved.map(game => game.id === gameData.id ? gameData : game);
    saveGames(updatedGames);
}

function removeGameFromStorage(gameId) {
    const saved = getSavedGames();
    const updatedGames = saved.filter(game => game.id !== gameId);
    saveGames(updatedGames);
}

function initializeLibrary() {
    const savedGames = getSavedGames();
    // Não salvamos os jogos padrão automaticamente — apenas retornamos os jogos salvos pelo usuário.
    // Isso mantém as abas "Início" e "Jogos" vazias até que o usuário adicione jogos.
    if (!savedGames || savedGames.length === 0) {
        return [];
    }

    // Se houver jogos salvos, tentamos mesclar dados faltantes com as entradas padrão (se houver correspondência por id).
    const defaultMap = new Map(defaultGames.map(game => [game.id, game]));
    let migrated = false;

    const normalizedGames = savedGames.map(game => {
        const defaultGame = defaultMap.get(game.id);
        if (!defaultGame) return game;

        const merged = { ...defaultGame, ...game };
        if (!game.gallery && defaultGame.gallery) {
            merged.gallery = defaultGame.gallery;
            migrated = true;
        }
        return merged;
    });

    if (migrated) {
        saveGames(normalizedGames);
    }

    return normalizedGames;
}

function loadSavedGames() {
    const savedGames = initializeLibrary();
    gamesContainer.innerHTML = '';

    if (savedGames && savedGames.length) {
        savedGames.forEach(game => addGameCard(game, false));
    } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-library-message';
        emptyMessage.textContent = 'Sua biblioteca está vazia. Vá para a aba "Adicionar" e inclua os jogos que deseja.';
        gamesContainer.appendChild(emptyMessage);
    }

    renderManageList();
}

function hideDefaultGamesSection() {
    // Não há uma seção separada de jogos padrão além da aba Adicionar,
    // então deixamos esta função como no-op para compatibilidade.
}

function showDefaultGamesSection() {
    showAddGameSection();
}

function renderDefaultGamesInAddSection() {
    if (!defaultGamesGrid) return;
    defaultGamesGrid.innerHTML = '';

    const savedIds = new Set(getSavedGames().map(game => game.id));

    defaultGames.forEach(game => {
        const item = document.createElement('div');
        item.className = 'default-game-item';

        const card = createGameCard(game);
        item.appendChild(card);

        const btn = document.createElement('button');
        btn.className = 'add-default-btn';
        const isSaved = savedIds.has(game.id);
        btn.textContent = isSaved ? 'Remover da minha biblioteca' : 'Adicionar à minha biblioteca';

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const saved = getSavedGames();
            const currentlySaved = saved.some(g => g.id === game.id);

            if (currentlySaved) {
                removeGameFromStorage(game.id);
                removeGameCardById(game.id);
                renderManageList();
                renderDefaultGamesInAddSection();
                alert('Jogo removido da sua biblioteca!');
                return;
            }

            addGameCard(game, true);
            renderManageList();
            renderDefaultGamesInAddSection();
            alert('Jogo adicionado à sua biblioteca!');
        });

        item.appendChild(btn);
        defaultGamesGrid.appendChild(item);
    });
}

function getGameCards() {
    return document.querySelectorAll('.game-card');
}

function filterGamesByText(value) {
    currentSearch = (value || '').toLowerCase();
    applyFilters();
}

function resetFilters() {
    currentSearch = '';
    selectedCategories = [];
    if (searchInput) searchInput.value = '';
    applyFilters();
    highlightActiveCategory();
}

function filterGamesByCategory(category) {
    const normalized = category ? category.toLowerCase() : null;
    if (!normalized) {
        selectedCategories = [];
    } else {
        const index = selectedCategories.indexOf(normalized);
        if (index === -1) {
            selectedCategories.push(normalized);
        } else {
            selectedCategories.splice(index, 1);
        }
    }
    applyFilters();
    highlightActiveCategory();
}

function applyFilters() {
    getGameCards().forEach(card => {
        const titleEl = card.querySelector('h2');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const cardCategories = card.dataset.categories ? card.dataset.categories.split('|') : [];

        const matchesText = !currentSearch || title.includes(currentSearch);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.every(category => cardCategories.includes(category));
        card.style.display = (matchesText && matchesCategory) ? 'block' : 'none';
    });
}

function highlightActiveCategory() {
    const buttons = categoriesPanel.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        const value = btn.dataset.category;
        if (!value) {
            btn.classList.toggle('active', selectedCategories.length === 0);
            return;
        }
        btn.classList.toggle('active', selectedCategories.includes(value.toLowerCase()));
    });
}

function setupTagFilter(context = document) {
    const tags = context.querySelectorAll('.tags span');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedTag = (tag.textContent || '').trim();
            filterGamesByCategory(selectedTag);
            if (categoriesPanel.classList.contains('active')) {
                highlightActiveCategory();
            }
        });
    });
}

function buildCategoriesPanel() {
    if (!categoriesPanel) return;
    categoriesPanel.classList.add('active');
    categoriesPanel.innerHTML = '';

    const title = document.createElement('span');
    title.className = 'category-panel-title';
    title.textContent = 'Filtrar por categoria';
    categoriesPanel.appendChild(title);

    const uniqueTags = new Set();
    document.querySelectorAll('.tags span').forEach(t => uniqueTags.add((t.textContent || '').trim()));

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Todos';
    btnAll.className = 'category-btn';
    btnAll.dataset.category = '';
    btnAll.addEventListener('click', resetFilters);
    categoriesPanel.appendChild(btnAll);

    Array.from(uniqueTags)
        .sort((a,b) => a.localeCompare(b, 'pt-BR'))
        .forEach(tagName => {
            const b = document.createElement('button');
            b.textContent = tagName;
            b.className = 'category-btn';
            b.dataset.category = tagName;
            b.addEventListener('click', () => filterGamesByCategory(tagName));
            categoriesPanel.appendChild(b);
        });

    highlightActiveCategory();
}

function hideAddGameSection() {
    if (addGameSection) addGameSection.style.display = 'none';
}

function hideManageGamesSection() {
    if (manageGamesSection) manageGamesSection.style.display = 'none';
}

function showAddGameSection() {
    if (addGameSection) {
        if (categoriesPanel) categoriesPanel.classList.remove('active');
        if (manageGamesSection) manageGamesSection.style.display = 'none';
        if (gameDetailSection) gameDetailSection.style.display = 'none';
        if (gamesContainer) gamesContainer.style.display = 'none';
        addGameSection.style.display = 'block';
        addGameSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function setTheme(theme) {
    const root = document.body;
    if (!root) return;
    root.classList.toggle('dark-theme', theme === 'dark');
    if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
        themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    }
    try {
        localStorage.setItem('syncTheme', theme);
    } catch (error) {
        console.warn('Não foi possível salvar o tema:', error);
    }
}

function loadTheme() {
    let theme = 'light';
    try {
        theme = localStorage.getItem('syncTheme') || theme;
    } catch (error) {
        console.warn('Não foi possível ler o tema salvo:', error);
    }
    if (!localStorage.getItem('syncTheme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }
    setTheme(theme);
}

function hideDetailSection() {
    if (gameDetailSection) gameDetailSection.style.display = 'none';
    if (gamesContainer) gamesContainer.style.display = '';
}

function showGameDetail(gameId) {
    if (!detailContent || !gameDetailSection || !gamesContainer) return;
    const allGames = [...getSavedGames(), ...defaultGames];
    const game = allGames.find(item => item.id === gameId);
    if (!game) return;

    if (addGameSection) addGameSection.style.display = 'none';
    if (manageGamesSection) manageGamesSection.style.display = 'none';
    hideDefaultGamesSection();
    gamesContainer.style.display = 'none';

    const minReqList = (game.requirements && Array.isArray(game.requirements.min)) ? game.requirements.min.map(r => `<li>${r}</li>`).join('') : '';
    const recReqList = (game.requirements && Array.isArray(game.requirements.recommended)) ? game.requirements.recommended.map(r => `<li>${r}</li>`).join('') : '';

    detailContent.innerHTML = `
        <div class="detail-card">
            <div class="detail-image-wrapper">
                <img id="detail-main-image" src="${game.imageUrl}" alt="${game.name}">
            </div>
            <div class="detail-info">
                <h2>${game.name}</h2>
                <p class="detail-meta"><strong>Lançamento:</strong> ${game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                <p class="detail-meta"><strong>Preço médio:</strong> ${typeof game.price === 'number' ? (game.price === 0 ? 'Grátis' : 'R$ ' + game.price.toFixed(2).replace('.', ',')) : 'Não informado'}</p>
                <p class="detail-description">${game.description}</p>
                <div class="detail-tags">${game.categories.map(cat => `<span>${cat}</span>`).join('')}</div>

                <section class="requirements-section">
                    <h3>Requisitos do Sistema</h3>
                    <div class="requirements-box">
                        <div class="req-col min">
                            <h4>Mínimos</h4>
                            ${minReqList ? `<ul class="req-list">${minReqList}</ul>` : '<p class="req-empty">Não informado</p>'}
                        </div>
                        <div class="req-col rec">
                            <h4>Recomendados</h4>
                            ${recReqList ? `<ul class="req-list">${recReqList}</ul>` : '<p class="req-empty">Não informado</p>'}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    gameDetailSection.style.display = 'block';
    gameDetailSection.scrollIntoView({ behavior: 'smooth' });
}

function showManageGamesSection() {
    if (!manageGamesSection) return;
    if (categoriesPanel) categoriesPanel.classList.remove('active');
    if (addGameSection) addGameSection.style.display = 'none';
    if (gameDetailSection) gameDetailSection.style.display = 'none';
    if (gamesContainer) gamesContainer.style.display = 'none';
    manageGamesSection.style.display = 'block';
    renderManageList();
    manageGamesSection.scrollIntoView({ behavior: 'smooth' });
}

function createGameCard(data) {
    const card = document.createElement('div');
    card.className = 'game-card';
    if (data.id) {
        card.dataset.gameId = data.id;
    }

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
    card.dataset.categories = data.categories.map(tag => tag.toLowerCase().trim()).join('|');

    card.appendChild(info);

    card.addEventListener('click', (event) => {
        if (event.target.closest('.tags span')) {
            return;
        }
        showGameDetail(data.id);
    });

    return card;
}

function addGameCard(gameData, save = false) {
    if (!gameData.id) {
        gameData.id = generateId();
    }

    const existingEmptyMessage = gamesContainer.querySelector('.empty-library-message');
    if (existingEmptyMessage) {
        existingEmptyMessage.remove();
    }

    const newCard = createGameCard(gameData);
    gamesContainer.appendChild(newCard);
    setupTagFilter(newCard);
    if (save) {
        addGameToStorage(gameData);
        renderManageList();
    }
    if (categoriesPanel && categoriesPanel.classList.contains('active')) {
        buildCategoriesPanel();
    }
}

function parseTags(value) {
    return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

function clearEditForm() {
    if (!editGameForm) return;
    editGameForm.reset();
    editGameForm.style.display = 'none';
    delete editGameForm.dataset.editing;
}

function showEditForm(gameData) {
    if (!editGameForm) return;

    const nameInput = document.querySelector('#edit-game-name');
    const imageInput = document.querySelector('#edit-game-image');
    const categoriesInput = document.querySelector('#edit-game-categories');
    const releaseDateInput = document.querySelector('#edit-game-release-date');
    const priceInput = document.querySelector('#edit-game-price');
    const descriptionInput = document.querySelector('#edit-game-description');

    if (!nameInput || !imageInput || !categoriesInput || !releaseDateInput || !priceInput || !descriptionInput) return;

    nameInput.value = gameData.name;
    imageInput.value = gameData.imageUrl;
    categoriesInput.value = gameData.categories.join(', ');
    releaseDateInput.value = gameData.releaseDate || '';
    priceInput.value = typeof gameData.price === 'number' ? gameData.price : '';
    descriptionInput.value = gameData.description;
    const editMin = document.querySelector('#edit-game-min-req');
    const editRec = document.querySelector('#edit-game-rec-req');
    if (editMin) editMin.value = (gameData.requirements && Array.isArray(gameData.requirements.min)) ? gameData.requirements.min.join('\n') : '';
    if (editRec) editRec.value = (gameData.requirements && Array.isArray(gameData.requirements.recommended)) ? gameData.requirements.recommended.join('\n') : '';
    editGameForm.dataset.editing = gameData.id;
    editGameForm.style.display = 'block';
    editGameForm.scrollIntoView({ behavior: 'smooth' });
}

function updateSavedCard(gameData) {
    const card = document.querySelector(`.game-card[data-game-id="${gameData.id}"]`);
    if (!card) return;

    const img = card.querySelector('img');
    const title = card.querySelector('h2');
    const description = card.querySelector('p');
    const tagsContainer = card.querySelector('.tags');

    if (img) img.src = gameData.imageUrl;
    if (img) img.alt = gameData.name;
    if (title) title.textContent = gameData.name;
    if (description) description.textContent = gameData.description;

    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        gameData.categories.forEach(tagText => {
            const span = document.createElement('span');
            span.textContent = tagText;
            tagsContainer.appendChild(span);
        });
        setupTagFilter(card);
    }
}

function removeGameCardById(gameId) {
    const card = document.querySelector(`.game-card[data-game-id="${gameId}"]`);
    if (card) {
        card.remove();
    }
}

function renderManageList() {
    if (!manageGamesList) return;

    const savedGames = getSavedGames();
    manageGamesList.innerHTML = '';

    if (savedGames.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Você ainda não adicionou nenhum jogo. Use a aba "Adicionar" para incluir seus jogos.';
        empty.style.color = '#555';
        manageGamesList.appendChild(empty);
        clearEditForm();
        return;
    }

    savedGames.forEach(game => {
        const card = document.createElement('article');
        card.className = 'manage-card';

        const img = document.createElement('img');
        img.src = game.imageUrl;
        img.alt = game.name;
        card.appendChild(img);

        const details = document.createElement('div');
        details.className = 'manage-card-details';

        const title = document.createElement('h3');
        title.textContent = game.name;
        details.appendChild(title);

        const categories = document.createElement('p');
        categories.textContent = `Categorias: ${game.categories.join(', ')}`;
        details.appendChild(categories);

        const description = document.createElement('p');
        description.textContent = game.description;
        details.appendChild(description);

        card.appendChild(details);

        const actions = document.createElement('div');
        actions.className = 'manage-actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => showEditForm(game));

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => {
            const confirmRemove = confirm(`Deseja remover o jogo "${game.name}"?`);
            if (!confirmRemove) return;
            removeGameFromStorage(game.id);
            removeGameCardById(game.id);
            renderManageList();
            renderDefaultGamesInAddSection();
            if (categoriesPanel && categoriesPanel.classList.contains('active')) {
                buildCategoriesPanel();
            }
            alert('Jogo removido com sucesso!');
        });

        actions.appendChild(editBtn);
        actions.appendChild(removeBtn);
        card.appendChild(actions);
        manageGamesList.appendChild(card);
    });
}

function initializeEditForm() {
    if (!editGameForm) return;

    editGameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const gameId = editGameForm.dataset.editing;
        if (!gameId) return;

        const nameInput = document.querySelector('#edit-game-name');
        const imageInput = document.querySelector('#edit-game-image');
        const categoriesInput = document.querySelector('#edit-game-categories');
        const releaseDateInput = document.querySelector('#edit-game-release-date');
        const priceInput = document.querySelector('#edit-game-price');
        const descriptionInput = document.querySelector('#edit-game-description');

        if (!nameInput || !imageInput || !categoriesInput || !releaseDateInput || !priceInput || !descriptionInput) return;

        const name = nameInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const categories = parseTags(categoriesInput.value);
        const releaseDate = releaseDateInput.value;
        const price = parseFloat(priceInput.value);
        const description = descriptionInput.value.trim();

        const editMinInput = document.querySelector('#edit-game-min-req');
        const editRecInput = document.querySelector('#edit-game-rec-req');
        const editMin = editMinInput ? editMinInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];
        const editRec = editRecInput ? editRecInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];
            const minReqInput = document.querySelector('#game-min-req');
            const recReqInput = document.querySelector('#game-rec-req');
            const minReq = minReqInput ? minReqInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];
            const recReq = recReqInput ? recReqInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];

        if (!name || !imageUrl || !description || categories.length === 0 || !releaseDate || Number.isNaN(price)) {
            alert('Por favor, preencha todos os campos e adicione pelo menos uma categoria.');
            return;
        }

        const updatedGame = { id: gameId, name, imageUrl, categories, description, releaseDate, price, requirements: { min: editMin, recommended: editRec } };
        updateGameInStorage(updatedGame);
        updateSavedCard(updatedGame);
        renderManageList();
        clearEditForm();
        alert('Jogo atualizado com sucesso!');
    });

    const cancelButton = document.querySelector('#cancel-edit');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            clearEditForm();
        });
    }
}

initializeEditForm();

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
        const releaseDateInput = document.querySelector('#game-release-date');
        const priceInput = document.querySelector('#game-price');
        const descriptionInput = document.querySelector('#game-description');

        if (!nameInput || !imageInput || !categoriesInput || !releaseDateInput || !priceInput || !descriptionInput) return;

        const name = nameInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const categories = parseTags(categoriesInput.value);
        const releaseDate = releaseDateInput.value;
        const price = parseFloat(priceInput.value);
        const description = descriptionInput.value.trim();

        // Requisitos (mínimos/recomendados) do formulário de adição
        const minReqInput = document.querySelector('#game-min-req');
        const recReqInput = document.querySelector('#game-rec-req');
        const minReq = minReqInput ? minReqInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];
        const recReq = recReqInput ? recReqInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];

        if (!name || !imageUrl || !description || categories.length === 0 || !releaseDate || Number.isNaN(price)) {
            alert('Por favor, preencha todos os campos e adicione pelo menos uma categoria.');
            return;
        }
        addGameCard({ name, imageUrl, description, categories, releaseDate, price, requirements: { min: minReq, recommended: recReq } }, true);

        nameInput.value = '';
        imageInput.value = '';
        categoriesInput.value = '';
        releaseDateInput.value = '';
        priceInput.value = '';
        descriptionInput.value = '';
        if (minReqInput) minReqInput.value = '';
        if (recReqInput) recReqInput.value = '';

        alert('Jogo adicionado com sucesso!');
    });
}

setupTagFilter();
loadSavedGames();
renderDefaultGamesInAddSection();
loadTheme();

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

if (categoryToggleButton) {
    categoryToggleButton.addEventListener('click', () => {
        if (!categoriesPanel) return;
        if (categoriesPanel.classList.contains('active')) {
            categoriesPanel.classList.remove('active');
        } else {
            buildCategoriesPanel();
            categoriesPanel.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (backToGamesButton) {
    backToGamesButton.addEventListener('click', () => {
        hideDetailSection();
        if (gamesContainer) gamesContainer.scrollIntoView({ behavior: 'smooth' });
    });
}

window.addEventListener('load', () => {
    console.log('Biblioteca carregada com sucesso!');
});

// API pública para manipular a biblioteca via código
window.GameLibrary = {
    add(gameData, save = true) {
        addGameCard(gameData, save);
    },
    getAll() {
        return getSavedGames();
    },
    update(gameData) {
        updateGameInStorage(gameData);
        updateSavedCard(gameData);
    },
    remove(gameId) {
        removeGameFromStorage(gameId);
        removeGameCardById(gameId);
        renderManageList();
    },
    showDetail(gameId) {
        showGameDetail(gameId);
    },
    resetFilters() {
        resetFilters();
    },
    init() {
        initializeEditForm();
        setupTagFilter();
        loadSavedGames();
        renderDefaultGamesInAddSection();
        loadTheme();
    }
};

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
                hideAddGameSection();
                hideManageGamesSection();
                hideDetailSection();
                if (gamesContainer) {
                    gamesContainer.style.display = '';
                    gamesContainer.classList.remove('grid-layout');
                }
                const banner = document.querySelector('.banner');
                if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (action === 'games') {
                hideAddGameSection();
                hideManageGamesSection();
                hideDetailSection();
                if (gamesContainer) {
                    gamesContainer.style.display = '';
                    gamesContainer.classList.add('grid-layout');
                }
                gamesContainer.scrollIntoView({ behavior: 'smooth' });
            }

            if (action === 'defaults') {
                hideAddGameSection();
                hideManageGamesSection();
                hideDetailSection();
                showDefaultGamesSection();
            }

            if (action === 'add') {
                showAddGameSection();
            }

            if (action === 'manage') {
                showManageGamesSection();
            }

            if (action === 'contact') {
                hideAddGameSection();
                hideManageGamesSection();
                hideDetailSection();
                const footer = document.querySelector('footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    alert('Para entrar em contato, envie um e-mail para contato@gamelibrary.com');
                }, 600);
            }
        });
    });
}