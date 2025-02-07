const nodemailer = require("nodemailer");
class MailService {
    transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'hilton.witting98@ethereal.email',
                pass: 'Dud8JU6ESFU1rbfMVJ'
            }
        });
    }

    async sendMail(receivers, subject, text, html){
        console.log(receivers, subject, text, html)
        let info = await this.transporter.sendMail({
            from: '"Node js" <nodejs@example.com>',
            to: receivers,
            subject: subject,
            text: text,
            html:
                html,
        }).catch(console.error)
        console.log("Message sent: %s", info.messageId);
    }
}

module.exports = new MailService()