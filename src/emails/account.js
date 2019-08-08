const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (emailaddress, name) => {
  sgMail.send({
    to: emailaddress,
    from: "asish.gnan2@gmail.com",
    subject: "Welcome Message",
    text: `Welcome ${name} to TASK_MANAGER_API!! Wohooooo!!!!!!`
  });
};

const sendLeavingMail = (emailaddress, name) => {
  sgMail.send({
    to: emailaddress,
    from: "asish.gnan2@gmail.com",
    subject: "Leaving Message",
    text: `Good Bye ${name} from TASK_MANAGER_API!! BYE!!!!!!`
  });
};

module.exports = { sendWelcomeMail, sendLeavingMail };
