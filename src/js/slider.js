class Slider {
  slider = null
  slides = []
  start = 0
  xDown = null
  pointer = 0
  slide_offsets = []
  animating = false
  GUTTER = 25

  constructor () {
    console.debug('--- Swipe init')

    this.slider = document.querySelector('.slider_wrap')
    this.slides = this.slider.querySelectorAll('.slide')
    this.slide_offsets = [...this.slides].map(s => s.getBoundingClientRect().left - this.GUTTER)
    this.slides.forEach(s => {
      s.addEventListener('touchstart', this.onTouchStart, false)
      s.addEventListener('touchmove', this.onTouchMove, false)
    })
  }

  onTouchStart = evt => {
    if (this.animating) {
      return
    }
    this.xDown = evt.touches[0].clientX
    this.start = 0
  }

  onTouchMove = evt => {
    if (!this.xDown) {
      return
    }
    this.animating = true
    setTimeout(_ => {
      this.animating = false
    }, 1000)
    const xDiff = this.xDown - evt.touches[0].clientX
    if (xDiff > 0) {
      if (this.pointer < this.slide_offsets.length - 1) {
        this.pointer++
      }
    } else {
      if (this.pointer > 0) {
        this.pointer -= 1
      }
    }
    this.slider.style.transform = `translateX(${this.slide_offsets[this.pointer] * -1}px)`
    this.xDown = null
  }
}

export default Slider
