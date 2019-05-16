const color = new Color()
const rangeBar = document.querySelectorAll('[type="range"]')
const hexDiv = document.getElementById('hex')

function Color () {}
Color.prototype.changeColorValue = function(target) {
  target.nextElementSibling.textContent = target.value
}

Color.prototype.changeHexValue = function() {
  let hexValue = '#'
  rangeBar.forEach(item => hexValue += Number(item.value).toString(16).padStart(2, 0))
  hexDiv.innerText = hexValue.toUpperCase()
  return hexValue
}

Color.prototype.changeBackground = function(hexValue) {
  document.documentElement.style.setProperty(`--bgColor`, hexValue)
}


rangeBar.forEach(item => item.addEventListener('change', e => {
  color.changeColorValue(e.target)
  color.changeHexValue()
  color.changeBackground(color.changeHexValue())
}))

rangeBar.forEach(item => item.addEventListener('mousemove', e => {
  color.changeColorValue(e.target)
  color.changeHexValue()
  color.changeBackground(color.changeHexValue())
}))

rangeBar.forEach(item => item.addEventListener('touchmove', e => {
  color.changeColorValue(e.target)
  color.changeHexValue()
  color.changeBackground(color.changeHexValue())
}))

