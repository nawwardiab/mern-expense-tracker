import nodemailer from "nodemailer";

export async function sendInvitationEmail(email, groupName, inviteLink) {
  // ! 1) Create test account
  let testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal test account:", testAccount);

  // ! 2) Create transporter with the generated credentials
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true if 465, false if other
    auth: {
      user: testAccount.user, // from createTestAccount
      pass: testAccount.pass,
    },
  });

  // ! 3) Email message details
  const mailOptions = {
    from: '"Expense Tracker" <no-reply@expensetracker.com>',
    to: email,
    subject: `You have been invited to join ${groupName}`,
    text: `Hello!\n\nYou have been invited to join the group "${groupName}". Click the link to join:\n\n${inviteLink}\n\nThanks!`,
  };

  // ! 4) Send mail
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // ! Preview URL in the console:
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
