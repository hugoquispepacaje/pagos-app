const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, EMAIL_FROM, EMAIL_PAGOS } = process.env;
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const options = {
  viewEngine: {
    layoutsDir: path.join(__dirname, '../mailviews/layouts'),
    extname: '.hbs'
  },
  extName: '.hbs',
  viewPath: 'mailviews'
};

transporter.use('compile', hbs(options));

const sendPaidMail = (email, data) => {
  let emailConfiguration = setEmailContent(email, 'Confirmación de Pago', 'pay_confirmation', { data });
  return sendEmail(emailConfiguration);
}

const sendNewPay = (data) => {
  let emailConfiguration = setEmailContent(EMAIL_PAGOS, 'Nuevo pago recibido', 'new_pay', { data });
  return sendEmail(emailConfiguration);
}
const setEmailContent = (destinyEmail, subject, template, context) => {
  let emailConfiguration = {
    from: EMAIL_FROM,
    to: destinyEmail,
    subject: subject,
    template: template,
    context: context
  }
  return emailConfiguration;
};

const sendEmail = async (emailConfiguration) => {
  try {
    return await transporter.sendMail(emailConfiguration);
  }
  catch (error) {
    //console.log(error);
    return error;
  }
}
module.exports = {
  sendPaidMail,
  sendNewPay
}