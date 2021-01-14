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
  }

  startServices = _ => {
    this.initScrollonImageLoad()
    new HeaderDate()
    const router = new Router()
    if (router.isIndex()) {
      setTimeout(_ => {
        new Splitter({
          elements: document.querySelectorAll(".testimonials_default-content")
        }).split()
      }, 1000)
      new Cards()
      new Testimonials()
      new Slider()
    } else if (router.isGallery()) {
      new Gallery()
    }
    new CircleCanvas({desktop: this.is_desktop})
    new I({})
    new DebugGrid()
    new Darkmode()
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
    setTimeout(_ => {
      this.locomotive = new LocomotiveScroll({
        el: this.container.querySelector('[data-scroll-container]'),
        smooth: true,
        // reloadOnContextChange: true,
        // smartphone: {
        //   smooth: true
        // },
        // tablet: {
        //   smooth: true
        // }
        // getDirection: true
      })
      // this.locomotive.on('scroll', this.onScroll)
      // locomotive.on('call', this.onCall)
    }, 200)
  }

  // onCall = action => console.log(`Scroll action call - ${action}`)
  // onScroll = ({scroll: {y}}) => console.log(`Scroll - ${y}`)
}

export default App
