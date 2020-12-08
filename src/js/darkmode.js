import Cookies from "./cookies"

class Darkmode {
  DARKMODE_COOKIE = 'darkmode_cookie_circule'
  body = document.querySelector('body')
  cta = document.querySelector('.darkmode_cta')
  cookie = new Cookies()

  constructor () {
    this.cta.addEventListener('click', this.toggle)
    const darkmode_enabled = this.cookie.get(this.DARKMODE_COOKIE)
    !darkmode_enabled ? this.unset() : this.set()
  }

  toggle = _ => {
    const darkmode_enabled = this.cookie.get(this.DARKMODE_COOKIE)
    darkmode_enabled ? this.unset() : this.set()
  }
  set = _ => {
    this.body.setAttribute('darkmode', true)
    this.cookie.set(this.DARKMODE_COOKIE, true, 10)
  }
  unset = _ => {
    this.body.removeAttribute('darkmode')
    this.cookie.set(this.DARKMODE_COOKIE, false, 10)
  }
}


export default Darkmode
