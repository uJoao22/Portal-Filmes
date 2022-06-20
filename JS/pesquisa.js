$(document).ready(() => {
    document.querySelector("#formPesquisa").addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = `../pesquisa/pesquisa.html?page=1&nome=${document.querySelector("#inputFilme").value}`;
    });
});