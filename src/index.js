import './scss/main.scss'
import App from "./js/app";
import NoJS from "./js/no_js";

{
  const isMobile = _ => window.matchMedia('only screen and (max-width: 760px)').matches
  const app = new App()
  if (isMobile()) {
    app.mobileInit()
  } else {
    app.init()
  }
  new NoJS()
}
