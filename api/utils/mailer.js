import nodemailer from 'nodemailer';
import 'dotenv/config';
async function sendOrderConfirmationEmail(
    clientEmail,
    clientName,
    clientPhone,
    numberOfPeople,
    eventType,
    formattedEventStartDate
) {
    
    try { 
        const transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_SMTP,
                pass: process.env.PASS_SMTP,
            },
        });

        const mailOptions = {
            from: '"KC" <armperson007@yandex.ru>',
            to: clientEmail,
            subject: 'Ваш заказ создан',
            text: `Ваш заказ создан и обрабатывается.\n\nПараметры заказа:\n- Имя клиента: ${clientName}\n- Телефон: ${clientPhone}\n- Количество людей: ${numberOfPeople}\n- Тип мероприятия: ${eventType}\n- Дата начала: ${formattedEventStartDate}\n\nС вами свяжется специалист в течение некоторого времени.`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export default sendOrderConfirmationEmail;
