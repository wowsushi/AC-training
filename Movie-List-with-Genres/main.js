const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies'
const POSTER_URL = BASE_URL + '/posters'
const GENRES = {
  "1": "Action",
  "2": "Adventure",
  "3": "Animation",
  "4": "Comedy",
  "5": "Crime",
  "6": "Documentary",
  "7": "Drama",
  "8": "Family",
  "9": "Fantasy",
  "10": "History",
  "11": "Horror",
  "12": "Music",
  "13": "Mystery",
  "14": "Romance",
  "15": "Science Fiction",
  "16": "TV Movie",
  "17": "Thriller",
  "18": "War",
  "19": "Western"
}

const navPanel = document.getElementById('nav-panel')
const dataPanel = document.getElementById('data-panel')
const data = []
const movie = new Movie()


function Movie () {}
Movie.prototype.getData = function () {
  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results)
      movie.displayCards(movie.genresFilter(data, 0))
    })
    .catch( error => console.log(error))
}

Movie.prototype.getGenresBar = function (list) {
  let htmlContent = ''

  htmlContent = Object.entries(list).map( ([genreNum, genreName]) => {
    return `
        <a class="list-group-item list-group-item-action" id="${genreName.toLowerCase()}-list" data-toggle="list" role="tab" aria-controls="${genreName}" data-genre="${genreNum}">${genreName}</a>
    `}).join('')
  navPanel.innerHTML += htmlContent
}

Movie.prototype.genresFilter = function (data, condition) {
  const results = (condition === 0)
    ? data
    : data.filter(movie => movie.genres.indexOf(condition) !== -1)
 return results
}

Movie.prototype.displayCards = function (data) {
  let htmlContent = ''

  htmlContent = data.map((item) => {
    return `
          <div class="col-sm-3 card-deck">
            <div class="card mb-2">
              <img
                class="card-img-top"
                src="${POSTER_URL}/${item.image}"
                alt="Card image cap" />
              <div class="card-body movie-item-body">
                <h6 class="card-title">${item.title}</h6>
              </div>
             <div class="card-footer text-muted">
               ${movie.displayBadges(item)}
             </div>
            </div>
          </div>
    `
  }).join("")
  dataPanel.innerHTML =
    (htmlContent.length === 0)
      ? '<div>No results</div>'
      : htmlContent
}

Movie.prototype.displayBadges = function (movie) {
  let htmlContent = ''
  movie.genres.map(genre => {
    htmlContent += `
      <span class="badge badge-secondary">${GENRES[genre]}</span>
    `
  })
  return htmlContent
}




movie.getData()
movie.getGenresBar(GENRES)
navPanel.addEventListener('click', e => {
  movie.displayCards(movie.genresFilter(data, Number(e.target.dataset.genre)))
})


