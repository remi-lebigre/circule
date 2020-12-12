"use strict"

class NoJS {
  no_js_tag = document.querySelector('.no-js')

  constructor () {
    console.debug('New no-js')
    this.no_js_tag.parentNode.removeChild(this.no_js_tag)
  }
}

export default NoJS
