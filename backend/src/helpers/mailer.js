import nodemailer from 'nodemailer';

export async function sendVerificationEmail(username, email, verifyCode) {
  try {

    console.log('MAILER_USER:', process.env.MAILER_USER);
console.log('MAILER_PASS:', process.env.MAILER_PASS);


    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    // const emailHtml = ReactDOMServer.renderToStaticMarkup(
    //   VerificationEmail ({username,otp:verifyCode})
    // );

    const mailOptions = {
      from: 'devheinji@gmail.com',
      to: email,
      subject: 'Verification Code',
      html: `
    
         
            <h2>Hello ${username},</h2>
            <p>
              Thank you for registering. Please use the following verification code to
              complete your registration:
            </p>
            <p>${verifyCode}</p>
            <p>If you did not request this code, please ignore this email.</p>
             <a href={${process.env.DOMAIN}/verify/${username}} style="color: #61dafb;">Verify here</a> 
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('info', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error.message);
  }
}