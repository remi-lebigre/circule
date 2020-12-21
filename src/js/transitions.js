import barba from "@barba/core";
import barbaPrefetch from "@barba/prefetch";

class Transitions {
  PANEL_CLASS = '.transition-panel'
  DARK_PANEL_CLASS = 'transition-panel--dark'
  IN_TRANSITION_CLASS = 'in-transition'
  FADE_IN_CLASS = 'fade-in'
  TRANSITION_DURATION = 750

  constructor ({callback}) {
    console.debug('New transitions')

    this.callback = callback
    barba.use(barbaPrefetch)
    barba.init({
      preventRunning: true,
      transitions: [
        {
          name: 'inspiration',
          once () {
          },
          beforeLeave: this.leaveInpi,
          enter: this.enterInpi,
          from: {
            namespace: 'inspiration'
          },
        },
        {
          name: 'inspiration',
          once () {
          },
          beforeLeave: this.leaveInpi,
          enter: this.enterInpi,
          to: {
            namespace: 'inspiration'
          },
        }
      ]
    })
    barba.hooks.once(this.once)
    barba.hooks.beforeLeave(this.beforeLeave)
    barba.hooks.leave(this.leave)
    barba.hooks.beforeEnter(this.beforeEnter)
    barba.hooks.after(this.after)
  }

  once = ({next: {container}}) => this.fadeContent(container)

  beforeLeave = ({current: {container}}) => new Promise(resolve => {
    container.classList.add(this.IN_TRANSITION_CLASS)
    resolve()
  })

  leave = ({current: {container}}) => new Promise(resolve => {
    const panel = this.panel(container)
    panel.style.transition = `transform ${this.TRANSITION_DURATION}ms cubic-bezier(.77, 0, .73, .31)`
    panel.style.transform = 'translate3d(0, 0, 0)'
    setTimeout(resolve, this.TRANSITION_DURATION)
  })

  beforeEnter = ({next: {container}}) => {
    this.container = container
    container.classList.add(this.IN_TRANSITION_CLASS)
    const panel = this.panel(container)
    panel.style.transform = 'translate3d(0, 0, 0)'
    this.callback()
  }

  after = ({next: {container}}) => {
    const panel = this.panel(container)
    panel.style.transition = `transform ${this.TRANSITION_DURATION}ms cubic-bezier(0, .7, .29, .99)`
    panel.style.transform = 'translate3d(0, -100%, 0)'
    this.fadeContent(container)
    setTimeout(this.reset(container), this.TRANSITION_DURATION)
  }

  reset = container => _ => {
    const panel = this.panel(container)
    panel.style.removeProperty('transition')
    panel.style.removeProperty('transform')
    panel.classList.remove(this.DARK_PANEL_CLASS)
    container.classList.remove(this.IN_TRANSITION_CLASS)
  }

  panel = container => container.querySelector(this.PANEL_CLASS)
  fadeContent = container => container.setAttribute(this.FADE_IN_CLASS, true)
  setDarkPanel = container => this.panel(container).classList.add(this.DARK_PANEL_CLASS)
  leaveInpi = ({current: {container}}) => this.setDarkPanel(container)
  enterInpi = ({next: {container}}) => this.setDarkPanel(container)
}


export default Transitions
