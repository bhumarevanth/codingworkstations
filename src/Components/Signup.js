import React from "react"
import { Link } from "react-router-dom"
import Signin from "../Components/Signin"
import { auth } from "../Config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

function Signup() {
	const [values, setValues] = React.useState({
		name: "",
		email: "",
		pass: "",
		cpass: "",
	})
	const [msg, setMsg] = React.useState("")
	function solve(event) {
		const { name, value } = event.target
		setValues(prev => {
			return {
				...prev,
				[name]: value,
			}
		})
	}
	const handleSubmission = event => {
		if (!values.name || !values.email || !values.pass || !values.cpass) {
			setMsg("Fill All Fields")
			return
		}
		if (values.pass !== values.cpass) {
			setMsg("Passwords does not match")
			return
		}
		setMsg("")
		createUserWithEmailAndPassword(auth, values.email, values.pass)
			.then(res => {
				console.log(res)
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
					SIGNUP
				</h2>
				<div className="flex flex-col text-gray-400 py-2">
					<label className="text-white">Name</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						placeholder="User Name"
						onChange={solve}
						name="name"
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label className="text-white">Email</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="email"
						placeholder="Email"
						onChange={solve}
						name="email"
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label className="text-white">Password</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="password"
						placeholder="Password"
						onChange={solve}
						name="pass"
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label className="text-white">Confirm Password</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="password"
						placeholder="COnfirm Password"
						onChange={solve}
						name="cpass"
						required
					/>
				</div>
				<b className="text-red-500 w-full text-center">{msg}</b>
				<button
					onClick={handleSubmission}
					className="w-full my-5 p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
				>
					Signup
				</button>
				<div>
					<p className="mr-2 text-white">
						Already have an account?{" "}
						<span>
							<Link
								className="underline underline-offset-1"
								to="/"
								element={<Signin />}
							>
								Sign in
							</Link>
						</span>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Signup
