class Modal {

  ANIMATION_DURATION = 1500
  state = 'animating'

  constructor ({coords}) {
    console.debug('New modal')
    this.modal = document.querySelector('.modal')
    this.modal_content = document.querySelector('.modal_content')
    this.modal_bg = document.querySelector('.modal_bg')
    this.close_cta = document.querySelector('.modal_close')
    this.close_cta.addEventListener('click', this.close)
    this.modal_bg.addEventListener('click', this.close)

    let m_coords = this.getContentCoords()
    const height_ratio = m_coords.height / coords.height
    this.modal_content.style.width = `${coords.width * height_ratio}px`

    m_coords = this.getContentCoords()
    const scale = m_coords.width > coords.width ? (1 / (m_coords.width / coords.width)) : (m_coords.width / coords.width)
    this.modal_content.style.transform = `scale(${scale})`

    m_coords = this.getContentCoords()
    this.modal_content.style.transform = `scale(${scale}) translate3d(${(coords.left - m_coords.left) / scale}px,${(coords.top - m_coords.top) / scale}px,0)`
  }

  getContentCoords = _ => this.modal_content.getBoundingClientRect()

  open = _ => {
    this.modal.classList.add('modal--open')
    setTimeout(this.animate, 150)
  }
  animate = _ => {
    this.state = 'animating'
    this.modal_content.classList.add('modal_content--animate')
    this.modal_content.style.removeProperty('transform')
    setTimeout(this.resetState, this.ANIMATION_DURATION)
  }
  resetState = _ => this.state = null
  close = _ => {
    if (this.state === 'animating') return true
    this.modal.classList.remove('modal--open')
    this.modal_content.classList.remove('modal_content--animate')
    this.modal_content.style.removeProperty('width')
    this.close_cta.removeEventListener('click', this.close)
    this.modal_bg.removeEventListener('click', this.close)
    this.resetState()
  }
}

export default Modal
