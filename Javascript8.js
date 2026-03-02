const API_KEY = '965434254f0fc23138086df2565f7f4b'
const APILINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;

returnMovies(APILINK);
function returnMovies(url) {
    fetch(url)
    .then(res=>res.json())
    .then(function(data){
        console.log(data);
        console.log(data.results);
        data.results.forEach(element => {
            const div_card = document.createElement('div');
            const div_row = document.createElement('div');
            const div_column = document.createElement('div');
            const image = document.createElement('img');
            const title = document.createElement('h3'); 

            title.innerHTML = `${element.title}`;
            image.src = IMG_PATH + element.poster_path;
            image.alt = data.title

            div_card.appendChild(image);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);

            div_card.setAttribute('class', 'card');
            div_row.setAttribute('class', 'row');
            div_column.setAttribute('class', 'column');

            main.appendChild(div_row);
        });
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = "";

    const searchItem = search.value;
    if (searchItem) {
        console.log(`Searching for "${searchItem}"`);
        returnMovies(SEARCHAPI + searchItem);
    } else {
        returnMovies(APILINK);
        console.log("No Change");
    }
})