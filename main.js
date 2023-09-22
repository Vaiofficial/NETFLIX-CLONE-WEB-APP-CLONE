// Consts
const apikey = "f879413136c9ac68252bfa3cc69f9491";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
}


//boots up the app

function init() {
    fetchAndBuildAllSections();
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories).then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.slice(0,5).forEach(categories => {
                    fetchAndBuildSection(apiPaths.fetchMoviesList(categories.id),categories); //internally ak ak category ko fetch kar rha hai uska url and category wise name and id de rha h.

                    // console.log("The url is :" , apiPaths.fetchMoviesList(categories.id))
                })
            }
            // console.table(categories)
        })
        .catch(err => console.log(err));
}

function fetchAndBuildSection(fetchUrl , categories) {
    console.table(fetchUrl ,categories);
    fetch(fetchUrl).then(res=>res.json()).then(res=>console.log(res)).catch(res=>console.error(res)) //complete movies ki list access kar rhe h us un URL se and ak url ke andar 20 movies hai.console mai check kar lena vaibhav.
}


window.addEventListener("load", function () {
    init();
})