(function () {
  // new var
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies'
  const POSTER_URL = BASE_URL + '/posters'
  const ITEM_PER_PAGE = 12

  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const pagination = document.getElementById('pagination')
  const displayMode = document.getElementById('display-mode')

  let searchInput = ''
  let pageNum = 1
  let results = []
  let paginationData = []

  axios.get(INDEX_URL)
    .then((response) => {
      for (let item of response.data.results) {
        data.push(item)
      }
      getTotalPages(data)
      getPageData(1, data)

    })
    .catch(err => console.log(err))

    //Listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      initialMovie()
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  searchBtn.addEventListener('click', e => {
    e.preventDefault()
    searchInput = e.target.previousElementSibling.value
    const regex = new RegExp(searchInput, 'i')
    results = data.filter( movie => movie.title.match(regex))
    getTotalPages(results)
    getPageData(1, results)
  })

  displayMode.addEventListener('click', e => {
    results = (searchInput.length > 0) ? results : data
    if (!e.target.dataset.mode) return

    if (e.target.dataset.mode === 'card') {
      getTotalPages (data, 'card')
      getPageData (pageNum, results, 'card')
    } else {
      getTotalPages (data, 'list')
      getPageData (pageNum, results, 'list')
    }
  })

  pagination.addEventListener('click', e => {
    results = (searchInput.length > 0) ? results : data
    if (e.target.tagName === 'A') {
      pageNum = e.target.dataset.page
      getPageData(pageNum, results, e.target.dataset.mode)
    }

  })

  function displayDataList (data, mode = 'card') {
    let htmlContent = ''
    if (mode === 'card') {
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
              <!-- favorite button -->
                <button
                  class="btn btn-info btn-add-favorite"
                  data-id="${item.id}">
                  +
                </button>
              </div>
            </div>
          </div>
        `
      })
    } else {
      data.forEach((item, index) => {
        htmlContent += `
          <div class="col-sm-12">
            <div class="card mb-2">
              <div class="card-body movie-item-body body-grid">
                <h6 class="card-title">${item.title}</h6>
                <!-- "More" button -->

                  <button
                    class="btn btn-primary btn-show-movie"
                    data-toggle="modal"
                    data-target="#show-movie-modal"
                    data-id="${item.id}">
                    More
                  </button>
                <!-- favorite button -->
                  <button
                    class="btn btn-info btn-add-favorite"
                    data-id="${item.id}">
                    +
                  </button>
            </div>
          </div>
        </div>
        `
      })
    }
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

  function addFavoriteItem (id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already on your favorite list`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list`)
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function getTotalPages (data, mode = 'card') {
    results = (searchInput.length > 0) ? results : data
    let totalPages = Math.ceil(results.length / ITEM_PER_PAGE ) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}" data-mode="${mode}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData (pageNum, data, mode = 'card') {
    paginationData = (searchInput.length > 0) ? results : data
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData, mode, pageNum)
  }
})()


