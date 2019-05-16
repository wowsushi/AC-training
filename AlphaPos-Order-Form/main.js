const alphaPos = new AlphaPos ()
const addDrinkBtn = document.querySelector('[data-alpha-pos="add-drink"]')
const orderList = document.querySelector('[data-order-lists]')

function Drink (name, sugar, ice) {
  this.name = name
  this.sugar = sugar
  this.ice = ice
}

Drink.prototype.price = function() {
  switch (this.name) {
    case 'Black Tea':
    case 'Oolong Tea':
    case 'Baozong Tea':
    case 'Green Tea':
      return 30
    case 'Buble Milk Tea':
    case 'Lemon Green Tea':
      return 50
    case 'Black Tea Latte':
    case 'Matcha Latte':
      return 55
    default:
      alert('No this drink')
  }
}

function AlphaPos () {}
AlphaPos.prototype.getCheckedValue = function (inputName) {
  let selectedOption = ''
  document.querySelectorAll(`input[name=${inputName}]`).forEach(item => {
    if (item.checked) {
      selectedOption = item.value
    }
  })
  return selectedOption
}

AlphaPos.prototype.addDrink = function (drink) {
  let orderItemHTML = `
    <div class="card mb-3">
      <div class="card-body pt-3 pr-3">
        <div class="text-right">
        <span data-alpha-pos="delete-drink">x</span>
      </div>
      <h5 class="card-title mb-1">${drink.name}</h5>
      <div class="card-text">${drink.ice}</div>
       <div class="card-text">${drink.sugar}</div>
      </div>

      <div class="card-footer text-muted text-right py-2">
        $<span class="card-text text-muted" data-drink-price>${drink.price()}</span>
      </div>
    </div>
  `
  orderList.insertAdjacentHTML('afterbegin', orderItemHTML)
}

AlphaPos.prototype.deleteDrink = function (target) {
  target.remove()
}

AlphaPos.prototype.checkout = function () {
  let total = 0
  console.log("123")
  document.querySelectorAll('[data-drink-price]').forEach(drink => {
    total += Number(drink.textContent)
  })
  return total
}

AlphaPos.prototype.clearOrder = function (target) {
  target.querySelectorAll('.card').forEach(card => {
    card.remove()
  })
}


addDrinkBtn.addEventListener('click', () => {
  const drinkName = alphaPos.getCheckedValue('drink')
  const ice = alphaPos.getCheckedValue('ice')
  const sugar = alphaPos.getCheckedValue('sugar')
  const drink = new Drink(drinkName, ice, sugar)

  if (!drinkName) {
    alert('Please choose at least one item.')
    return
  }
  alphaPos.addDrink(drink)

})

orderList.addEventListener('click', (e) => {
  let isDeleteButton = e.target.matches('[data-alpha-pos="delete-drink"]')
  let isCheckout = e.target.matches('[data-alpha-pos="checkout"]')

  if (!isDeleteButton && !isCheckout) return
  else if (isDeleteButton) alphaPos.deleteDrink(e.target.closest('.card'))
  else if (isCheckout) {
    alert(`Total amount is $${alphaPos.checkout()}`)
    alphaPos.clearOrder(orderList)
  }
})
