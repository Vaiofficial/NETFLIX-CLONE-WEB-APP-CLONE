// Consts
const apikey = "f879413136c9ac68252bfa3cc69f9491";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAFdHvys-ygiL-hC4oiWCLt0MEu2BepJHI`
}

// 


//boots up the app

function init() {

    fetchTrendingMovies()
    // fetchAndBuildMovieSection(apiPaths.fetchTrending , 'Trending Now');
    fetchAndBuildAllSections();
}


//trending movies ke sectoion ko show karne ke liye hai ye function.
function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, "Trending Now").then(list => {
        const randomIndex = parseInt(Math.random() * list.length); //float deta hai so parseInt se int mai convert kar rhe h.
        buildBannerSection(list[randomIndex]);
    }).catch(err => {
        console.error(err);
    })
}

//sabse top mai jo banner hai , jo ki trending movies se movies uthakar vha show kar rha hai. uske liye hai ye vala function.
function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');

    div.innerHTML = `
    <h2 class="banner__title">${movie.title}</h2> 
    <p class="banner__info">Trending in Movies | Release Date - ${movie.first_air_date}</p>
    <p class="banner__overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + "..." : movie.overview}</p>
    <div class="action-buttons-cont">
      <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp;Play</button>

      <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp;More Info</button>
    </div>`

    div.className = "banner-content container";

    bannerCont.append(div);
}


//different different catergories ko show karne k liye hai ye vala fucntion.
function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories).then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(categories => {
                    fetchAndBuildMovieSection(apiPaths.fetchMoviesList(categories.id), categories.name); //internally ak ak category ko fetch kar rha hai uska url and category wise name and id de rha h.

                    // console.log("The url is :" , apiPaths.fetchMoviesList(categories.id))
                });
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
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err => console.error(err)) //complete movies ki list access kar rhe h us un URL se and ak url ke andar 20 movies hai.console mai check kar lena vaibhav.
}

function buildMoviesSection(List, categoryName) {
    console.log(List, categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = List.map(item => {
        return `
        <div class = "movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>
            <div class ="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');


    const moviesSectionHTML = `
        <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>`

    // console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;


    //append HTML into movies container

    moviesCont.append(div)
}


//movies trailer ko show karne k liye hkar rhe hai.
function searchMovieTrailer(MovieName, iframeId) {
    // console.log( document.getElementById(iframeId) , iframeId);
    if (!MovieName) return;

    fetch(apiPaths.searchOnYoutube(MovieName))
        .then(res => res.json())
        .then(res => {
            // console.log(res.items[0])
            const bestSearch = res.items[0];
            // const youtubeUrl = `https://www.youtube.com/watch?v=${bestSearch.id.videoId}`
            // console.log(youtubeUrl);
            const elements = document.getElementById(iframeId);
            // console.log(elements , iframeId)

            const div = document.createElement('div');
            div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestSearch.id.videoId}?autoplay=1&controls=0"></iframe>`;

            elements.append(div);
        })
        .catch(err => console.error(err))
}



//PROFILE SECTION VISIT FUNCTION
const profilePage = document.querySelector('#Profile-Page');

function profileSection() {
    
    fetch('profile.html').then(res=>{
        if(!res.ok){
            throw new Error("Check Your Network")
        }
        return res.text();
    }).then(content=>{
        document.body.innerHTML = content;
    }).catch(err=>{
        console.error("Problem with Fetch Operation",err);
    });
}

profilePage.addEventListener("click" , profileSection);


window.addEventListener("load", function () {
    init();

    window.addEventListener("scroll", function () {
        //header UI Update.
        const header = document.getElementById("header");
        if (window.scrollY > 5) {
            header.classList.add("black-bg");
        }
        else header.classList.remove('black-bg');
    })
})
