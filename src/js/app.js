import LocomotiveScroll from 'locomotive-scroll'
import I from "./i"
import Cards from "./cards"
import Testimonials from './testimonials'
import DebugGrid from "./debug-grid"
import HeaderDate from "./header_date"
import Router from "./router"
import CircleCanvas from "./circle-canvas"
import Darkmode from "./darkmode"
import Spy from "./spy"
import Splitter from "./splitter"
import Transitions from "./transitions";
import Gallery from "./gallery";
import Slider from "./slider";
import MenuMobile from "./menu_mobile";
import DateFormatter from "./date";

class App {
  locomotive = null
  spy = null
  container = document
  is_desktop = true

  mobileInit = _ => {
    console.debug('--- App mobile init')
    this.is_desktop = false
    this.init()
  }

  init = _ => {
    console.debug('--- App init')
    this.startServices()
    new Transitions({
      callback: _ => {
        this.locomotive.destroy()
        this.startServices()
      }
    })

    window.addEventListener('resize', this.throttle(this.onWindowResize, 300))
  }

  onWindowResize = _ => new CircleCanvas({desktop: this.is_desktop})

  startServices = _ => {
    this.initScrollonImageLoad()
    new HeaderDate()
    const router = new Router()
    if (router.isIndex()) {
      setTimeout(_ => {
        const testimonial_content = document.querySelectorAll(".testimonials_default-content")
        new Splitter({
          elements: testimonial_content
        }).split()
        new I({elements: testimonial_content})
      }, 1000)
      new Cards()
      new Slider()
      if (this.is_desktop) {
        new Testimonials()
      }
    } else if (router.isTemoignages()) {
      new Gallery()
    } else if (router.isPost()) {
      new DateFormatter({elements: document.querySelectorAll('.post_date')})
    } else if (router.isInspiration()) {
      new Gallery()
      new DateFormatter({elements: document.querySelectorAll('.figure_date')})
    }
    new CircleCanvas({desktop: this.is_desktop})
    new I({})
    if (this.is_desktop) {
      if (this.spy) {
        this.spy.reload()
      } else {
        this.spy = new Spy()
      }
    } else {
      setTimeout(_ => {
        new MenuMobile()
      })
    }

    // non critical load
    this.disablePageReloadOnSamePageLink()
    new DebugGrid()
    new Darkmode()
  }

  initScrollonImageLoad = _ => {
    Promise.all([...this.container.querySelectorAll('img')]
      .filter(img => !img.complete)
      .map(img => new Promise(resolve => {
        img.onload = img.onerror = resolve
      }))).then(this.initScroll)
  }

  disablePageReloadOnSamePageLink = _ => this.container.querySelectorAll('a[href]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.currentTarget.href === window.location.href) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  })

  initScroll = _ => {
    console.debug('New scroll')
    setTimeout(_ => {
      this.locomotive = new LocomotiveScroll({
        el: this.container.querySelector('[data-scroll-container]'),
        smooth: true,
      })
    }, 200)
  }

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

export default App
