class HeaderDate {
  constructor () {
    console.debug('New header-date')
    document.querySelectorAll('.header_paris-time').forEach(node => node.innerText = this.parisHoursAndMinutes())
  }

  parisHoursAndMinutes = _ => {
    let time = this.parisTime()
    return time.substring(0, time.lastIndexOf(':'))
  }

  parisTime = _ => new Date().toLocaleTimeString("fr-FR", {timeZone: 'Europe/Paris'})

}

export default HeaderDate
