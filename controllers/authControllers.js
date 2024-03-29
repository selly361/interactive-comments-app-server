const db = require('@db')
const jdenticon = require('jdenticon')
const isExistingUser = require('@isExistingUser')
const isUsernameUsed = require('@isUsernameUsed')
const isEmailUsed = require('@isEmailUsed')
const sendError = require('@sendError')
const nodemailer = require('nodemailer')

const { generateAccessToken, generateRefreshToken } = require('@generateJwt')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
   let { email, username, password } = req.body


   const [userExists, usernamesUsed, emailsUsed] = await Promise.all([
      isExistingUser(email, username),
      isUsernameUsed(username),
      isEmailUsed(email),
   ])

   if (userExists) return sendError(res, 409, 'User Exists', 'EXISTING_USER')

   if (usernamesUsed) return sendError(res, 409, 'Username is taken', 'USERNAME_TAKEN')

   if (emailsUsed) return sendError(res, 409, 'Email is taken', 'EMAIL_TAKEN')

   const salt = await bcrypt.genSalt(10)

   const hashedPassword = await bcrypt.hash(password, salt)

   let query = `
        INSERT INTO users (email, username, profile_image, password)
        
        VALUES ($1, $2, $3, $4)
        
        RETURNING *;
    `

   const profileImage = jdenticon.toSvg(username + email, 30)

   try {
      const { rows } = await db.query(query, [email, username, profileImage, hashedPassword])

      if (rows.length === 0) {
         throw new Error('User creation failed')
      }

      res.status(200).json({ message: 'User created successfully' })
   } catch (err) {
      sendError(res, 500, 'User creation failed', 'SERVER_ERROR')
   }
}

const loginController = async (req, res) => {
   const { email, password } = req.body
   

   let query = `
  SELECT * FROM users

  WHERE email = $1;

`

   const { rows } = await db.query(query, [email])

   if (!rows.length > 0) {
      return sendError(res, 409, "User Doesn't Exist", 'INVALID_USER')
   }

   const { password: hashedPassword, user_id } = rows[0]

   const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)

   if (!isPasswordCorrect) {
      return sendError(res, 409, 'Incorrect password', 'INCORRECT_PASSWORD')
   }

   const access_token = generateAccessToken(user_id)
   const refresh_token = generateRefreshToken(user_id)

   res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
   })

   res.status(200).json({ access_token })
}

const refreshTokenController = (req, res) => {
   const refresh_token = req.cookies.refresh_token

   if (!refresh_token) {
      return sendError(res, 401, 'Refresh token not found in request', 'MISSING_REFRESH_TOKEN')
   }
   try {
      const { user_id } = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)

      const access_token = generateAccessToken(user_id)

      res.status(200).json({ access_token })
   } catch (error) {
      sendError(res, 401, 'Token is not valid', 'INVALID_TOKEN')
   }
}

const logoutController = async (req, res) => {
   res.clearCookie('refresh_token')
   res.status(200).json({ message: 'User logged out successfully' })
}

const forgetPasswordController = async (req, res) => {
   const { email } = req.body

   let query = `
    SELECT * FROM users
    WHERE email = $1;
  `

   const { rows } = await db.query(query, [email.toLowerCase()])

   if (!rows.length > 0) {
      return sendError(res, 409, 'incorrect email', 'INCORRECT_EMAIL')
   }

   const user = rows[0]
   const token = generateAccessToken(user.user_id)

   try {
      const transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port: process.env.SMTP_PORT,
         secure: process.env.SMTP_SECURE === 'true',
         auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
         },
      })

      const mailOptions = {
         from: process.env.SMTP_FROM_EMAIL,
         to: email,
         subject: 'Password reset request',
         text: `You are receiving this email because a password reset request has been made for your account.
        Please click the link below to reset your password.
        ${process.env.APP_URL}/reset-password?token=${token}`,
         html: `<p>You are receiving this email because a password reset request has been made for your account.
        Please click the link below to reset your password.</p>
        <a href="${process.env.APP_URL}/reset-password?token=${token}">Reset password</a>`,
      }

      await transporter.sendMail(mailOptions)

      res.status(200).json({
         message: 'Password reset email sent successfully',
      })
   } catch (error) {
      console.error(error)
      sendError(res, 500, 'Failed to send password reset email', 'SERVER_ERROR')
   }
}

const resetPasswordController = async (req, res) => {
   const { token } = req.params
   const { password } = req.body

   try {
      const { user_id } = jwt.verify(token, process.env.RESET_TOKEN_SECRET)

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const query = `
        UPDATE users 
        SET password = $1
        WHERE user_id = $2;
     `

      await db.query(query, [hashedPassword, user_id])

      res.status(200).json({ message: 'User password updated successfully' })
   } catch (error) {
      sendError(res, 401, 'Token is not valid or expired', 'INVALID_TOKEN')
   }
}

module.exports = {
   resetPasswordController,
   forgetPasswordController,
   registerController,
   loginController,
   refreshTokenController,
   logoutController,
}
