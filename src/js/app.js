import LocomotiveScroll from 'locomotive-scroll';

class App {
  mobileInit = _ => {
    console.debug('--- App mobile init')
  }

  init = _ => {
    console.debug('--- App desktop init')
    Promise.all([...document.querySelectorAll('img')]
      .filter(img => !img.complete)
      .map(img => new Promise(resolve => {
        img.onload = img.onerror = resolve
      }))).then(this.initScroll)
  }

  initScroll = _ => {
    setTimeout(_=>{
      const locomotive = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        // getDirection: true
      })
      // locomotive.on('scroll', this.onScroll)
      // locomotive.on('call', this.onCall)
    },200)
  }
  // onCall = action => console.log(`Scroll action call - ${action}`)
  // onScroll = event => console.log(`Scroll event direction - ${event.direction}`)
}

export default App
