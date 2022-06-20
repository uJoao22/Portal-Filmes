const APIKey = 'c4497cf0dc067b96859b05dbc5d4d07a';

function fetchNavBar(path) {
    $("body").prepend(
        `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand p-0 d-md-block d-none" href="${path}index.html" style="width: 10%;">
                    <img src="${path}images/logo.png" alt="logo" class="w-100">
                </a>
                <a class="navbar-brand p-0 d-md-none d-block" href="${path}index.html" style="width: 18%;">
                    <img src="${path}images/logo.png" alt="logo" class="w-100">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="${path}index.html?#lancamentos">lançamentos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="${path}index.html?#destaque">em destaque</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="${path}index.html?#avaliacoes">avaliações</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="${path}index.html?#entrevistasMakingof">entrevistas & makingof</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="${path}index.html?#sobre">sobre</a>
                        </li>
                    </ul>
                    <form class="d-flex" id="formPesquisa">
                        <input class="form-control me-2" type="search" placeholder="Pesquisar filme" id="inputFilme" aria-label="Search">
                    </form>
                </div>
            </div>
        </nav>`);
}


async function buscaVideo(idFilme) {
    return await $.ajax(`https://api.themoviedb.org/3/movie/${idFilme}/videos?api_key=${APIKey}&language=pt-BR`)
        .then((data) => { return data.results.length>0 ? data.results[0].key : null });
}

async function carregaCreditos(idFilme) {
    const credits = [];
    await $.ajax(`https://api.themoviedb.org/3/movie/${idFilme}/credits?api_key=${APIKey}&language=pt-BR`)
    .then((data) => { credits.push(data) });
    return credits;
}

function filterCrew(list, filter) {
    let result = "";
    list.map((c) => { if(c.job == filter) result += result.length>0 ? ", "+c.name : c.name });
    return result;
}

function filterCast(list) {
    let result = "";
    list.map((c) => { if(c.order <7) result += result.length>0 ? ", "+c.name : c.name });
    return result;
}

function formatGenres(list) {
    let result = "";
    list.map((g) => { result += result.length>0 ? ", "+g.name : g.name }) ;
    return result;
}

function contaEstrela(nota) {
    let stars = "";
    for(i=1; i<=10; i+=2) {
        if(nota>=i+1)
            stars += '<i class="bi bi-star-fill text-warning" style="font-size: 30px;"></i>'
        else if(nota>=i && nota<i+1)
            stars += '<i class="bi bi-star-half text-warning" style="font-size: 30px;"></i>'
        else if(nota<i)
            stars += '<i class="bi bi-star text-warning" style="font-size: 30px;"></i>'
    }
    return stars;
}

function formatDate(date) {
    return addZeroDate(date.getDate()) + "/" + addZeroDate(date.getMonth()) + "/" + date.getFullYear();
}

function addZeroDate(numero){
    return numero <= 9 ? "0" + numero : numero;
}