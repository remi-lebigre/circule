class MenuMobile {
  constructor () {
    console.debug('New menu_mobile')

    this.header = document.querySelector('.header')
    this.mobile_header = this.header.querySelector('.header_mobile')
    this.menu = document.querySelector('.menu-mobile')
    this.open_cta = document.querySelector('.header_mobile_burger')

    console.log('this.open_cta', this.open_cta)
    this.open_cta.addEventListener('click', this.toggle)
  }

  toggle = _ => {
    this.header.classList.toggle('header--mobile-opened')
    this.mobile_header.classList.toggle('header_mobile--opened')
    this.menu.classList.toggle('menu-mobile--opened')
  }

  close = _ => {
    this.header.classList.remove('header--mobile-opened')
    this.mobile_header.classList.remove('header_mobile--opened')
    this.menu.classList.remove('menu-mobile--opened')
  }
}


export default MenuMobile
