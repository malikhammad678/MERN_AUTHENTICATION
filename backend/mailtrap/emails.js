import { mailTrapclients, sender } from "./mailtrap.config.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templates.js"

export const sendVerifyEmail = async (email,verifyToken) => {
    const recipient = [{email}]
    try{
       const response = await mailTrapclients.send({
        from:sender,
        to: recipient,
        subject:"Verify your email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verifyToken),
        category:"Email Verification"
       })
       console.log("email sent successfully",response);
    }catch(error){
      console.log(`error in sending email ${error}`)
    }
}

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}]
    try {
        const response = await mailTrapclients.send({
            from: sender,
            to: recipient,
            subject:"Email Verified Successfully",
            html:WELCOME_EMAIL_TEMPLATE.replace("{firstName}",name),
           category:"Email Verification"
        })
        console.log("email sent successfully",response);
    } catch (error) {
        console.log("error in sending welcome email")
    }
}

export const sendForgetEmail = async (email,link) => {
    const recipient = [{email}]
    try {
        const response = await mailTrapclients.send({
            from:sender,
            to:recipient,
            subject:"Forget Passsword",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",link),
            category:"Forget Password"
        })
        console.log("email sent successfully",response);
    } catch (error) {
        console.log("error in sending email",error);
    }
}

export const sendSuccessPassRecovery = async (email) => {
    const recipient = [{email}]
    try {
        const response = await mailTrapclients.send({
            from:sender,
            to:recipient,
            subject:"Password Reset successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Forget Password"
        })
        console.log("email sent successfully",response);
    } catch (error) {
        console.log("error in sending email",error);
    }
}
