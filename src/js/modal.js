class Modal {

  constructor ({content}) {
    this.modal = document.querySelector('.modal')
    this.modal_content = document.querySelector('.modal_content')
    this.modal_bg = document.querySelector('.modal_bg')
    this.close_cta = document.querySelector('.modal_close')
    this.close_cta.addEventListener('click', this.close, {once: true})
    this.modal_bg.addEventListener('click', this.close, {once: true})
    this.modal_content.innerHTML = content
  }

  open = _ => this.modal.classList.add('modal--open')

  close = _ => this.modal.classList.remove('modal--open')
}

export default Modal
