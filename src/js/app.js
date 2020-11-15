import LocomotiveScroll from 'locomotive-scroll';

class App {
  mobileInit = _ => {
    console.debug('--- App mobile init')
  }

  init = _ => {
    console.debug('--- App desktop init')
    const locomotive = new LocomotiveScroll({el: document.querySelector('[data-scroll-container]'), smooth: true, getDirection: true})
    locomotive.on('scroll', this.onScroll)
    locomotive.on('call', this.onCall)
  }

  onCall = action => console.log(`Scroll action call - ${action}`)
  onScroll = event => console.log(`Scroll event direction - ${event.direction}`)
}

export default App
