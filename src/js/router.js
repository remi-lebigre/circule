class Router {
  INDEX_MATCHERS = ['index.html', '']
  GALLERY_MATCHERS = ['inspiration', 'inspiration.html', 'temoignages', 'temoignages.html']

  constructor () {
    this.location = window.location
  }

  isIndex = _ => this.INDEX_MATCHERS.some(m => m === this.path())
  isGallery = _ => this.GALLERY_MATCHERS.some(m => m === this.path())
  path = _ => this.location.pathname.substring(1)
}

export default Router
