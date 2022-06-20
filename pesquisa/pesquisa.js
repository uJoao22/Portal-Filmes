const query = new URL(window.location.href).searchParams.get("nome");
let pagina = new URL(window.location.href).searchParams.get("page");
pagina = pagina == null ? 1 : parseInt(pagina);

$(document).ready(async () => {
    fetchNavBar("../");
    document.querySelector("#pesquisado").innerHTML = query[0].toUpperCase() + query.substring(1);
    buscaFilme();
});

function buscaFilme() {
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=pt-BR&page=${pagina}&query=${query}`).then((data) => {
        const filmes = data.results;

        if(data.results.length > 0) {
            $("#filmes").empty();
            for(i=0; i<filmes.length; i++) {
                $("#filmes").append(
                    `<div class="col-lg-2 col-md-3 col-sm-4 col-6 my-2 d-flex">
                        <a class="d-flex filmeListed" href="../detalhes/detalhes.html?id=${filmes[i].id}">
                            <img class="w-100 m-0" src="${filmes[i].poster_path !=null ? `https://image.tmdb.org/t/p/w500/${filmes[i].poster_path}` : ''}" alt="${filmes[i].title}">
                        </a>
                    </div>`);
            }
            paginationn(data.total_pages);
        } else {
            $("#filmes").append(`<div class="col-12 pb-5"><u><h2 class="text-center"> Nenhum item encontrado </h2></u></div>`);
        }
    });
}

function paginationn(totPages) {
    $("#optsPagination").empty();
    $("#optsPagination").append(
        `<li class="page-item ${pagina > 1 ? '' : 'disabled'}"><a class="page-link" href="${formatUrl(pagina-1)}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                
        <li class="page-item active"><a class="page-link" href="${formatUrl(pagina)}">${pagina}</a></li>
        ${pagina+1 <= totPages ? `<li class="page-item"><a class="page-link" href="${formatUrl(pagina+1)}">${pagina+1}</a></li>` : ''}
        ${pagina+2 <= totPages ? `<li class="page-item"><a class="page-link" href="${formatUrl(pagina+2)}">${pagina+2}</a></li>` : ''}
        
        <li class="page-item ${pagina == totPages ? 'disabled' : ''}"><a class="page-link" href="${formatUrl(pagina+1)}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
}

function formatUrl(page) {
    return `?page=${page}&nome=${query}`;
}