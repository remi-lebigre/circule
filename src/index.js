import './scss/main.scss'
import App from "./js/app"
import NoJS from "./js/no_js"
import I from "./js/i"
import Cards from "./js/cards"
import Testimonials from './js/testimonials'
import DebugGrid from "./js/debug-grid"
import HeaderDate from "./js/header_date";
import Router from "./js/router";
import CircleCanvas from "./js/circle-canvas";

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
  new HeaderDate()

  if (new Router().isIndex()) {
    new Cards()
    new Testimonials()
  }

  new DebugGrid()
  new CircleCanvas()
}
