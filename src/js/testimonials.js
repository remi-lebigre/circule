class Testimonials {
  constructor () {
    this.container = document.querySelector('.testimonials')
    this.header = document.querySelector('.testimonials_header')
    this.quote = document.querySelector('.testimonials_quote')
    this.name = document.querySelector('.testimonials_name')
    this.testimonials = document.querySelectorAll('.testimonial')
    this.testimonials.forEach(c => {
      c.addEventListener('mouseenter', this.hoverIn)
      c.addEventListener('mouseleave', this.hoverOut)
      c.addEventListener('click', this.click)
    })
  }

  hoverIn = ({target, target: {dataset: {name}}}) => {
    this.container.classList.add('testimonials--hover')
    this.quote.innerHTML = target.querySelector('.testimonial_quote').innerHTML
    this.name.innerText = name
  }

  hoverOut = _e => this.container.classList.remove('testimonials--hover')
}

export default Testimonials
