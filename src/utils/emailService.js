const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Utilisez un service comme Gmail
  auth: {
    user: process.env.EMAIL_USER, // Votre email
    pass: process.env.EMAIL_PASSWORD, // Votre mot de passe
  },
});

exports.sendActivationEmail = async (email, activationToken) => {
  const activationLink = `http://localhost:3000/api/admin/activate-mechanic?token=${activationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Activation de compte Mécanicien",
    html: `<p>Un nouveau Mécanicien a besoin d'activation. Cliquez sur ce lien pour activer son compte : <a href="${activationLink}">${activationLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};
