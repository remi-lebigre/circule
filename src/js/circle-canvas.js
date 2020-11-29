class CircleCanvas {
  height = window.innerHeight
  width = window.innerWidth
  drawn_radius = 0
  ended = false
  started = false
  STEP = 50

  constructor () {
    this.initListeners()
    this.initCanvas()
  }

  initListeners = _ => document.querySelectorAll('.circle').forEach(c => {
    c.addEventListener('mouseenter', this.hoverIn)
    c.addEventListener('mouseleave', this.hoverOut)
  })

  initCanvas = _ => {
    this.max = (this.height > this.width ? this.height : this.width) * 1.5
    this.canvases = document.querySelectorAll(".circle-canvas")
    this.ctxs = [...this.canvases].map(c => {
      c.setAttribute('height', `${this.height}px`)
      c.setAttribute('width', `${this.width}px`)
      return c.getContext("2d")
    })
  }

  hoverIn = ({target}) => {
    this.start()
    this.animateFromCoords(target)
  }

  animateFromCoords = target => {
    const coords = target.getBoundingClientRect()
    const x = coords.x + coords.width / 2
    let y = coords.y + coords.height / 2
    this.animate({x, y, radius: this.drawn_radius})()
  }

  hoverOut = ({target}) => {
    this.reset()
    if (this.ended) {
      this.animateFromCoords(target)
    }
  }

  ctxsInView = _ => this.ctxs.filter(c => c.canvas.classList.contains('is-inview') || c.canvas.classList.contains('circle-canvas--main'))
  start = _ => this.started = true
  reset = _ => this.started = false
  clear = _ => this.ctxsInView().forEach(c => c.clearRect(0, 0, this.width, this.height))

  drawCircle = ({radius, x, y}) => {
    this.clear()
    this.ctxsInView().forEach(c => {
      c.beginPath()
      c.arc(x, y - c.canvas.getBoundingClientRect().top, radius, 0, 2 * Math.PI)
      c.fillStyle = "#e9ff1d"
      c.fill()
    })
  }

  animate = ({radius, x, y}) => _ => {
    this.drawn_radius = radius + (this.STEP * (this.started ? 1 : -1))
    if (this.drawn_radius < 0) {
      this.drawn_radius = 0
    }
    let new_coords = {radius: this.drawn_radius, x, y}
    this.drawCircle(new_coords)
    if (this.drawn_radius < this.max && this.drawn_radius > 0) {
      window.requestAnimationFrame(this.animate(new_coords))
    } else {
      this.ended = true
    }
  }
}

export default CircleCanvas
