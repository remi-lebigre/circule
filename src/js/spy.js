class Spy {

  ICON_OFFSET_X = 2
  ICON_OFFSET_Y = 18

  constructor () {
    console.debug('New spy')
    this.spy = document.querySelector('.spy')

    // Use throttle if need be
    // document.addEventListener('mousemove', this.throttle(this.onMouseMove, 20))
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousemove', this.reveal, {once: true})
  }

  onMouseMove = ({clientX, clientY}) => {
    this.spy.style.transform = `translate3d(${clientX - this.ICON_OFFSET_X}px,${clientY - this.ICON_OFFSET_Y}px,0)`
  }
  reveal = _ => this.spy.classList.remove('spy--hidden')

  throttle = (func, wait, options) => {
    let context, args, result
    let timeout = null
    let previous = 0
    if (!options) options = {}
    let later = function () {
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function () {
      let now = Date.now()
      if (!previous && options.leading === false) previous = now
      let remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }
}

export default Spy
