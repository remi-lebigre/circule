class I {
  tags = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .text-link, .text-callout')

  constructor () {
    this.tags.forEach(tag => this.recursive(tag, 3))
  }

  recursive = (r, nest_level) => {
    ;[...r.childNodes].filter(c => c.nodeType === 3).forEach(this.replaceNode)
    ;[...r.children].forEach(c => {
      if (nest_level > 0) {
        nest_level--
        this.recursive(c, nest_level)
      }
    })
  }

  replaceNode = node => {
    let content = node.textContent.split(/[iI]/)
    let frag = document.createDocumentFragment()

    content.forEach((c, index) => {
      frag.appendChild(document.createTextNode(c))
      if (index < content.length - 1) {
        let span = document.createElement('span')
        span.textContent = 'i'
        span.className = 'text-italic'
        frag.appendChild(span)
      }
    })

    node.replaceWith(frag)
  }
}

export default I
