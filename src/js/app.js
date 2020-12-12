import LocomotiveScroll from 'locomotive-scroll'
import barba from "@barba/core"
import barbaCss from '@barba/css'
import barbaPrefetch from "@barba/prefetch"
import I from "./i"
import Cards from "./cards"
import Testimonials from './testimonials'
import DebugGrid from "./debug-grid"
import HeaderDate from "./header_date"
import Router from "./router"
import CircleCanvas from "./circle-canvas"
import Darkmode from "./darkmode"
import Spy from "./spy"

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
    this.initPageTransitions()
  }

  startServices = _ => {
    this.initScrollonImageLoad()
    new I()
    new HeaderDate()
    const router = new Router()
    if (router.isIndex()) {
      new Cards()
      new Testimonials()
    }
    new CircleCanvas()
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

  initPageTransitions = _ => {
    let t = this
    barba.use(barbaCss)
    barba.use(barbaPrefetch)
    barba.init({
      debug: true,
      transitions: [{
        name: 'inspiration',
        leave () {
        },
        enter () {
        },
        from: {
          namespace: 'inspiration'
        },
      }]
    })
    barba.hooks.beforeEnter(({next: {container}}) => {
      this.container = container
      t.locomotive.destroy()
      t.startServices()
    })

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
