class Splitter {
  constructor ({elements}) {
    this.elements = elements
  }

  split = _ => {
    this.elements.forEach((el) => {
      const maxwidth = el.getBoundingClientRect().width - 20
      const words = el.textContent.split(" ")
      const lines = []
      let curline = []

      const canvasEl = document.createElement("canvas")
      const ghost =
        "OffscreenCanvas" in window
          ? canvasEl.transferControlToOffscreen()
          : canvasEl;
      const context = ghost.getContext("2d")

      context.font = `normal ${this.elementProp(el, 'font-size')} SuisseIntl`

      for (let i = 0; i < words.length; i++) {
        curline.push(words[i])
        if (context.measureText(curline.join(" ")).width >= maxwidth) {
          const cache = curline.pop()
          lines.push(curline.join(" "))
          curline = [cache]
        }
      }
      lines.push(curline.join(" "))

      el.innerHTML = lines.map(l => `<span class="title-animation"><span class="title-animation_content">${l}</span></span>`).join('')
    })
  }

  elementProp = (el, prop) => window.getComputedStyle(el, null).getPropertyValue(prop)
}

export default Splitter
