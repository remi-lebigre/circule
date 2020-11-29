class Router {
  INDEX_MATCHERS = ['index.html', '']
  INPIRATION_MATCHERS = ['inspiration.html', 'inspiration']

  constructor () {
    this.location = window.location
  }

  isIndex = _ => this.INDEX_MATCHERS.some(m => m === this.path())
  isInspiration = _ => this.INPIRATION_MATCHERS.some(m => m === this.path())
  path = _ => this.location.pathname.substring(1)
}

export default Router
