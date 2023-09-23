// Consts
const apikey = "f879413136c9ac68252bfa3cc69f9491";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
}


//boots up the app

function init() {
    
    fetchTrendingMovies()
    fetchAndBuildMovieSection(apiPaths.fetchTrending , 'Trending Now');
    fetchAndBuildAllSections();
}

function fetchTrendingMovies()
{
    fetchAndBuildMovieSection(apiPaths.fetchTrending  ,"Trending Now").then(list=>{
        const randomIndex = parseInt(Math.random() * list.length); //float deta hai so parseInt se int mai convert kar rhe h.
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    })
}


function buildBannerSection(movie)
{
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML= `<h2 class="banner__title">${movie.name}</h2> 
    <p class="banner__info">Trending in Movies | Release Date - ${movie.first_air_date}</p>
    <p class="banner__overview">${movie.overview && movie.overview.length>200 ?movie.overview.slice(0,200).trim()+"...":movie.overview}</p>
    <div class="action-buttons-cont">
      <button class="action-button">Play</button>
      <button class="action-button">More Info</button>
    </div>`

    div.className = "banner-content container";
    bannerCont.append(div);
}


function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories).then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(categories => {
                    fetchAndBuildMovieSection(apiPaths.fetchMoviesList(categories.id), categories.name); //internally ak ak category ko fetch kar rha hai uska url and category wise name and id de rha h.

                    // console.log("The url is :" , apiPaths.fetchMoviesList(categories.id))
                })
            }
            // console.table(categories)
        })
        .catch(err => console.log(err));
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl).then(res => res.json())
        .then(res => {
            // console.table(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies.slice(0,5),categoryName);
            }
            return movies;
        })
        .catch(err => console.error(err)) //complete movies ki list access kar rhe h us un URL se and ak url ke andar 20 movies hai.console mai check kar lena vaibhav.
}

function buildMoviesSection(List, categoryName) {
    console.log(List, categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = List.map(movie => {
        return `<img class="movie-item" src="${imgPath}${movie.backdrop_path}" alt="${movie.title}"/>`;
    }).join('');


    const moviesSectionHTML = `
    <div class = "movies-section">
        <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    </div>`

    console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;


    //append HTML into movies container

    moviesCont.append(div)
}

window.addEventListener("load", function () {
    init();

    window.addEventListener("scroll" , function(){
        const header = document.getElementById("header");
        if(window.scrollY>5)
        {
            header.classList.add("black-bg");
        }
        else header.classList.remove('black-bg');
    })
})