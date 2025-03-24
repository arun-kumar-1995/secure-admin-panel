/**
 * Import required module
 *
 */

import nodemailer from 'nodemailer'
import { HttpStatus } from '../constants/httpStatus.constants.js'
import { APIError } from '../shared/errorHandler.shared.js'
/**
 *  Class Email Service
 *
 *  This EmailService class handles sending emails using Nodemailer.
 */

class Email {
  /**
   *  Define private variables that are used frquently
   */

  #transporter
  #senderEmail = process.env.EMAIL_USER
  #adminEmail = process.env.EMAIL_ADMIN
  #appPassword = process.env.EMAIL_PASS

  constructor() {
    //  create transporter at once
    this.#transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.#senderEmail,
        pass: this.#appPassword,
      },
    })
  }

  #sendError(response, err) {
    if (err) {
      return APIError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error sending mail :
          ${err.message}`
      )
    }
  }

  async #sendMail(response, { to, subject, text }) {
    try {
      const mailOptions = {
        from: this.#senderEmail,
        to,
        subject,
        text,
      }
      await this.#transporter.sendMail(mailOptions)
    } catch (err) {
      this.#sendError(response, err)
    }
  }

  async sendEmail(response, userEmail, emailText) {
    const options = {
      to: userEmail,
      subject: 'OTP Verification',
      text: emailText,
    }
    return this.#sendMail(response, { ...options })
  }

  async notifyAdmin(response, emailText) {
    const options = {
      to: this.#adminEmail,
      subject: 'Unauthorized Attempt',
      text: emailText,
    }
    return this.#sendMail(response, { ...options })
  }
}

/**
 * Export EmailService class as singleton
 */

export const EmailService = new Email()
