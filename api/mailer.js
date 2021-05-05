const formidable = require("formidable");
const nodemailer = require("nodemailer");

// const allowCors = (fn) => async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }
//   return await fn(req, res);
// };

const sendEmail = (
  {
    fields: { first_name, last_name, email, birthday, message },
    files: { photo },
  },
  response
) => {
  const msg = {
    to: process.env.BOOKING_FORM_MAIL_TO,
    from: process.env.OVH_SMTP_USER,
    subject: "Nouveau booking !",
    html: `<strong>Nouvelle demande de booking !</strong>
      <ul>
      <li>Prénom : ${first_name}</li>
      <li>Nom : ${last_name}</li>
      <li>Email : ${email}</li>
      <li>Date de naissance : ${birthday}</li>
    </ul>
    <p>Message : ${message}</p>`,
    attachments: photo
      ? [
          {
            filename: photo.name,
            path: photo.path,
            type: photo.type,
          },
        ]
      : [],
  };

  // https://docs.ovh.com/fr/emails/configuration-outlook-com/
  const mailer = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 587,
    auth: {
      user: process.env.OVH_SMTP_USER,
      pass: process.env.OVH_SMTP_PASSWORD,
    },
  });

  mailer.sendMail(msg, (err, res) => {
    if (err) {
      console.log("error");
      console.dir(err);
      response.status(500).json({
        error: "Erreur d'envoi. Contactez l'administrateur du site !",
        details: err,
      });
    }
    if (res) {
      console.log("Mail response: ");
      console.dir(res.response);
      response.status(200).json({ success: "email envoyé !" });
    }
  });
};

const handler = (req, response) => {
  const form = new formidable.IncomingForm();
  const error = (message) => response.status(500).json({ error: message });

  form.parse(req, (err, fields, files) => {
    console.log("form data:");
    if (err) {
      console.dir(err);
    }
    console.dir(fields);
    console.dir(files);

    const { first_name, last_name, email, birthday, message } = fields;
    if (!first_name) {
      return error("Le champ prénom est requis");
    }
    if (!last_name) {
      return error("Le champ nom est requis");
    }
    if (!email) {
      return error("Le champ email est requis");
    }
    if (!birthday) {
      return error("La date de naissance est demandée");
    }
    if (!message) {
      return error("Un petit message est requis");
    }
    if (files.photo.size > 1500000) {
      return error("La photo doit peser moins de 1.5Mo !");
    }
    if (!["image/png", "image/jpeg"].includes(files.photo.type)) {
      return error("La pièce jointe doit être une image jpg ou png !");
    }

    sendEmail({ fields, files }, response);
  });
};

// module.exports = allowCors(handler);
module.exports = handler;
