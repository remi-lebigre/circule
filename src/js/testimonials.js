import Splitter from "./splitter";
import I from "./i";

class Testimonials {
  reveal_timeout = null
  constructor () {
    console.debug('New testimonials')

    this.container = document.querySelector('.testimonials')
    this.header = document.querySelector('.testimonials_header')
    this.quote = document.querySelector('.testimonials_quote')
    this.name = document.querySelector('.testimonials_name')
    this.testimonials = document.querySelectorAll('.testimonial')
    this.testimonials.forEach(c => {
      c.addEventListener('mouseenter', this.hoverIn)
      c.addEventListener('mouseleave', this.hoverOut)
    })
  }

  hoverIn = ({target, target: {dataset: {name}}}) => {
    this.quote.innerHTML = target.querySelector('.testimonial_quote').innerHTML
    setTimeout(_ => {
      new Splitter({elements: [this.quote]}).split()
      setTimeout(_ => {
        new I({elements: [this.quote]})
      }, 1)
    }, 1)
    this.name.innerText = name
    this.container.classList.add('testimonials--hover')
    this.reveal_timeout =setTimeout(this.reveal, 100)
  }
  reveal = _ => this.quote.classList.add('is-inview')

  hoverOut = _e => {
    clearTimeout(this.reveal_timeout)
    this.quote.classList.remove('is-inview')
    this.container.classList.remove('testimonials--hover')
  }
}

export default Testimonials
