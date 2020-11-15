class NoJS {
  no_js_tag = document.querySelector('.no-js')

  constructor () {
    this.no_js_tag.parentNode.removeChild(this.no_js_tag)
  }
}

export default NoJS
