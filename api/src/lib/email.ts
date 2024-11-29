import * as nodemailer from 'nodemailer'

interface Options {
  to: string | string[]
  subject: string
  text: string
  html: string
}

export async function sendEmail({ to, subject, text, html }: Options) {
  console.log('Sending email to:', to)

  // create reusable transporter object using SendInBlue for SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Buttin <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: Array.isArray(to) ? to : [to], // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  })

  return info
}
