/* =========================================
   PESQUISA DE JOGOS
========================================= */

const searchInput = document.querySelector(".search-box input");
const gameCards = document.querySelectorAll(".game-card");

if (searchInput) {
    searchInput.addEventListener("input", () => {

        const value = (searchInput.value || "").toLowerCase();

        if (gameCards && gameCards.length) {
            gameCards.forEach(card => {

                const titleEl = card.querySelector("h2");
                const title = titleEl ? titleEl.textContent.toLowerCase() : "";

                if (title.includes(value)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }

            });
        }

    });
}


/* =========================================
   BOTÃO JOGAR
========================================= */

const playButtons = document.querySelectorAll(".play-btn");

if (playButtons && playButtons.length) {
    playButtons.forEach(button => {

        button.addEventListener("click", () => {

            const parent = button.closest('.game-info') || button.parentElement;
            const titleEl = parent ? parent.querySelector("h2") : null;
            const gameName = titleEl ? titleEl.textContent : "este jogo";

            alert("Abrindo " + gameName);

        });

    });
}


/* =========================================
   EFEITO HOVER SUAVE
========================================= */

if (gameCards && gameCards.length) {
    gameCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transition = "0.3s";

        });

    });
}


/* =========================================
   FILTRO POR TAGS
========================================= */

const tags = document.querySelectorAll(".tags span");

if (tags && tags.length && gameCards && gameCards.length) {
    tags.forEach(tag => {

        tag.addEventListener("click", () => {

            const selectedTag = (tag.textContent || "").toLowerCase();

            gameCards.forEach(card => {

                const tagsEl = card.querySelector(".tags");
                const cardTags = tagsEl ? tagsEl.textContent.toLowerCase() : "";

                if (cardTags.includes(selectedTag)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });
}


/* =========================================
   DUPLO CLIQUE PARA RESETAR FILTRO
========================================= */

const sectionTitle = document.querySelector(".section-title");
if (sectionTitle) {
    sectionTitle.addEventListener("dblclick", () => {

        if (gameCards && gameCards.length) {
            gameCards.forEach(card => {
                card.style.display = "block";
            });
        }

        if (searchInput) searchInput.value = "";

    });
}


/* =========================================
   MENSAGEM DE BOAS-VINDAS
========================================= */

window.addEventListener("load", () => {

    console.log("Biblioteca carregada com sucesso!");

});


/* =========================================
   NAVEGAÇÃO DO HEADER
========================================= */

const navLinks = document.querySelectorAll('nav a[data-action]');
const categoriesPanel = document.querySelector('.categories-panel');

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
                const games = document.querySelector('.games-container');
                if (games) games.scrollIntoView({ behavior: 'smooth' });
            }

            if (action === 'categories') {
                toggleCategoriesPanel();
            }

            if (action === 'contact') {
                const footer = document.querySelector('footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    alert('Para entrar em contato, envie um e-mail para contato@gamelibrary.com');
                }, 600);
            }

        });
    });
}

function toggleCategoriesPanel() {
    if (!categoriesPanel) return;

    if (categoriesPanel.innerHTML.trim()) {
        categoriesPanel.style.display = categoriesPanel.style.display === 'none' ? 'flex' : 'none';
        return;
    }

    // Estiliza o painel rapidamente
    categoriesPanel.style.display = 'flex';
    categoriesPanel.style.padding = '10px 20px';
    categoriesPanel.style.background = '#fff';
    categoriesPanel.style.borderBottom = '1px solid #ddd';
    categoriesPanel.style.gap = '10px';
    categoriesPanel.style.flexWrap = 'wrap';

    const uniqueTags = new Set();
    const allTagEls = document.querySelectorAll('.tags span');
    allTagEls.forEach(t => uniqueTags.add((t.textContent || '').trim()));

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Todos';
    btnAll.className = 'category-btn';
    btnAll.addEventListener('click', () => {
        if (gameCards && gameCards.length) gameCards.forEach(c => c.style.display = 'block');
        if (searchInput) searchInput.value = '';
    });
    categoriesPanel.appendChild(btnAll);

    uniqueTags.forEach(tagName => {
        const b = document.createElement('button');
        b.textContent = tagName;
        b.className = 'category-btn';
        b.addEventListener('click', () => {
            if (gameCards && gameCards.length) {
                gameCards.forEach(card => {
                    const tagsEl = card.querySelector('.tags');
                    const cardTags = tagsEl ? tagsEl.textContent.toLowerCase() : '';
                    if (cardTags.includes(tagName.toLowerCase())) card.style.display = 'block';
                    else card.style.display = 'none';
                });
            }
        });
        categoriesPanel.appendChild(b);
    });

}