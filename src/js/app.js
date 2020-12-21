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

class App {
  locomotive = null
  container = document

  mobileInit = _ => {
    console.debug('--- App mobile init')
  }

  init = _ => {
    console.debug('--- App desktop init')
    new Spy()
    this.startServices()
    new Transitions({
      callback: _ => {
        this.locomotive.destroy()
        this.startServices()
      }
    })
  }

  startServices = _ => {
    this.initScrollonImageLoad()
    new HeaderDate()
    const router = new Router()
    if (router.isIndex()) {
      new Splitter({
        elements: document.querySelectorAll(".testimonials_default-content")
      }).split()
      new Cards()
      new Testimonials()
    }
    new CircleCanvas()
    new I({})
    new DebugGrid()
    new Darkmode()
    this.disablePageReloadOnSamePageLink()
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
    window.wscroll = 0
    setTimeout(_ => {
      this.locomotive = new LocomotiveScroll({
        el: this.container.querySelector('[data-scroll-container]'),
        smooth: true,
        // getDirection: true
      })
      this.locomotive.on('scroll', this.onScroll)
      // locomotive.on('call', this.onCall)
    }, 200)
  }

  // onCall = action => console.log(`Scroll action call - ${action}`)
  onScroll = ({scroll: {y}}) => window.wscroll = y
}

export default App
