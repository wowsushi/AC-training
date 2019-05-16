const INDEX_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users'
const USER_PER_PAGE = 20
const dataPanel = document.querySelector('#data-panel')
const body = document.querySelector('body')
const navLink = document.querySelectorAll('.nav-link')
const modalContent = document.querySelector('.modal-content')
const searchBar = document.getElementById('search-bar')
const searchInput = document.getElementById('search-input')
const pagination = document.getElementById('pagination')
const data = []

let results = []
let modalData = []
let currentPage = 1
let totalPages = 0

function countPeople(data) {
  const peopleAmount = {
    total: data.length,
    mans: 0,
    womens: 0,
    like: data.length
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].gender === "male") {
      peopleAmount.mans++
    } else peopleAmount.womens++;

    (data[i].isLike) ? "" : peopleAmount.like--;
  }

   for (let i = 0; i < navLink.length; i++) {
     //only get tag name + amount
     navLink[i].innerText = `${navLink[i].innerText.split(' ')[0]} ${Object.values(peopleAmount)[i]}`
   }

}

function createUserCards(userInfo) {
    const userId = userInfo.id
    const userImg = userInfo.avatar
    const userFullName = `${userInfo.name} ${userInfo.surname}`
    const htmlUserCardContent = `
      <div class="user-card" data-id="${userId}">
        <div class="user-card-photo" data-toggle="modal" data-target="#show-user-modal">
          <img class="user-card-img" src="${userImg}" alt="${userFullName}">
        </div>
        <h3 class="user-card-name">${userFullName}</h3>
        <button class="${(userInfo.isLike) ? "user-card-like user-card-like-clicked" : "user-card-like"}">
          <i class="fas fa-check"></i> Like
        </button>
      </div>
    `

    return htmlUserCardContent;
}

function displayList(data) {
  list = data.map(user => createUserCards(user)).join("")

  dataPanel.innerHTML = list

}

function displayModal(user) {
  const modalContent = document.querySelector('.modal-content')
  const fullName = `${user.name} ${user.surname}`
  const img = user.avatar
  const gender = user.gender

  let htmlContent = `
    <div class="modal-header">
      <h5 class="modal-title" id="userModalLongTitle">
      <i class= "${(gender === "female")? "fas fa-venus" : "fas fa-mars"}"></i>
        ${fullName}
      </h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <img class="modal-img" src="${img}" alt="${fullName}">
      <div class="modal-description">
        <h5 class="modal-description-title">Hi, I'm ${fullName}</h5>
        <p class="modal-description-content">Select tag to know me more</p>
      </div>
    </div>
    <div class="modal-footer">
      <ul class="modal-icons">
        <li class="modal-icon"><i class="far fa-envelope"></i></li>
        <li class="modal-icon"><i class="fas fa-map-marked-alt"></i></li>
        <li class="modal-icon"><i class="fas fa-birthday-cake"></i></li>
      </ul>
    </div>
  `
  modalContent.innerHTML = htmlContent
}

function getTotalPages(data) {
  totalPages = Math.ceil(data.length / USER_PER_PAGE) || 1
  let pageContent = `
    <li class="page-item">
      <a class="page-link" href="javascript:;" aria-label="Previous" data-page="prev">
        <span aria-hidden="true" data-page="prev">&laquo;</span>
      </a>
    </li>
  `

  for (let i = 0; i < totalPages; i++) {
    pageContent += `
      <li class="page-item "><a class="page-link" href="javascript:;" data-page=${i + 1} >${i + 1}</a></li>
    `
  }

  pageContent += `
    <li class="page-item">
      <a class="page-link" href="javascript:;" aria-label="next" data-page="next">
        <span aria-hidden="true" data-page="next">&raquo;</span>
      </a>
    </li>
  `
  pagination.innerHTML = pageContent
  pagination.children[1].classList.add('active')
}

function getPageData(page, data) {
  offect = ( page - 1 ) * USER_PER_PAGE
  pageData = data.slice(offect, offect + USER_PER_PAGE )
  displayList(pageData)
}

//get all data by axios
axios
  .get(`${INDEX_URL}`)
  .then(response => {
    response.data.results.map((user) => {
      user.isLike = false
      data.push(user)
    })
    countPeople(data)
    getTotalPages(data)
    getPageData(1, data)
  })
  .catch(error => console.log(error))

//click nav
Array
  .from(document.getElementsByClassName('nav-link'))
  .forEach(element => element.addEventListener('click', e => {
    const condition = e.target.textContent.toLowerCase().split(' ')[0]
    const selected = document.querySelectorAll('.nav-link')

    e.preventDefault()
    for (let elem of selected) {
      elem.classList.remove('active');
    }
    e.target.classList.add('active')

    switch(condition) {
    case 'male':
      results = data.filter(user => user.gender === 'male')
      break
    case 'female':
      results = data.filter(user => user.gender === 'female')
      break
    case 'like':
      results = data.filter(user => user.isLike)
      break
    default:
      results = data
    }

    displayList(results)
    getTotalPages(results)
    getPageData(1, results)
    description.innerText = ""
    searchInput.value = ""

}))

//click search
searchBar.addEventListener('submit', e => {
  const regex = new RegExp(searchInput.value, 'i')
  const description = document.getElementById('description')
  currentPage = 1

  e.preventDefault()
  if (!searchInput.value) {
    description.innerText = `Please enter some words`
    return
  } else {
    results = data.filter(user => user.name.match(regex) )
    displayList(results,'all')
    getTotalPages(results)
    getPageData(1, results)
    description.innerText = `There are ${results.length} result${(results.length > 1) ? "s" : ""} match`
  }

})

body.addEventListener('click', e => {
  //click like-button
  if (e.target.matches('.user-card-like' )) {
    const targetId = e.target.parentNode.dataset.id
    e.target.classList.toggle('user-card-like-clicked')
    data[ targetId - 1 ].isLike = !data[ targetId - 1 ].isLike
    countPeople(data)
  }
  if (e.target.matches('.user-card-like i')) {
    const targetId =  e.target.parentNode.parentNode.dataset.id
    e.target.parentNode.classList.toggle('user-card-like-clicked')
    data[ targetId - 1 ].isLike = !data[ targetId - 1 ].isLike
    countPeople(data)
  }

  //click user img to show modal
  if (e.target.matches('.user-card-photo')) {
    const targetId = e.target.parentNode.dataset.id
    modalContent.innerText = ""
    axios
      .get(`${INDEX_URL}/${targetId}`)
      .then(response => {
        modalData = response.data
        displayModal(modalData)
      })
      .catch(error => console.log(error))
  }

})

body.addEventListener('mouseover', e => {
  const modalDescriptionTitle = document.querySelector('.modal-description-title')
  const modalDescriptionContent = document.querySelector('.modal-description-content')

  if (e.target.matches('.fa-envelope')) {
    modalDescriptionTitle.innerText = `My email is`
    modalDescriptionContent.innerText = `${modalData.email}`

  } else if (e.target.matches('.fa-map-marked-alt')) {
    modalDescriptionTitle.innerText = `I live in`
    modalDescriptionContent.innerText = `${modalData.region}`

  } else if (e.target.matches('.fa-birthday-cake')) {
    modalDescriptionTitle.innerText = `I'm ${modalData.age} years old`
    modalDescriptionContent.innerText = `Born in ${modalData.birthday}`
  }

})

//click paginagition
pagination.addEventListener('click', e => {
  results = (results.length > 0 ) ? results : data
  targetPage = e.target.dataset.page

    if (targetPage === "prev" && currentPage > 1) {
      currentPage--
      Array.from(pagination.children).forEach(li => li.classList.remove('active'))
      document.querySelector(`[data-page="${currentPage}"]`).parentElement.classList.add('active')

    } else if (targetPage === "next" && currentPage  < totalPages) {
      currentPage++
      Array.from(pagination.children).forEach(li => li.classList.remove('active'))
      document.querySelector(`[data-page="${currentPage}"]`).parentElement.classList.add('active')

    } else if (!isNaN(targetPage)) {
      Array.from(pagination.children).forEach(li => li.classList.remove('active'))
      e.target.closest('.page-item').classList.add('active')

      currentPage = targetPage

    }
  getPageData(currentPage, results)
})

