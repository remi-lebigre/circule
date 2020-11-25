class I {
  tags = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .text-h1, .text-h4, .text-link, .text-callout')

  constructor () {
    this.tags.forEach(tag => this.recursive(tag, 3))
  }

  recursive = (r, nest_level) => {
    ;[...r.childNodes].filter(this.filterReplacedCharacters).forEach(this.replaceNode)
    ;[...r.children].forEach(c => {
      if (nest_level > 0) {
        nest_level--
        this.recursive(c, nest_level)
      }
    })
  }

  filterReplacedCharacters = c => c.nodeType === 3 && c.textContent !== 'i' && c.textContent !== 'I'
  createItalicSpan = letter => {
    let span = document.createElement('span')
    span.textContent = letter
    span.className = 'text-italic'
    return span
  }
  replaceNode = node => {
    const content = node.textContent.split(/[i]/)
    let frag = document.createDocumentFragment()

    content.forEach((c, index) => {
      const upcase_content = c.split(/[I]/)

      if (upcase_content.length > 1) {
        upcase_content.forEach((uc, ui) => {
          frag.appendChild(document.createTextNode(uc))
          if (ui < upcase_content.length - 1) {
            frag.appendChild(this.createItalicSpan('I'))
          }
        })
      } else {
        frag.appendChild(document.createTextNode(c))
      }

      if (index < content.length - 1) {
        frag.appendChild(this.createItalicSpan('i'))
      }
    })

    node.replaceWith(frag)
  }
}

export default I
