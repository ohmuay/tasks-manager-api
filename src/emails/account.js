const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"thana.w@outlook.co.th",
        subject:"Welcome to my app!",
        text:`Greeting! ${name} thank you for joininng us!`
    })
}

const sendGoodbyeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"thana.w@outlook.co.th",
        subject:"Sad to see you go :(",
        text:`Goodbye! ${name} hope to see you back again soon!`
    })
}

module.exports = {sendWelcomeEmail,sendGoodbyeEmail}