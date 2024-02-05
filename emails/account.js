const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name)=>{
    sgMail.send({
        to : email ,
        from : 'ahmedaymana68@gmail.com',
        subject : 'thanks for joining in !',
        text : `Welcome to the app , ${name}. let me know how you get along to the app  `
    })
    .then(() => console.log('Email sent successfully'))
    .catch((err)=>console.log('Error',err))
}

const sendCancelationEmail = (email , name )=>{
    sgMail.send({
        to : email ,
        from : 'ahmedaymana68@gmail.com',
        subject : ' Sorry to see you go !',
        text : `goodbye ,${name} . I hope to see you back sometime soon. `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}