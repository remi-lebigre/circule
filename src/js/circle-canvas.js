class CircleCanvas {
  height = window.innerHeight
  width = window.innerWidth
  drawn_radius = 0
  ended = false
  started = false
  
  constructor () {
    this.initListeners()
    this.initCanvas()
  }

  initListeners = _ => document.querySelectorAll('.circle').forEach(c => {
    c.addEventListener('mouseenter', this.hoverIn)
    c.addEventListener('mouseleave', this.hoverOut)
  })
  initCanvas = _ => {
    this.max = this.height > this.width ? this.height : this.width
    const c = document.querySelector(".circle-canvas")
    c.setAttribute('height', `${this.height}px`)
    c.setAttribute('width', `${this.width}px`)
    this.ctx = c.getContext("2d")
  }

  hoverIn = ({target}) => {
    this.start()
    this.drawFromCoords(target)
  }
  drawFromCoords = target => {
    const coords = target.getBoundingClientRect()
    const x = coords.x + coords.width / 2
    const y = coords.y + coords.height / 2
    this.draw({x, y, radius: this.drawn_radius})()
  }
  hoverOut = ({target}) => {
    this.reset()
    if (this.ended) {
      this.drawFromCoords(target)
    }
  }

  start = _ => this.started = true
  reset = _ => this.started = false
  clear = _ => this.ctx.clearRect(0, 0, this.width, this.height);

  drawCircle = ({radius, x, y}) => {
    this.clear()
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = "#e9ff1d"
    this.ctx.fill()
  }

  draw = ({radius, x, y}) => _ => {
    this.drawn_radius = radius + (20 * (this.started ? 1 : -1))
    if (this.drawn_radius < 0) {
      this.drawn_radius = 0
    }
    let new_coords = {radius: this.drawn_radius, x, y}
    this.drawCircle(new_coords)
    if (this.drawn_radius < this.max && this.drawn_radius > 0) {
      window.requestAnimationFrame(this.draw(new_coords))
    } else {
      this.ended = true
    }
  }
}

export default CircleCanvas
