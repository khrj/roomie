import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

export const signUp = async (
	email,
	password,
	phone,
	designation,
	bitsId,
	personName,
	isAdmin
) => {
	const account = await prisma.account.create({
		data: {
			email,
			password,
			phone,
			designation,
			bitsId,
			personName,
			admin: isAdmin,
			accessToken: randomUUID(),
		},
	})

	return account.accessToken
}

export const login = async (email, password) => {
	const foundAccount = await prisma.account.findUnique({ where: { email } })

	if (!foundAccount || foundAccount.password !== password)
		throw new Error("Invalid credentials")

	const account = await prisma.account.update({
		where: { email },
		data: { accessToken: randomUUID() },
	})

	return account.accessToken
}

export const getAllRooms = () => prisma.room.findMany()

export const getAvailableRooms = async (date, requestedSlots) => {
	const rooms = await prisma.room.findMany({
		include: {
			Request: true,
		},
	})

	const availableRooms = rooms.filter(room => {
		const approvedRequestsOnDate = room.Request.filter(
			request => request.date === date && request.status === "Approved"
		)

		const isAvailable = approvedRequestsOnDate.every(request => {
			return !requestedSlots.some(slot => request.slots.includes(slot))
		})

		return isAvailable
	})

	return availableRooms
}

export const getMyRequests = async accessToken => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
		include: { Request: true },
	})

	if (!account) throw new Error("Unauthorised")

	return account.Request
}

export const getRequestAuthorEmail = async requestId => {
	const request = await prisma.request.findUnique({
		where: { id: requestId },
		include: { author: true },
	})

	return request.author.email
}

export const createRequest = async (
	accessToken,
	date,
	slots,
	roomId,
	purpose
) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	const request = await prisma.request.create({
		data: {
			date,
			slots,
			purpose,
			author: { connect: { id: account.id } },
			room: { connect: { id: roomId } },
			status: "Pending",
		},
	})

	return request
}

export const deleteRequest = async (accessToken, requestId) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	const request = await prisma.request.findUnique({
		where: { id: requestId },
	})

	if (request.accountId !== account.id)
		throw new Error("You are not authorized to delete this request")

	await prisma.request.delete({ where: { id: requestId } })
}

export const viewAllRequests = async accessToken => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to view all requests")

	const requests = await prisma.request.findMany({
		include: {
			author: true,
			room: true,
		},
		orderBy: { id: "desc" },
	})

	return requests
}

export const acceptRequest = async (accessToken, requestId) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to accept requests")

	await prisma.request.update({
		where: { id: requestId },
		data: { status: "Approved" },
	})
}

export const denyRequest = async (accessToken, requestId) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to deny requests")

	await prisma.request.update({
		where: { id: requestId },
		data: { status: "Rejected" },
	})
}

export const addCommentOnRequest = async (accessToken, requestId, comment) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to deny requests")

	await prisma.request.update({
		where: { id: requestId },
		data: { comments: comment },
	})
}

export const createRoom = async (accessToken, roomName, capacity) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to create rooms")

	const room = await prisma.room.create({
		data: {
			name: roomName,
			capacity,
		},
	})

	return room
}

export const deleteRoom = async (accessToken, roomId) => {
	const account = await prisma.account.findUnique({
		where: { accessToken },
	})

	if (!account || !account.admin)
		throw new Error("You are not authorized to delete rooms")

	await prisma.room.delete({ where: { id: roomId } })
}
