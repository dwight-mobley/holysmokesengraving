import {Resend} from 'resend';
import { logger } from './logger';


const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_ADDRESS = 'Holy Smokes Engraving <orders@holysmokesengraving.com>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

type SendEmailOptions = {
    to: string;
    subject: string,
    react: React.ReactElement
}

export async function sendEmail({to, subject, react}: SendEmailOptions): Promise<void>{
    try{
        const {error} = await resend.emails.send({
            from: FROM_ADDRESS,
            to,
            subject,
            react
        });
        if(error){
            logger.error({error, to, subject}, 'Resend API Error')
        }else{
            logger.info({to, subject}, 'Email Sent');
        }
    }catch(err){
        logger.error({err, to, subject}, 'Failed to send email')
    }
}