import * as nodemailer from 'nodemailer';
import { mail as mailConfig } from '../config';
import * as fs from 'fs';

export class MailService {

    private mailTransporter = nodemailer.createTransport(mailConfig);

    sendTemplate(to, subject, templateName, replacements) {
        return new Promise(((resolve, reject) => {
            fs.readFile(`${__dirname}/../../resources/mail/${templateName}.template`, 'utf8', ((error, data) => {

                if (error) {
                    return reject({ error });
                }

                let html = data;

                Object.keys(replacements).forEach(key => html = html.replace(`\${${key}}`, replacements[key]));

                this.send(to, subject, html)
                    .then(() => resolve())
                    .catch((error => reject({ error })));
            }));
        }));
    }

    send(to, subject, html) {
        return new Promise(((resolve, reject) => {
            this.mailTransporter.sendMail(
                {
                    to, subject, html,
                    from: {
                        name: 'GameHubOne',
                        address: 'noreply@gamehub.one'
                    },
                    bcc: 'log@gamehub.one'

                },
                (error) => {
                    if (error) return reject({ error });
                    resolve();
                }
            );
        }));
    }
}
