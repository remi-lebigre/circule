const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = response => {
  const msg = {
    to: 'remi.lebigre@gmail.com',
    from: 'remi.lebigre@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      response.send('Email sent')
    })
    .catch((error) => {
      response.send(error)
    })
}

export default (req, response) => {
  if (req.param.send) {
    sendEmail(response)
  }
};
