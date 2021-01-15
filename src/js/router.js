class Router {
  INDEX_MATCHERS = ['index.html', '']
  POST_MATCHER = 'articles'
  INSPIRATION_MATCHERS = ['inspiration', 'inspiration.html']
  TEMOIGNAGES_MATCHERS = ['temoignages', 'temoignages.html']

  constructor () {
    this.location = window.location
  }

  isIndex = _ => this.INDEX_MATCHERS.some(m => m === this.path())
  isTemoignages = _ => this.TEMOIGNAGES_MATCHERS.some(m => m === this.path())
  isPost = _ => this.path().includes(this.POST_MATCHER)
  isInspiration = _ => this.INSPIRATION_MATCHERS.some(m => m === this.path())
  path = _ => this.location.pathname.substring(1)
}

export default Router
