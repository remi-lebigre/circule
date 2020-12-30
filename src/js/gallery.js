class Gallery {
  constructor () {
    console.debug('New gallery')

    this.container = document.querySelector('.gallery')
    this.links = document.querySelectorAll('.figure_link')
    this.links.forEach(el => {
      el.addEventListener('mouseenter', this.hoverIn)
      el.addEventListener('mouseleave', this.hoverOut)
    })
  }

  hoverIn = _e => this.container.classList.add('gallery--hover')
  hoverOut = _e => this.container.classList.remove('gallery--hover')
}

export default Gallery
