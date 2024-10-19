import { useEffect, useState } from "react"

import {
	Card,
	Text,
	Title,
	DatePicker,
	MultiSelect,
	MultiSelectItem,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Dialog,
	DialogPanel,
	TextInput,
} from "@tremor/react"
import Navbar from "./Nav.jsx"
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://localhost:4579"
const mkUrl = path => BASE_URL + path

function App() {
	const [token, setToken] = useState(() => localStorage.getItem("token"))
	const [date, setDate] = useState(undefined)
	const [slots, setSlots] = useState([])
	const [rooms, setRooms] = useState([])
	const [pickedRoom, setPickedRoom] = useState(undefined)
	const [purpose, setPurpose] = useState("")

	const [isOpen, setIsOpen] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		fetch(mkUrl(`/requests?accessToken=${token}`)).then(r => {
			if (!r.ok) {
				localStorage.setItem("token", null)
				setToken(null)
			}
		})
	})

	if (!token) {
		return (
			<>
				<Navbar token={token} setToken={setToken} />
				<main className="p-4 md:p-10 mx-auto max-w-7xl">
					<Card className="mt-6">
						<Text>Sign in to book a room.</Text>
					</Card>
				</main>
			</>
		)
	}

	return (
		<>
			<Navbar token={token} setToken={setToken} />
			<main className="p-4 md:p-10 mx-auto max-w-7xl">
				<Card className="mt-6">
					<Title>Pick a date</Title>

					<DatePicker
						value={date}
						onValueChange={setDate}
						className="my-2"
					/>

					<Title>Pick a time</Title>

					<MultiSelect
						value={slots}
						onValueChange={setSlots}
						className="my-2"
					>
						{data.map((time, i) => (
							<MultiSelectItem key={i} value={i.toString()}>
								{time}
							</MultiSelectItem>
						))}
					</MultiSelect>

					<Button
						className="my-2"
						onClick={() => {
							const dateStr = `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDate()}`

							fetch(
								mkUrl(
									`/rooms?date=${encodeURIComponent(
										dateStr
									)}&requestedSlots=${encodeURIComponent(
										slots.join(",")
									)}`
								)
							)
								.then(r => r.json())
								.then(setRooms)
						}}
					>
						Find rooms
					</Button>

					{rooms.length === 0 ? null : (
						<Table>
							<TableHead>
								<TableRow>
									<TableHeaderCell>Room</TableHeaderCell>
									<TableHeaderCell>Capacity</TableHeaderCell>
									<TableHeaderCell>Book</TableHeaderCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{rooms.map(room => (
									<TableRow key={room.id}>
										<TableCell>{room.name}</TableCell>
										<TableCell>{room.capacity}</TableCell>
										<Button
											className="my-3"
											onClick={() => {
												setPickedRoom(room.id)
												setIsOpen(true)
											}}
										>
											Book
										</Button>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</Card>
				<Dialog
					open={isOpen}
					onClose={val => setIsOpen(val)}
					static={true}
				>
					<DialogPanel className="w-30">
						<h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
							Purpose
						</h3>
						<p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
							Explain briefly why you need/want to book this room.
						</p>
						<TextInput
							value={purpose}
							onValueChange={setPurpose}
							className="my-3"
						/>
						<Button
							className="mt-4 w-full"
							onClick={() => {
								fetch(mkUrl("/requests"), {
									method: "POST",
									body: JSON.stringify({
										accessToken: token,
										date: `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDate()}`,
										slots: slots.map((slot) => parseInt(slot)),
										roomId: pickedRoom,
										purpose: purpose,
									}),
									headers: {
										"Content-Type": "application/json",
									},
								})
									.then(r => r.json())
									.then(data => {
										if (data.status === "Pending")
											navigate("/requests")
									})
							}}
						>
							Submit request
						</Button>
					</DialogPanel>
				</Dialog>
			</main>
		</>
	)
}

export default App

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
