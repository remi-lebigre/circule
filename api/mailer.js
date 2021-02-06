const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = response => {
  const msg = {
    to: 'remi.lebigre@gmail.com',
    from: 'remi.lebigre@gmail.com',
    subject: 'Circule booking',
    html: '<strong>Hello :)</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      response.send('Email sent')
    })
    .catch((error) => {
      console.log(error)
      response.send('Email not sent')
    })
}

export default (req, response) => {
  if (req.query.send === process.env.MAILER_TOKEN) {
    sendEmail(response)
  } else {
    response.send('ohla')
  }
}
