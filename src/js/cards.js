import Modal from "./modal"

class Cards {
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

  click = _e => new Modal(
    {
      content: `<img src="${require('/src/assets/images/_img/card_verso.jpg')}"/>`
    }
  ).open()
}

export default Cards
