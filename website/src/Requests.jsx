import { useEffect, useState } from "react"

import {
	Card,
	Text,
	Badge,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	
} from "@tremor/react"
import Navbar from "./Nav.jsx"

const BASE_URL = "http://localhost:4579"
const mkUrl = path => BASE_URL + path

export default function Requests() {
	const [token, setToken] = useState(() => localStorage.getItem("token"))
	const [requests, setRequests] = useState([])
	const [rooms, setRooms] = useState([])

	useEffect(() => {
		fetch(mkUrl(`/requests?accessToken=${token}`)).then(r => {
			if (!r.ok) {
				localStorage.setItem("token", null)
				setToken(null)
			} else {
				r.json().then(data => setRequests(data))
			}
		})

		fetch(mkUrl("/roomList"))
			.then(r => r.json())
			.then(data => setRooms(data))
	}, [token])

	if (!token) {
		return (
			<>
				<Navbar token={token} setToken={setToken} />
				<main className="p-4 md:p-10 mx-auto max-w-7xl">
					<Card className="mt-6">
						<Text>Sign in to view your requests.</Text>
					</Card>
				</main>
			</>
		)
	}

	const requestStatusColor = {
		Pending: "yellow",
		Approved: "emerald",
		Rejected: "red",
	}

	return (
		<>
			<Navbar token={token} setToken={setToken} />
			<main className="p-4 md:p-10 mx-auto max-w-7xl">
				<Card className="mt-6">
					<Table>
						<TableHead>
							<TableRow>
								<TableHeaderCell>ID</TableHeaderCell>
								<TableHeaderCell>Status</TableHeaderCell>
								<TableHeaderCell>Comments</TableHeaderCell>
								<TableHeaderCell>Room</TableHeaderCell>
								<TableHeaderCell>Slots</TableHeaderCell>
								<TableHeaderCell>Purpose</TableHeaderCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{requests.map(request => (
								<TableRow key={request.id}>
									<TableCell>{request.id}</TableCell>
									<TableCell>
										<Badge
											color={
												requestStatusColor[
													request.status
												]
											}
										>
											{request.status}
										</Badge>
									</TableCell>
									<TableCell>
										{request.comments ?? "—"}
									</TableCell>
									<TableCell>
										{rooms[request.roomId.toString()]}
									</TableCell>{" "}
									<TableCell>
										{request.slots
											.map(s => data[s])
											.join(", ")}
									</TableCell>
									<TableCell>{request.purpose}</TableCell>
									<Button
										className="my-3"
										onClick={() => {
											fetch(
												mkUrl(
													`/requests/${request.id}`
												),
												{
													method: "DELETE",
													body: JSON.stringify({
														accessToken: token,
													}),
													headers: {
														"Content-Type":
															"application/json",
													},
												}
											).then(() => {
												setRequests(
													requests.filter(
														r => r.id !== request.id
													)
												)
											})
										}}
									>
										Cancel
									</Button>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
				
			</main>
		</>
	)
}

const data = [
	"4:00 AM - 4:30 AM",
	"4:30 AM - 5:00 AM",
	"5:00 AM - 5:30 AM",
	"5:30 AM - 6:00 AM",
	"6:00 AM - 6:30 AM",
	"6:30 AM - 7:00 AM",
	"7:00 AM - 7:30 AM",
	"7:30 AM - 8:00 AM",
	"8:00 AM - 8:30 AM",
	"8:30 AM - 9:00 AM",
	"9:00 AM - 9:30 AM",
	"9:30 AM - 10:00 AM",
	"10:00 AM - 10:30 AM",
	"10:30 AM - 11:00 AM",
	"11:00 AM - 11:30 AM",
	"11:30 AM - 12:00 PM",
	"12:00 PM - 12:30 PM",
	"12:30 PM - 1:00 PM",
	"1:00 PM - 1:30 PM",
	"1:30 PM - 2:00 PM",
	"2:00 PM - 2:30 PM",
	"2:30 PM - 3:00 PM",
	"3:00 PM - 3:30 PM",
	"3:30 PM - 4:00 PM",
	"4:00 PM - 4:30 PM",
	"4:30 PM - 5:00 PM",
	"5:00 PM - 5:30 PM",
	"5:30 PM - 6:00 PM",
	"6:00 PM - 6:30 PM",
	"6:30 PM - 7:00 PM",
	"7:00 PM - 7:30 PM",
	"7:30 PM - 8:00 PM",
	"8:00 PM - 8:30 PM",
	"8:30 PM - 9:00 PM",
	"9:00 PM - 9:30 PM",
	"9:30 PM - 10:00 PM",
	"10:00 PM - 10:30 PM",
	"10:30 PM - 11:00 PM",
	"11:00 PM - 11:30 PM",
	"11:30 PM - 12:00 AM",
	"12:00 AM - 12:30 AM",
	"12:30 AM - 1:00 AM",
	"1:00 AM - 1:30 AM",
	"1:30 AM - 2:00 AM",
	"2:00 AM - 2:30 AM",
	"2:30 AM - 3:00 AM",
	"3:00 AM - 3:30 AM",
	"3:30 AM - 4:00 AM",
]
