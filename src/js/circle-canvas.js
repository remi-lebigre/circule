import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
} from "./easing"

class CircleCanvas {
  height = window.innerHeight
  width = window.innerWidth
  initial_radius = 0
  radius = 0
  frame = 0
  target = null
  body = document.querySelector('body')

  STEPS = 50
  SCALE = 100
  COLOR_YELLOW = "#e9ff1d"
  STATUSES = ['delayed-drawing-in', 'drawing-in', 'drawn', 'drawing-out', 'delayed-drawing-out', 'finished']
  state = 'finished'

  constructor () {
    this.initListeners()
    this.initCanvas()
    this.initCircle()
  }

  initCircle = _ => {
    const circle = document.querySelector('.circle')
    this.initial_radius = circle.getBoundingClientRect().width / 2.2
  }

  initListeners = _ => document.querySelectorAll('.circle').forEach(c => {
    c.addEventListener('mouseenter', this.hoverIn)
    c.addEventListener('mouseleave', this.hoverOut)
  })

  initCanvas = _ => {
    // Multiplicator is set so that full circle occupies full screen size when at max radius
    this.max = (this.height > this.width ? this.height : this.width) * 1.5
    this.canvases = document.querySelectorAll(".circle-canvas")
    this.ctxs = [...this.canvases].map(c => {
      c.setAttribute('height', `${this.height}px`)
      c.setAttribute('width', `${this.width}px`)
      return c.getContext("2d")
    })
  }

  isDrawingIn = _ => this.state === 'drawing-in'
  isDrawn = _ => this.state === 'drawn'
  isDrawingOut = _ => this.state === 'drawing-out'
  isFinished = _ => this.state === 'finished'

  isDelayedDrawingIn = _ => this.state === 'delayed-drawing-in'
  isDelayedDrawingOut = _ => this.state === 'delayed-drawing-out'

  drawIn = _ => {
    console.debug('STATE - drawing-in')
    this.body.setAttribute('circle', true)
    this.frame = 0
    this.state = 'drawing-in'
    this.animate()
  }
  endDraw = _ => {
    console.debug('STATE - drawn')
    this.state = 'drawn'
  }
  drawOut = _ => {
    console.debug('STATE - drawing-out')
    this.body.removeAttribute('circle')
    this.frame = 0
    this.state = 'drawing-out'
    this.animate()
  }
  delayDrawIn = _ => {
    console.debug('STATE - delayed-drawing-in')
    this.state = 'delayed-drawing-in'
  }
  delayDrawOut = _ => {
    console.debug('STATE - delayed-drawing-out')
    this.state = 'delayed-drawing-out'
  }
  finish = _ => {
    console.debug('STATE - finished')
    this.frame = 0
    this.state = 'finished'
    this.clear()
  }

  hoverIn = ({target}) => {
    this.target = target
    if (this.isFinished()) {
      this.drawIn()
    } else if (this.isDrawingOut()){
      this.delayDrawIn()
    }
  }

  hoverOut = _ => {
    if (this.isDrawn()) {
      this.drawOut()
    } else if (this.isDrawingIn()) {
      this.delayDrawOut()
    }
  }

  targetCoords = _ => {
    const coords = this.target.getBoundingClientRect()
    return {x: coords.x + coords.width / 2, y: coords.y + coords.height / 2}
  }
  ctxsInView = _ => this.ctxs.filter(c => c.canvas.classList.contains('is-inview') || this.isCtxMain(c))
  isCtxMain = c => c.canvas.classList.contains('circle-canvas--main')
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

      c.fillStyle = this.COLOR_YELLOW

      const path = new Path2D(this.path({x: x, y: offset_y}))
      c.fill(this.scaleUp({path, x: x, y: offset_y, scale: this.radius / this.SCALE}))
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

  coords = (x, y) => i => [
    i[0] + x + this.rand(1),
    i[1] + y + this.rand(1),
  ]

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

  animate = _ => {
    this.frame += 1

    // console.debug(this.state, this.frame, this.radius)

    if (this.isDrawingIn() || this.isDelayedDrawingOut()) {
      this.radiusUp()
    } else if (this.isDrawingOut() || this.isDelayedDrawingIn()) {
      this.radiusDown()
    }

    if (this.frame <= this.STEPS) {
      this.drawCircle()
      window.requestAnimationFrame(this.animate)
    } else {
      if (this.isDrawingIn()) {
        this.endDraw()
      } else if (this.isDrawingOut()) {
        this.finish()
      } else if (this.isDelayedDrawingIn()) {
        this.drawIn()
      } else if (this.isDelayedDrawingOut()) {
        this.drawOut()
      }
    }
  }

  radiusUp = _ => this.radius = this.initial_radius + this.max * easeInQuart(this.frame / this.STEPS)
  radiusDown = _ => this.radius = this.initial_radius + this.max - (this.max * easeOutQuart(this.frame / this.STEPS))
}

export default CircleCanvas
