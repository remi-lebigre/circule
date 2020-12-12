class DebugGrid {
  constructor () {
    console.debug('New debug-grid')

    document.querySelector('.debug-grid-cta').addEventListener('click', this.toggle)
    this.grid = document.querySelector('.debug-grid')
  }

  toggle = _ => this.grid.classList.toggle('debug-grid--show')
}

export default DebugGrid
