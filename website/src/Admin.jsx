import { useEffect, useState } from "react"

import {
	Card,
	Text,
	Badge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Select,
	SelectItem,
	Button,
	Dialog,
	DialogPanel,
	TextInput,
} from "@tremor/react"
import Navbar from "./Nav.jsx"

const BASE_URL = "http://localhost:4579"
const mkUrl = path => BASE_URL + path

export default function Admin() {
	const [token, setToken] = useState(() => localStorage.getItem("token"))
	const [requests, setRequests] = useState([])
	const [rooms, setRooms] = useState([])
	const [values, setValues] = useState([])

	const [isOpen, setIsOpen] = useState(false)
	const [comment, setComment] = useState("")
	const [pickedRequest, setPickedRequest] = useState("")

	const [isNotAdmin, setIsNotAdmin] = useState(false)

	useEffect(() => {
		fetch(mkUrl(`/requests?accessToken=${token}`)).then(r => {
			if (!r.ok) {
				localStorage.setItem("token", null)
				setToken(null)
			}
		})

		fetch(mkUrl(`/admin/requests?accessToken=${token}`)).then(r => {
			if (!r.ok) {
				setIsNotAdmin(true)
			} else {
				r.json().then(data => {
					setRequests(data)
					setValues(data.map(r => r.status))
				})
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
						<Text>Sign in to review requests.</Text>
					</Card>
				</main>
			</>
		)
	}

	if (isNotAdmin) {
		return (
			<>
				<Navbar token={token} setToken={setToken} />
				<main className="p-4 md:p-10 mx-auto max-w-7xl">
					<Card className="mt-6">
						<Text>
							You are not an admin. Sign in as an admin to review
							requests.
						</Text>
					</Card>
				</main>
			</>
		)
	}

	return (
		<>
			<Navbar token={token} setToken={setToken} />
			<main className="p-4 md:p-10 mx-auto max-w-screen-2xl">
				<Card className="mt-6">
					<Table className="min-h-96">
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
							{requests.map((request, i) => (
								<TableRow key={request.id}>
									<TableCell>{request.id}</TableCell>
									<TableCell>
										<Select
											value={values[i]}
											onValueChange={v => {
												const newValues = [...values]
												newValues[i] = v
												setValues(newValues)

												if (
													v === "Approved" ||
													v === "Rejected"
												) {
													fetch(
														v === "Approved"
															? mkUrl(
																	`/admin/requests/${request.id}/accept`
															  )
															: mkUrl(
																	`/admin/requests/${request.id}/deny`
															  ),
														{
															method: "POST",
															body: JSON.stringify(
																{
																	accessToken:
																		token,
																}
															),
															headers: {
																"Content-Type":
																	"application/json",
															},
														}
													).catch(console.error)
												}
											}}
											className="mt-2"
										>
											{values[i] === "Pending" ? (
												<SelectItem value="Pending">
													<Badge color="yellow">
														Pending
													</Badge>
												</SelectItem>
											) : (
												<></>
											)}
											<SelectItem value="Approved">
												<Badge color="emerald">
													Approved
												</Badge>
											</SelectItem>
											<SelectItem value="Rejected">
												<Badge color="red">
													Rejected
												</Badge>
											</SelectItem>
										</Select>
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
									<TableCell>
										<Button
											className="my-3"
											onClick={() => {
												setPickedRequest(request.id)
												setIsOpen(true)
											}}
										>
											Add comment
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
				<Dialog
					open={isOpen}
					onClose={val => setIsOpen(val)}
					static={true}
				>
					<DialogPanel className="w-30">
						<h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
							Comment
						</h3>
						<p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
							Add a comment explaining your decision or asking for
							clarifications.
						</p>
						<TextInput
							value={comment}
							onValueChange={setComment}
							className="my-3"
						/>
						<Button
							className="mt-4 w-full"
							onClick={() => {
								fetch(
									mkUrl(
										`/admin/requests/${pickedRequest}/comment`
									),
									{
										method: "POST",
										body: JSON.stringify({
											accessToken: token,
											comment,
										}),
										headers: {
											"Content-Type": "application/json",
										},
									}
								)

								const newRequests = requests.map(r => {
									if (r.id === pickedRequest) {
										r.comments = comment
									}

									return r
								})

								setRequests(newRequests)
								setIsOpen(false)
							}}
						>
							Send
						</Button>
					</DialogPanel>
				</Dialog>
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
