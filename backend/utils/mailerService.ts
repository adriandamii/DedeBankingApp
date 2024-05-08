import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
   service: 'yahoo',
   secure: false,
   auth: {
       user: process.env.YAHOO_EMAIL,
       pass: process.env.YAHOO_PASSWORD,
   },
   tls: {
       rejectUnauthorized: false,
   },
});