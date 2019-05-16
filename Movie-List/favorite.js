(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies'
  const POSTER_URL = BASE_URL + '/posters'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  displayDataList(data)

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      initialMovie()
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function displayDataList (data) {
    let htmlContent = ''
    data.forEach((item, index) => {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img
              class="card-img-top"
              src="${POSTER_URL}/${item.image}"
              alt="Card image cap" />
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button
                class="btn btn-primary btn-show-movie"
                data-toggle="modal"
                data-target="#show-movie-modal"
                data-id="${item.id}">
                More
              </button>
            <!-- remove button -->
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">
                X
              </button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    //get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    //set request url
    const url = INDEX_URL + '/' + id

    //send request to show api
    axios.get(url).then(response => {
      const data = response.data.results

    //insert data into modal ui
    modalTitle.textContent = data.title
    modalImage.innerHTML = `<img src="${POSTER_URL}/${data.image}"
                              class="img-fluid"
                              alt="Responsive image">
                            `
    modalDate.textContent = `release at : ${data.release_date}`
    modalDescription.textContent = `${data.description}`
    })
  }

  function removeFavoriteItem (id) {
    const index = data.findIndex( item => item.id === Number(id))
    if (index === -1) return
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    displayDataList(data)

  }

  function initialMovie() {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    modalTitle.textContent = ""
    modalImage.innerHTML = ""
    modalDate.textContent = ""
    modalDescription.textContent = ""
  }

})()
