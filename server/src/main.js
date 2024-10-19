import {
	signUp,
	login,
	getAvailableRooms,
	getAllRooms,
	getMyRequests,
	createRequest,
	deleteRequest,
	viewAllRequests,
	acceptRequest,
	denyRequest,
	createRoom,
	deleteRoom,
	getRequestAuthorEmail,
	addCommentOnRequest,
} from "./db.js"

import cors from "cors"
import express from "express"
import { email } from "./mailer.js"

const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/signup", async (req, res) => {
	const { email, password, phone, designation, bitsId, personName } = req.body

	try {
		const accessToken = await signUp(
			email,
			password,
			phone,
			designation,
			bitsId,
			personName,
			false
		)

		res.status(201).json({ accessToken })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/login", async (req, res) => {
	const { email, password } = req.body

	try {
		const accessToken = await login(email, password)
		res.status(200).json({ accessToken })
	} catch (error) {
		res.status(401).json({ error: error.message })
	}
})

app.get("/rooms", async (req, res) => {
	const { date, requestedSlots } = req.query

	try {
		const rooms = await getAvailableRooms(
			date,
			requestedSlots.split(",").map(m => parseInt(m))
		)
		res.status(200).json(rooms)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get("/roomList", async (_req, res) => {
	try {
		const rooms = await getAllRooms()
		const roomTable = Object.fromEntries(
			rooms.map(room => [room.id, room.name])
		)

		res.status(200).json(roomTable)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get("/requests", async (req, res) => {
	const { accessToken } = req.query
	try {
		const requests = await getMyRequests(accessToken)
		res.status(200).json(requests)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/requests", async (req, res) => {
	const { accessToken, date, slots, roomId, purpose } = req.body
	try {
		const request = await createRequest(
			accessToken,
			date,
			slots,
			roomId,
			purpose
		)

		res.status(201).json(request)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.delete("/requests/:id", async (req, res) => {
	const { accessToken } = req.body
	const { id } = req.params

	try {
		await deleteRequest(accessToken, parseInt(id))
		res.status(204).send()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get("/admin/requests", async (req, res) => {
	const { accessToken } = req.query
	try {
		const requests = await viewAllRequests(accessToken)
		res.status(200).json(requests)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/admin/requests/:id/accept", async (req, res) => {
	const { accessToken } = req.body
	const { id } = req.params

	try {
		await acceptRequest(accessToken, parseInt(id))

		await email(
			await getRequestAuthorEmail(parseInt(id)),
			`Room booking request ${id} accepted`,
			`Congratulations!\nYour request (ID: ${id}) has been accepted.`
		)
		res.status(200).send()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/admin/requests/:id/deny", async (req, res) => {
	const { accessToken } = req.body
	const { id } = req.params

	try {
		await denyRequest(accessToken, parseInt(id))

		await email(
			await getRequestAuthorEmail(parseInt(id)),
			`Room booking request ${id} rejected`,
			`Your request (ID: ${id}) has been denied.`
		)

		res.status(200).send()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/admin/requests/:id/comment", async (req, res) => {
	const { accessToken, comment } = req.body
	const { id } = req.params

	try {
		await addCommentOnRequest(accessToken, parseInt(id), comment)

		await email(
			await getRequestAuthorEmail(parseInt(id)),
			`Comments on room booking request ${id}`,
			`A comment has been left on your request (ID: ${id}):\n\n${comment}`
		)

		res.status(200).send()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post("/admin/rooms", async (req, res) => {
	const { accessToken, roomName, capacity } = req.body

	try {
		const room = await createRoom(accessToken, roomName, parseInt(capacity))
		res.status(201).json(room)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.delete("/admin/rooms/:id", async (req, res) => {
	const { accessToken } = req.body
	const { id } = req.params
	try {
		await deleteRoom(accessToken, parseInt(id))
		res.status(204).send()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.listen(4579, () => {
	console.log(`Server is running on http://localhost:4579`)
	console.log("Warning: SMTP may not work on BITS wifi")
})
