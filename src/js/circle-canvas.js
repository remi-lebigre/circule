class CircleCanvas {
  height = window.innerHeight
  width = window.innerWidth
  default_radius = 0
  radius = 0
  frame = 0
  ended = false
  started = false
  STEPS = 120
  target = null

  constructor () {
    this.initListeners()
    this.initCanvas()
    this.initCircle()
  }

  initCircle = _ => {
    const circle = document.querySelector('.circle')
    const circle_width = circle.getBoundingClientRect().width
    this.default_radius = circle_width - circle_width / 2
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

  //TODO: handle states from hover in/out to figure out which frame to start

  hoverIn = ({target}) => {
    this.target = target
    this.start()
    this.animate()
  }

  hoverOut = _ => {
    this.reset()
    if (this.ended && this.frame === 0) {
      this.animate()
    } else {
      this.frame = this.STEPS - this.frame
    }
  }

  targetCoords = _ => {
    const coords = this.target.getBoundingClientRect()
    return {x: coords.x + coords.width / 2, y: coords.y + coords.height / 2}
  }
  ctxsInView = _ => this.ctxs.filter(c => c.canvas.classList.contains('is-inview') || this.isCtxMain(c))
  isCtxMain = c => c.canvas.classList.contains('circle-canvas--main')
  start = _ => {
    this.started = true
  }
  reset = _ => {
    this.started = false
  }
  clear = _ => this.ctxsInView().forEach(c => c.clearRect(0, 0, this.width, this.height))

  rand = input => Math.round((Math.random() * input) * 100) / 100

  drawCircle = () => {
    this.clear()
    this.ctxsInView().forEach(c => {
      const {x, y} = this.targetCoords()

      let offset_y = y
      if (!this.isCtxMain(c)) {
        offset_y -= c.canvas.getBoundingClientRect().top
      }

      const path = new Path2D(this.path({x: x, y: offset_y}))
      c.fillStyle = "#e9ff1d"
      c.fill(this.scaleUp({path, x: x, y: offset_y, scale: this.radius / (this.default_radius * 2)}))
    })
  }

  path = ({x, y}) => {
    const sequence = [
      ['M', [[45.7, -79.8]]],
      ['C', [[59.1, -71.4], [69.8, -59,], [77.9, -45]]],
      ['C', [[86, -31], [91.5, -15.5,], [92.1, 0.4]]],
      ['C', [[92.8, 16.2], [88.5, 32.4,], [79.9, 45.6]]],
      ['C', [[71.4, 58.8], [58.5, 68.9,], [44.5, 76.1]]],
      ['C', [[30.4, 83.4], [15.2, 87.7,], [-0.1, 87.9]]],
      ['C', [[-15.5, 88.2], [-31, 84.3,], [-44.7, 77]]],
      ['C', [[-58.5, 69.6], [-70.5, 58.6,], [-77.5, 45.2]]],
      ['C', [[-84.5, 31.8], [-86.5, 15.9,], [-86.7, -0.1]]],
      ['C', [[-87, -16.1], [-85.4, -32.3,], [-78.6, -46.1]]],
      ['C', [[-71.8, -59.9], [-59.8, -71.3,], [-45.8, -79.3]]],
      ['C', [[-31.8, -87.4], [-15.9, -92,], [0.1, -92.2]]],
      ['C', [[16.1, -92.4], [32.3, -88.1,], [45.7, -79.8]]],
      ['Z', [[]]],
    ]
    return sequence.map(s => `${s[0]} ${s[1].map(this.coords(x, y)).join(' ')}`).join(' ')
  }

  scaleUp = ({path, x, y, scale}) => {
    let p1 = new Path2D()
    let m = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix()
    m.a = scale
    m.d = scale
    m.e = x - x * scale
    m.f = y - y * scale
    p1.addPath(path, m)
    return p1
  }

  coords = (x, y) => i => [
    i[0] + x + this.rand(1),
    i[1] + y + this.rand(1),
  ]

  animate = _ => {
    this.frame += 1
    this.calcRadius()
    if (this.frame <= this.STEPS) {
      this.drawCircle()
      window.requestAnimationFrame(this.animate)
    } else {
      this.ended = true
      this.frame = 0
    }
  }

  calcRadius = _ => {
    if (this.started) {
      this.radius = this.default_radius + this.max * this.easeInQuart(this.frame / this.STEPS)
    } else {
      this.radius = this.max - (this.max * this.easeOutCubic(this.frame / this.STEPS))
    }
  }

  easeInCubic = t => Math.pow(t, 3)
  easeOutCubic = t => 1 - this.easeInCubic(1 - t)
  easeInQuad = t => Math.pow(t, 2)
  easeOutQuad = t => 1 - this.easeInQuad(1 - t)
  easeInQuart = t => Math.pow(t, 4)
  easeOutQuart = t => 1 - this.easeInQuart(1 - t)
}

export default CircleCanvas
