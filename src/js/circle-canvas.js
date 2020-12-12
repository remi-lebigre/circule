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
import BezierEasing from 'bezier-easing'

class CircleCanvas {
  height = window.innerHeight
  width = window.innerWidth
  initial_radius = 0
  radius = 0
  frame = 0
  easing = null
  circle_path = null
  x = 0
  y = 0
  body = document.querySelector('body')

  // the more steps the slower the animation is
  STEPS = 40
  SCALE = 100
  COLOR_YELLOW = "#e9ff1d"
  STATUSES = ['delayed-drawing-in', 'drawing-in', 'drawn', 'drawing-out', 'delayed-drawing-out', 'finished']
  state = 'finished'

  constructor () {
    console.debug('New circle-canvas')

    this.initListeners()
    this.initCanvas()
    this.easing = BezierEasing(.36, .33, 1, -0.37)
  }

  initListeners = _ => document.querySelectorAll('.circle').forEach(c => {
    c.addEventListener('mouseenter', this.hoverIn)
    c.addEventListener('mouseleave', this.hoverOut)
  })

  initCanvas = _ => {
    // Multiplicator is set so that full circle occupies full screen size when at max radius
    this.max = (this.height > this.width ? this.height : this.width) * 1.2
    this.canvases = document.querySelectorAll(".circle-canvas")
    this.ctxs = [...this.canvases].map(c => {
      c.setAttribute('height', `${c.clientHeight}px`)
      c.setAttribute('width', `${c.clientWidth}px`)
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
    this.selectCirclePath()
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
    this.setDefaultCirclePath()
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

  initCircle = target => {
    this.initial_radius = document.querySelector('.circle').getBoundingClientRect().width / 2.2
    this.selectCirclePath()
    let {x, y} = this.targetCoords(target)
    this.x = x
    this.y = y
  }

  hoverIn = ({target}) => {
    this.initCircle(target)
    if (this.isFinished()) {
      this.drawIn()
    } else if (this.isDrawingOut()) {
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

  targetCoords = target => {
    const coords = target.getBoundingClientRect()
    return {x: coords.x + coords.width / 2, y: coords.y + coords.height / 2}
  }
  ctxsInView = _ => this.ctxs.filter(c => c.canvas.classList.contains('is-inview') || this.isCanvasMain(c.canvas))
  isCanvasMain = canvas => canvas.classList.contains('circle-canvas--main')
  clear = _ => this.ctxsInView().forEach(c => c.clearRect(0, 0, this.width, this.height))

  rand = (input = 1) => Math.round(Math.round((Math.random() * input) * 100) / 100)

  drawCircle = _ => {
    this.clear()
    this.ctxsInView().forEach(c => {
      let y = this.y
      let x = this.x

      if (!this.isCanvasMain(c.canvas)) {
        y -= c.canvas.getBoundingClientRect().top
        x -= c.canvas.getBoundingClientRect().x
      }

      c.fillStyle = this.COLOR_YELLOW
      c.fill(this.scaleUp({path: new Path2D(this.path({x, y})), x, y, scale: this.radius / this.SCALE}))
    })
  }

  paths = [
    [
      ['M', [[45.7, -79.8]]],
      ['C', [[59.1, -71.4], [69.8, -59], [77.9, -45]]],
      ['C', [[86, -31], [91.5, -15.5], [92.1, 0.4]]],
      ['C', [[92.8, 16.2], [88.5, 32.4], [79.9, 45.6]]],
      ['C', [[71.4, 58.8], [58.5, 68.9], [44.5, 76.1]]],
      ['C', [[30.4, 83.4], [15.2, 87.7], [-0.1, 87.9]]],
      ['C', [[-15.5, 88.2], [-31, 84.3], [-44.7, 77]]],
      ['C', [[-58.5, 69.6], [-70.5, 58.6], [-77.5, 45.2]]],
      ['C', [[-84.5, 31.8], [-86.5, 15.9], [-86.7, -0.1]]],
      ['C', [[-87, -16.1], [-85.4, -32.3], [-78.6, -46.1]]],
      ['C', [[-71.8, -59.9], [-59.8, -71.3], [-45.8, -79.3]]],
      ['C', [[-31.8, -87.4], [-15.9, -92], [0.1, -92.2]]],
      ['C', [[16.1, -92.4], [32.3, -88.1], [45.7, -79.8]]],
      ['Z', [[]]],
    ],
    [
      ['M', [[45.6, -76.9]]],
      ['C', [[58.2, -71.6], [67, -57.7], [74.5, -43.4]]],
      ['C', [[82, -29.2], [88.3, -14.6], [88.8, 0.3]]],
      ['C', [[89.4, 15.2], [84.2, 30.4], [74.9, 41.5]]],
      ['C', [[65.5, 52.6], [51.9, 59.5], [38.8, 65.6]]],
      ['C', [[25.6, 71.6], [12.8, 76.8], [-1.5, 79.4]]],
      ['C', [[-15.8, 82.1], [-31.7, 82.2], [-46.1, 76.9]]],
      ['C', [[-60.5, 71.6], [-73.5, 60.8], [-80.5, 47]]],
      ['C', [[-87.5, 33.3], [-88.4, 16.7], [-87.3, 0.7]]],
      ['C', [[-86.1, -15.4], [-83, -30.7], [-74.7, -42.3]]],
      ['C', [[-66.5, -53.8], [-53.3, -61.5], [-40, -66.5]]],
      ['C', [[-26.7, -71.4], [-13.3, -73.6], [1.6, -76.3]]],
      ['C', [[16.5, -79], [32.9, -82.3], [45.6, -76.9]]],
      ['Z', [[]]]
    ],
    [
      ["M", [[41.2, -69.2]]],
      ["C", [[54, -64], [65.5, -54.2], [74.5, -41.9]]],
      ["C", [[83.5, -29.6], [90.1, -14.8], [89.6, -0.3]]],
      ["C", [[89.1, 14.3], [81.6, 28.6], [73.5, 42.3]]],
      ["C", [[65.4, 56.1], [56.6, 69.4], [44.2, 76.6]]],
      ["C", [[31.9, 83.7], [15.9, 84.7], [1.6, 81.9]]],
      ["C", [[-12.7, 79.1], [-25.4, 72.6], [-38.2, 65.7]]],
      ["C", [[-50.9, 58.8], [-63.8, 51.5], [-70, 40.5]]],
      ["C", [[-76.2, 29.5], [-75.8, 14.7], [-77.3, -0.8]]],
      ["C", [[-78.7, -16.4], [-82, -32.8], [-77.6, -47.1]]],
      ["C", [[-73.3, -61.3], [-61.3, -73.4], [-47.1, -77.9]]],
      ["C", [[-32.9, -82.4], [-16.5, -79.3], [-1.1, -77.3]]],
      ["C", [[14.2, -75.3], [28.4, -74.5], [41.2, -69.2]]],
      ["Z", [[]]],
    ],
    [
      ["M", [[39.5, -68.6]]],
      ["C", [[53.4, -60.5], [68.4, -54.3], [77.5, -43.2]]],
      ["C", [[86.5, -32.1], [89.7, -16], [89.1, -0.3]]],
      ["C", [[88.5, 15.4], [84.1, 30.7], [75.9, 43.2]]],
      ["C", [[67.6, 55.6], [55.3, 65.1], [42, 70.1]]],
      ["C", [[28.7, 75], [14.4, 75.4], [0.6, 74.5]]],
      ["C", [[-13.2, 73.5], [-26.5, 71.2], [-39, 65.7]]],
      ["C", [[-51.5, 60.3], [-63.2, 51.8], [-69.4, 40.3]]],
      ["C", [[-75.6, 28.8], [-76.3, 14.4], [-77.3, -0.6]]],
      ["C", [[-78.2, -15.5], [-79.5, -31.1], [-74.1, -44.1]]],
      ["C", [[-68.8, -57.1], [-56.9, -67.5], [-43.5, -75.9]]],
      ["C", [[-30, -84.3], [-15, -90.6], [-1.1, -88.7]]],
      ["C", [[12.8, -86.9], [25.6, -76.7], [39.5, -68.6]]],
      ["Z", [[]]],
    ],
    [
      ["M", [[37.3, -67.1]]],
      ["C", [[49.3, -57.7], [60.7, -49.7], [67.7, -38.7]]],
      ["C", [[74.7, -27.7], [77.4, -13.9], [79, 0.9]]],
      ["C", [[80.7, 15.8], [81.3, 31.5], [75, 43.7]]],
      ["C", [[68.7, 55.9], [55.5, 64.6], [41.9, 73.3]]],
      ["C", [[28.2, 82], [14.1, 90.8], [0.2, 90.5]]],
      ["C", [[-13.8, 90.3], [-27.6, 81], [-39.4, 71.2]]],
      ["C", [[-51.3, 61.5], [-61.1, 51.2], [-67.4, 39.3]]],
      ["C", [[-73.6, 27.3], [-76.3, 13.7], [-78.7, -1.4]]],
      ["C", [[-81.1, -16.4], [-83.3, -32.9], [-78.3, -47.1]]],
      ["C", [[-73.3, -61.3], [-61.2, -73.2], [-47, -81.3]]],
      ["C", [[-32.8, -89.5], [-16.4, -93.7], [-1.9, -90.5]]],
      ["C", [[12.7, -87.2], [25.3, -76.5], [37.3, -67.1]]],
      ["Z", [[]]],
    ],
  ]

  setDefaultCirclePath = _ => this.circle_path = this.paths[0]
  selectCirclePath = _ => this.circle_path = this.paths[this.rand(this.paths.length - 1)]
  path = ({x, y}) => this.circle_path.map(s => `${s[0]} ${s[1].map(this.coords(x, y)).join(' ')}`).join(' ')

  coords = (x, y) => i => [i[0] + x, i[1] + y]

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

  radiusUp = _ => this.radius = this.initial_radius + this.max * this.easing(this.frame / this.STEPS)
  radiusDown = _ => this.radius = this.initial_radius + this.max - (this.max * easeOutQuint(this.frame / this.STEPS))
}

export default CircleCanvas
