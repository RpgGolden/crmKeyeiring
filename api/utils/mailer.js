import nodemailer from 'nodemailer';

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
            host: 'smtp.rambler.ru',
            port: 465,
            secure: false,
            auth: {
                user: 'keyteiring@gmail.com',
                pass: 'test123DAs',
            },
        });

        const mailOptions = {
            from: '"KC" <keyteiring@gmail.com>',
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
