class Spy {

  ICON_OFFSET_X = 2
  ICON_OFFSET_Y = 32
  click_timeout = null

  constructor () {
    console.debug('New spy')
    this.spy = document.querySelector('.spy')

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousemove', this.normal, {once: true})
    document.addEventListener('click', this.click)
    this.addLinkListeners()
  }

  reload = _ => this.addLinkListeners()

  addLinkListeners = _ => document.querySelectorAll('a').forEach(this.addHoverListeners)

  addHoverListeners = el => {
    el.addEventListener('mouseenter', this.hover)
    el.addEventListener('mouseleave', this.normal)
  }

  onMouseMove = ({clientX, clientY}) => {
    this.spy.style.transform = `translate3d(${clientX - this.ICON_OFFSET_X}px,${clientY - this.ICON_OFFSET_Y}px,0)`
  }
  click = _ => {
    this.normal()
    setTimeout(_ => {
      this.spy.classList.add('spy--click')
      clearTimeout(this.click_timeout)
      this.click_timeout = setTimeout(this.normal, 150)
    }, 1)
  }
  normal = _ => this.spy.classList.remove('spy--click', 'spy--hover', 'spy--hidden')
  hover = _ => this.spy.classList.add('spy--hover')
}

export default Spy
