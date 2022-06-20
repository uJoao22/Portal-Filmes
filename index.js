let pagina = new URL(window.location.href).searchParams.get("page");
pagina = pagina == null ? 1 : parseInt(pagina);

const path = './';
let listFilmes = [];
let maisFilmes = false;
let maisAvaliacoes = false;
let maisEntrevistas = false;
const reviews = [];

$(document).ready(async () => {
    fetchNavBar(path);
    listFilmes = await carregaListaFilmes();
    carregaLancamentos();
    carregaCategoria();
    carregaDestaque(listFilmes, 4);
    carregaAvaliacoes(false);
    carregaEntrevistas(3);
});

document.querySelector("#categorias").addEventListener('change', () => carregaDestaqueByCategoria());

function carregaDestaqueByCategoria() {
    const selected = document.querySelector("#categorias").value;
    if(selected == 0) {
        carregaDestaque(listFilmes, 4);
        return;
    }
    const filter = listFilmes.filter((f) => f.genre_ids.indexOf(parseInt(selected)) != -1);
    carregaDestaque(filter, filter.length < 4 ? filter.length : 4);
    maisFilmes = false;
    document.querySelector("#maisFilmes").innerHTML = '<i class="fa-solid fa-plus"></i> Carregar mais filmes';
}

document.querySelector("#maisFilmes").addEventListener('click', () => {
    const filterSelected = parseInt(document.querySelector("#categorias").value);
    maisFilmes = !maisFilmes;
    if(maisFilmes) {
        document.querySelector("#maisFilmes").innerHTML = '<i class="fa-solid fa-minus"></i> Mostrar menos filmes';
        if(filterSelected == 0)
            carregaDestaque(listFilmes, listFilmes.length);
        else {
            const filter = listFilmes.filter((f) => f.genre_ids.indexOf(filterSelected) != -1);
            carregaDestaque(filter, filter.length);
        }
    } else {
        document.querySelector("#maisFilmes").innerHTML = '<i class="fa-solid fa-plus"></i> Carregar mais filmes';
        filterSelected == 0 ? carregaDestaque(listFilmes, 4) : carregaDestaqueByCategoria();
    }
});

document.querySelector("#maisAvaliacoes").addEventListener('click', () => {
    maisAvaliacoes = !maisAvaliacoes;
    if(maisAvaliacoes) {
        document.querySelector("#maisAvaliacoes").innerHTML = '<i class="fa-solid fa-minus"></i> Mostrar menos avaliações';
        carregaAvaliacoes(maisAvaliacoes);
    } else {
        document.querySelector("#maisAvaliacoes").innerHTML = '<i class="fa-solid fa-plus"></i> Carregar mais avaliações';
        carregaAvaliacoes(maisAvaliacoes);
    }
});

document.querySelector("#maisEntrevistas").addEventListener('click', () => {
    maisEntrevistas = !maisEntrevistas;
    if(maisEntrevistas) {
        document.querySelector("#maisEntrevistas").innerHTML = '<i class="fa-solid fa-minus"></i> Mostrar menos entrevistas';
        carregaEntrevistas(listFilmes.length);
    } else {
        document.querySelector("#maisEntrevistas").innerHTML = '<i class="fa-solid fa-plus"></i> Carregar mais entrevistas';
        carregaEntrevistas(3);
    }
});

async function carregaLancamentos() {
    $("#filmesLancamento").empty();
    let i=0;
    while(i<4) {
        const keyYT = await buscaVideo(listFilmes[i].id);
        const creditos = await carregaCreditos(listFilmes[i].id);
        const direcao = filterCrew(creditos[0].crew, 'Director');
        let roteiro = filterCrew(creditos[0].crew, 'Screenplay');
        roteiro += filterCrew(creditos[0].crew, 'Writer');
        const date = listFilmes[i].release_date.split('-');

        $("#filmesLancamento").append(
            `<div class="carousel-item pb-5 ${i==0 ? 'active' : ''}">
                <div>
                    <div class="row">
                        ${keyYT != null ?
                            `<iframe class="col-xl-5 col-md-6 col-12 videoLancamento" width="560" src="https://www.youtube.com/embed/${keyYT}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                        :
                        `<div class="col-lg-5 col-md-6 col-12 d-flex justify-content-center align-items-center">
                            <img src="${listFilmes[i].backdrop_path != null ? `https://image.tmdb.org/t/p/w500${listFilmes[i].backdrop_path}` : ''}" alt="${listFilmes[i].title}">
                            <label class="position-absolute text-white p-2 px-5 text-center" style="background: rgba(0, 0, 0, 0.8)">
                                <h3 class="">Trailer não encontrado.</h3>
                            </label>
                        </div>`}

                        <div class="col-xl-7 col-md-6 col-12">
                            <h2 class="my-mb-0 my-3">${listFilmes[i].title}</h2>
                            <p><b>Sinopse: </b>${listFilmes[i].overview ? listFilmes[i].overview : 'Não disponível.'}</p>

                            <div class="d-flex justify-content-between flex-column flex-md-row">
                                <p><b>Direção:</b> ${direcao ? direcao : 'Não disponível.'}</p>
                                <p><b>Roteiro:</b> ${roteiro ? roteiro : 'Não disponível.'}</p>
                                <p><b>Estreia:</b> ${formatDate(new Date(date[0], date[1], date[2]))}</p>
                            </div>

                            <b>Elenco:</b>
                            <p>${filterCast(creditos[0].cast)}</p>

                            <b>Avaliação:</b>
                            <div class="d-flex">${contaEstrela(listFilmes[i].vote_average)}</div>
                        </div>
                    </div>
                </div>
            </div>`);
        i++;
    }
};

function carregaCategoria() {
    $.ajax(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKey}&language=pt-BR`).then((data) => {
        $("#categorias").empty();
        $("#categorias").append("<option value='0' selected>Categoria: TODOS</option>");
        data.genres.forEach((categoria) => $("#categorias").append(`<option value="${categoria.id}">${categoria.name}</option>`));
    });
}

function carregaDestaque(list, max) {
    $("#filmesDestaque").empty();
    if(list.length > 0) {
        list.length < 4 ? $("#divMaisFilmes").hide() : $("#divMaisFilmes").show();

        for(i=0; i<max; i++) {
            $("#filmesDestaque").append(
                `<div class="col-md-3 col-6 my-2 d-flex">
                    <a class="d-flex filmeListed" href="./detalhes/detalhes.html?id=${list[i].id}">
                        <img class="w-100 m-0" src="${list[i].poster_path != null ? `https://image.tmdb.org/t/p/w500/${list[i].poster_path}` : ''}" alt="${list[i].title}">
                    </a>
                </div>`);
            }
    } else {
        $("#divMaisFilmes").hide();
        $("#filmesDestaque").append(
            `<div class="col-12 pb-5">
                <u><h2 class="text-center"> Nenhuma filme desta categoria. </h2></u>
            </div>`);
    }
}

function carregaAvaliacoes(showMais) {
    if(reviews.length > 0) {
        buscaReview(reviews, showMais);
        return;
    }

    listFilmes.forEach((filme, idx) => {
        $.ajax(`https://api.themoviedb.org/3/movie/${filme.id}/reviews?api_key=${APIKey}&language=pt-BR`).then((data) => {
            if(data.results.length > 0) reviews.push(data.results[0]);
            if(idx == listFilmes.length-1) buscaReview(reviews, showMais);
        });
    });

}

function buscaReview(list, showAll) {
    const max = showAll ? list.length : list.length<3 ? list.length : 3;
    if(list.length > 0) {
        for(i=0; i<max; i++) {
            $("#avaliacao").empty();
            $.ajax(`https://api.themoviedb.org/3/review/${list[i].id}?api_key=${APIKey}&language=pt-BR`).then((av) => {
                const date = av.created_at.split('-');
                $("#avaliacao").append(
                    `<div class="col-md-4 col-12 d-flex p-2 my-2">
                        <div class="col-3">
                            <img class="w-100" src="${
                                (`${av.author_details.avatar_path}`).indexOf('/http') != -1 ?
                                av.author_details.avatar_path.substr(1) :
                                av.author_details.avatar_path == null ? '' : `https://image.tmdb.org/t/p/w500${av.author_details.avatar_path}`
                                }" alt="${av.author_details.username}"/>
                        </div>

                        <div class="col-8 ms-2 comentario" style="max-height: 250px; overflow-y: auto;">
                            <b><h4>${av.media_title}</h4></b>
                            <p class="m-0"><b>Escrito por:</b> <a href="${av.url}" target="_blank" class="text-dark">${av.author}</a></p>
                            <p><b>${formatDate(new Date(date[0], date[1], date[2].split('T')[0]))}</b></p>
                            <p><b>Avaliação: </b>${av.content}</p>
                        </div>
                    </div>`);
            });
        }
    } else {
        $("#divMaisAvaliacoes").hide();
        $("#avaliacao").append(
            `<div class="col-12 pb-5">
                <u><h2 class="text-center"> Nenhuma avaliação disponível. </h2></u>
            </div>`);
    }
}

async function carregaEntrevistas(max) {
    $("#dadosEntrevista").empty();
    let i=0;
    while(i<max) {
        const filme = listFilmes[i];
        const keyYT = await buscaVideo(filme.id);

        $.ajax(`https://api.themoviedb.org/3/movie/${filme.id}/credits?api_key=${APIKey}&language=pt-BR`).then((data) => {
            const direcao = filterCrew(data.crew, 'Director');
            let roteiro = filterCrew(data.crew, 'Screenplay');
            roteiro += filterCrew(data.crew, 'Writer');
            const date = filme.release_date.split('-');

            $("#dadosEntrevista").append(
                `<div class="col-12 col-md-4 my-2 d-flex">
                    <div class="card">
                        ${keyYT != null ?
                            `<iframe class="card-img-top" height="200" src="https://www.youtube.com/embed/${keyYT}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                        :
                        `<div class="card-img-top d-flex justify-content-center align-items-center">
                            <img src="${filme.backdrop_path != null ? `https://image.tmdb.org/t/p/w500${filme.backdrop_path}` : ''}" alt="${filme.title}" height="200" class="w-100">
                            <label class="position-absolute text-white p-2 px-5 text-center w-100" style="background: rgba(0, 0, 0, 0.8)">
                                <h4>Vídeo não encontrado.</h4>
                            </label>
                        </div>`}


                        <div class="card-body">
                            <h5 class="card-title"><b class="fs-4">Filme:</b> ${filme.title}</h5>
                            <p class="card-text">
                                <p><b>Direção:</b> ${direcao ? direcao : 'Não disponível.'}</p>
                                <p><b>Roteiro:</b> ${roteiro ? roteiro : 'Não disponível.'}</p>
                                <p><b>Estreia:</b> ${formatDate(new Date(date[0], date[1], date[2]))}</p>
                            </p>
                        </div>
                    </div>
                </div>`);
        });
        i++;
    }
}

async function carregaListaFilmes() {
    const list = [];
    let totPages = 0;
    await $.ajax(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=pt-BR&page=${pagina}`)
    .then((data) => {
        totPages = data.total_pages
        list.push(...data.results)
        pagination(totPages);
    }).catch(() => {
        notFound();
        return;
    });
    return list;
}

function pagination(totPages) {
    $("#optsPagination").empty();
    $("#optsPagination").append(
        `<li class="page-item ${pagina > 1 ? '' : 'disabled'}"><a class="page-link" href="?page=${pagina-1}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>

        <li class="page-item active"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>
        ${pagina+1 <= totPages ? `<li class="page-item"><a class="page-link" href="?page=${pagina+1}">${pagina+1}</a></li>` : ''}
        ${pagina+2 <= totPages ? `<li class="page-item"><a class="page-link" href="?page=${pagina+2}">${pagina+2}</a></li>` : ''}

        <li class="page-item ${pagina == totPages ? 'disabled' : ''}"><a class="page-link" href="?page=${pagina+1}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
}

function notFound() {
    console.error("Nenhum conteúdo encontrado");
    $(".carousel").hide();
    $("#destaque").hide();
    $("#avaliacoes").hide();
    $("#entrevistasMakingof").hide();

    $("main").prepend(
        `<div class="col-12 my-5">
            <u><h2 class="text-center"> Nenhum conteúdo disponível. </h2></u>
            <p class="text-center"><a href="?page=1">Voltar para página inicial</a></p>
        </div>`);
}