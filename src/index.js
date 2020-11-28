import './scss/main.scss'
import App from "./js/app"
import NoJS from "./js/no_js"
import I from "./js/i"
import Cards from "./js/cards"
import Testimonials from './js/testimonials'

{
  const isMobile = _ => window.matchMedia('only screen and (max-width: 760px)').matches
  const app = new App()
  if (isMobile()) {
    app.mobileInit()
  } else {
    app.init()
  }
  new NoJS()
  new I()
  new Cards()
  new Testimonials()
}
