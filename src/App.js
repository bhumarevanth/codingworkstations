import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signin from "./Components/Signin"
import Signup from "./Components/Signup"
import Home from "./Components/Home"
import { auth } from "./Config/firebase"
// import fire from './Config/firebase'
function App() {
	const [username, setUsername] = React.useState("")
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUsername(user.displayName)
			} else {
				setUsername("")
			}
		})
	}, [])
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Home name={username} />}
					/>
					<Route
						path="/Signin"
						element={<Signin />}
					/>
					<Route
						path="/Signup"
						element={<Signup />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
