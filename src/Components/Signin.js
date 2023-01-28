import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../Config/firebase"
import Signup from "../Components/Signup"
import { signInWithEmailAndPassword } from "firebase/auth"
function Signin() {
	const [values, setValues] = React.useState({
		email: "",
		pass: "",
	})
	const navigate = useNavigate()
	const [msg, setMsg] = React.useState("")
	function solve(event) {
		const { name, value } = event.target
		setValues(prev => {
			return {
				...prev,
				[name]: value,
			}
		})
		console.log(values)
	}
	const handleSubmission = event => {
		event.preventDefault()
		if (!values.email || !values.pass) {
			setMsg("Fill All Fields")
			return
		}
		setMsg("")
		signInWithEmailAndPassword(auth, values.email, values.pass)
			.then(res => {
				setMsg("RRR")
				navigate("/")
			})
			.catch(err => {
				setMsg(err.message)
				console.log(err.message)
			})
	}
	return (
		<div className="bg-gray-800 h-screen flex justify-center items-center">
			<form className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg">
				<h2 className="text-4xl text-white font-bold text-center">
					LOGIN
				</h2>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Email</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="email"
						placeholder="Email"
						name="email"
						onChange={solve}
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Password</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="password"
						placeholder="Password"
						name="pass"
						onChange={solve}
						required
					/>
				</div>
				<b className="text-red-500 w-full text-center">{msg}</b>
				<button
					onClick={handleSubmission}
					className="w-full my-5 p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
				>
					Log In
				</button>
				<div>
					<p className="mr-2 text-white">
						Don't have an account?{" "}
						<span>
							<Link
								className="underline underline-offset-1"
								to="/Signup"
								element={<Signup />}
							>
								Signup
							</Link>
						</span>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Signin
