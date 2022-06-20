$(document).ready(() => {
    document.querySelector("#formPesquisa").addEventListener("submit", (e) => {
        e.preventDefault();
        const path = window.location.href.indexOf('index.html') == -1 ? '../' : './';
        window.location.href = `${path}pesquisa/pesquisa.html?page=1&nome=${document.querySelector("#inputFilme").value}`;
    });
});