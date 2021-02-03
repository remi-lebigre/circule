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
  height = window.screen.height
  width = window.innerWidth
  initial_radius = 0
  radius = 0
  frame = 0
  target = null
  body = document.querySelector('body')
  flag = null

  // the more steps the slower the animation is
  STEPS_IN = 300
  STEPS_OUT = 450
  easing_in = t => t
  easing_out = t => t

  COLOR_YELLOW = "#e9ff1d"
  state = 'finished'

  is_desktop = false

  constructor ({desktop}) {
    console.debug('New circle-canvas')
    this.is_desktop = desktop
    this.initListeners()
    this.initCanvas()
  }

  toggleFlag = _ => this.flag.classList.toggle('circle-flag--show')

  initListeners = _ => document.querySelectorAll('.circle').forEach(c => {
    c.addEventListener(this.is_desktop ? 'mouseenter' : 'touchstart', this.hoverIn)
    c.addEventListener(this.is_desktop ? 'mouseleave' : 'touchend', this.hoverOut)
  })

  initCanvas = _ => {
    this.max = (this.height > this.width ? this.height : this.width)
    this.canvases = document.querySelectorAll(".circle-canvas")
    this.ctxs = [...this.canvases].map(c => {
      c.setAttribute('height', `${c.clientHeight}px`)
      c.setAttribute('width', `${c.clientWidth}px`)
      return c.getContext("2d")
    })
  }

  isDrawingIn = _ => this.state === 'drawing-in'
  isDrawingOut = _ => this.state === 'drawing-out'
  isFinished = _ => this.state === 'finished'

  drawIn = _ => {
    console.debug('STATE - drawing-in')
    this.body.setAttribute('circle', true)
    this.frame = 0
    this.state = 'drawing-in'
    this.animate()
  }
  drawOut = ({frame}) => {
    console.debug('STATE - drawing-out')
    this.body.removeAttribute('circle')
    this.frame = frame
    this.state = 'drawing-out'
    this.animate()
  }
  finish = _ => {
    console.debug('STATE - finished')
    this.frame = 0
    this.state = 'finished'
    this.clear()
  }

  initCircle = ({target}) => this.initial_radius = target.getBoundingClientRect().width / 1.9

  hoverIn = ({target}) => {
    this.target = target
    this.flag = document.querySelector('.circle-flag')
    this.toggleFlag()
    this.initCircle({target})
    if (this.isFinished()) {
      this.drawIn()
    } else if (this.isDrawingOut()) {
      this.delayDrawIn()
    }
  }

  hoverOut = _ => {
    this.toggleFlag()
    this.finish()
  }

  targetCoords = _ => {
    const coords = this.target.getBoundingClientRect()
    return {x: coords.x + coords.width / 2, y: coords.y + coords.height / 2}
  }
  ctxsInView = _ => this.ctxs.filter(c => c.canvas.classList.contains('is-inview') || this.isCanvasMain(c.canvas))
  isCanvasMain = canvas => canvas.classList.contains('circle-canvas--main')
  clear = _ => this.ctxsInView().forEach(c => c.clearRect(0, 0, this.width, this.height))

  drawCircle = _ => {
    this.clear()
    this.ctxsInView().forEach(c => {
      let {x, y} = this.targetCoords()

      if (!this.isCanvasMain(c.canvas)) {
        y -= c.canvas.getBoundingClientRect().top
        x -= c.canvas.getBoundingClientRect().x
      }

      c.fillStyle = this.COLOR_YELLOW
      this.fill({context: c, x, y})
    })
  }

  fill = ({context, x, y}) => {
    context.beginPath();
    context.arc(x, y, this.radius < 0 ? 0 : this.radius, 0, 2 * Math.PI, false)
    context.fill()
  }

  animate = _ => {
    this.frame += 1

    // console.debug(this.state, this.frame, this.radius)

    let steps = this.STEPS_IN
    if (this.isDrawingIn()) {
      this.radiusUp(steps)
    } else if (this.isDrawingOut()) {
      steps = this.STEPS_OUT
      this.radiusDown(steps)
    } else if (this.isFinished()) {
      this.radius = 0
      this.drawCircle()
      return
    }

    if (this.frame <= steps) {
      this.drawCircle()
      window.requestAnimationFrame(this.animate)
    } else {
      if (this.isDrawingIn()) {
        this.drawOut({frame: 0})
      } else if (this.isDrawingOut()) {
        this.drawIn()
      }
    }
  }

  radiusUp = steps => this.radius = this.initial_radius + this.max * this.easing_in(this.frame / steps)
  radiusDown = steps => this.radius = this.initial_radius + this.max - (this.max * this.easing_out(this.frame / steps))
}

export default CircleCanvas
