import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TextInput, Dialog, DialogPanel, Button } from "@tremor/react"
import Navbar from "./Nav.jsx"

const BASE_URL = "http://localhost:4579"
const mkUrl = path => BASE_URL + path

export default function Login() {
	const [token, setToken] = useState(() => localStorage.getItem("token"))

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const [isOpen, setIsOpen] = useState(false)

	const navigate = useNavigate()

	return (
		<>
			<Navbar token={token} setToken={setToken} />
			<main className="p-4 md:p-10 mx-auto max-w-3xl">
				<div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h3 className="text-center text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
							Log in or create account
						</h3>
						<div className="mt-6 space-y-4">
							<div>
								<label
									htmlFor="email"
									className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
								>
									Email
								</label>
								<TextInput
									type="email"
									id="email"
									name="email"
									autoComplete="email"
									placeholder="f20241443@goa.bits-pilani.ac.in"
									className="mt-2"
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
								>
									Password
								</label>
								<TextInput
									type="password"
									id="password"
									name="password"
									autoComplete="password"
									placeholder="password"
									className="mt-2"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
							<button
								className="mt-4 w-full whitespace-nowrap rounded-tremor-default bg-tremor-brand py-2 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
								onClick={() => {
									fetch(mkUrl("/login"), {
										method: "POST",
										body: JSON.stringify({
											email,
											password,
										}),
										headers: {
											"Content-Type": "application/json",
										},
									})
										.then(r => r.json())
										.then(data => {
											if (data.accessToken === undefined)
												setIsOpen(true)
											else {
												localStorage.setItem(
													"token",
													data.accessToken
												)
												setToken(data.accessToken)
												navigate("/")
											}
										})
								}}
							>
								Sign in
							</button>
						</div>
					</div>
				</div>
				<Dialog
					open={isOpen}
					onClose={val => setIsOpen(val)}
					static={true}
				>
					<DialogPanel>
						<h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
							Invalid credentials
						</h3>
						<p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
							Please check your email and password, and try again.
						</p>
						<Button
							className="mt-8 w-full"
							onClick={() => setIsOpen(false)}
						>
							Ok
						</Button>
					</DialogPanel>
				</Dialog>
			</main>
		</>
	)
}
