class HeaderDate {
  constructor () {
    document.querySelector('.header_paris-time').innerText = this.parisHoursAndMinutes()
  }

  parisHoursAndMinutes = _ => {
    let time = this.parisTime()
    return time.substring(0, time.lastIndexOf(':'))
  }

  parisTime = _ => new Date().toLocaleTimeString("fr-FR", {timeZone: 'Europe/Paris'})

}

export default HeaderDate
