import Modal from "./modal"

class Cards {
  CARDS_COUNT = 21
  constructor () {
    console.debug('New cards')
    this.container = document.querySelector('.cards')
    this.cards = document.querySelectorAll('.card')
    this.cards.forEach(c => {
      c.addEventListener('mouseenter', this.hoverIn)
      c.addEventListener('mouseleave', this.hoverOut)
      c.addEventListener('click', this.click)
    })
  }

  hoverIn = _e => this.container.classList.add('cards--hover')
  hoverOut = _e => this.container.classList.remove('cards--hover')
  click = ({target}) => new Modal({coords: target.getBoundingClientRect(), card: this.randomCard()}).open()
  randomCard = _ => Math.round(Math.random() * this.CARDS_COUNT) + 1
}

export default Cards
