$(document).ready(() => {
    document.querySelector("#formPesquisa").addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = `${path}pesquisa/pesquisa.html?page=1&nome=${document.querySelector("#inputFilme").value}`;
    });
});