import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signin from "./Components/Signin"
import Signup from "./Components/Signup"
import Home from "./Components/Home"
import { auth } from "./Config/firebase"
import Profile from "./Profile/Profile"
import Problems from "./Components/Problems"
import Question from "./Profile/AddQuestion"
import Qstns from "./Profile/Qstns"
import Edito from "./Editor/Editor"
import Playgrnd from "./Components/Playgrnd"
// import fire from './Config/firebase'
function App() {
	const [userName, setUserName] = React.useState("")
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUserName(user.displayName)
			} else {
				setUserName("")
			}
		})
	}, [])
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Home name={userName} />}
					/>
					<Route
						path="/Signin"
						element={<Signin />}
					/>
					<Route
						path="/Signup"
						element={<Signup />}
					/>
					<Route
						path="/Profile"
						element={<Profile />}
					/>
					<Route
						path="/Problems/:Id"
						element={<Problems />}
					/>
					<Route
						path="/Addqstn"
						element={<Question />}
					/>
					<Route
						path="/Questions"
						element={<Qstns />}
					/>
					<Route
						path="/Pground"
						element={<Playgrnd />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
