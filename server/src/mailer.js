import "dotenv/config"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
	host: process.env.email_server_host,
	port: process.env.email_server_port,
	secure: true,
	auth: {
		user: process.env.email_server_user,
		pass: process.env.email_server_password,
	},
})

export async function email(emailId, subject, content) {
	const info = await transporter.sendMail({
		from: '"Roomie" <roomie@khushrajrathod.com>',
		to: emailId,
		subject,
		text: content,
	})

	console.log("Message sent: %s", info.messageId)
}

