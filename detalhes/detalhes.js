const idFilme = new URL(window.location.href).searchParams.get("id");

$(document).ready(() => {
    fetchNavBar("../");
    carregaDetalhes();
});

function carregaDetalhes() {
    $.ajax(`https://api.themoviedb.org/3/movie/${idFilme}?api_key=${APIKey}&language=pt-BR`).then(async (det) => {
        document.title += ` - ${det.title}`;
        const creditos = await carregaCreditos(det.id);
        const direcao = filterCrew(creditos[0].crew, 'Director');
        let roteiro = filterCrew(creditos[0].crew, 'Screenplay');
        roteiro += filterCrew(creditos[0].crew, 'Writer');
        const date = det.release_date.split('-');

        $("#detalhes").append(
            `<div class="col-12 col-md-4">
                <img class="w-100 m-0" src="${det.poster_path != null ? `https://image.tmdb.org/t/p/w500${det.poster_path}` : ''}" alt="${det.original_title}"></a>
            </div>
            
            <div class="col-12 col-md-8 p-3">
                <h2>${det.title}</h2>
                <br>
                <p><b>Sinopse: </b> ${det.overview ? det.overview : 'Não disponível.'}</p>
                
                <p><b>Gênero: </b> ${formatGenres(det.genres)}</p>
                <p><b>Direção: </b> ${direcao ? direcao : 'Não disponível.'}</p>
                <p><b>Roteiro: </b> ${roteiro ? roteiro : 'Não disponível.'}</p>
                <p><b>Elenco: </b> ${filterCast(creditos[0].cast)}</p>
                <b class="float-end"><i>${formatDate(new Date(date[0], date[1], date[2]))}</i></b>

                <b>Avaliação:</b>
                <div class="d-flex mb-3">${contaEstrela(det.vote_average)}</div>

                <a class="${det.homepage ? '' : 'd-none'}" href="${det.homepage}" target="_blank"><button class="btn btn-dark text-white">Home Page</button></a>
            </div>`);
        carregaTrailer(det.id);
    }).catch(() => {
        $("#detalhes").append(`<div class="col-12 my-4"><u><h2 class="text-center"> Filme não encontrado </h2></u></div>`);
    });
}

async function carregaTrailer(idFilme) {
    const keyYT = await buscaVideo(idFilme);
    if(keyYT != null) {
        $("#trailer").append(
            `<h1>Trailer</h1>
            <div class="border border-1 border-secondary p-2 col-sm-8 col-12">
                <iframe class="col-12 mx-auto d-block" width="560" height="350" src="https://www.youtube.com/embed/${keyYT}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`);
    }
}