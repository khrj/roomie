import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.jsx"
import Login from "./Login.jsx"
import Requests from "./Requests.jsx"
import Admin from "./Admin.jsx"


import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/requests",
		element: <Requests />,
	},
	{
		path: "/admin",
		element: <Admin />,
	},
])

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
