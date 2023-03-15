import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, storage } from "../Config/firebase"
import Signin from "../Components/Signin"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { app, db } from "../Config/firebase"
import { collection, addDoc } from "firebase/firestore"

function Signup() {
	const navigate = useNavigate()
	const [values, setValues] = React.useState({
		name: "",
		email: "",
		pass: "",
		cpass: "",
		url: "",
	})
	const [image, setImage] = React.useState(null)
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
	function handleImage(event) {
		if (event.target.files[0]) {
			setImage(event.target.files[0])
		}
		if (event.target.files[0]) {
			const imageRef = ref(storage, "image")
			uploadBytes(imageRef, image)
				.then(() => {
					getDownloadURL(imageRef)
						.then(url => {
							setValues(prev => {
								return {
									...prev,
									url: url,
								}
							})
						})
						.catch(error => {
							console.log(error.message)
						})
					setImage(null)
				})
				.catch(error => {
					console.log(error.message)
				})
		}
	}
	function handleSubmission(event) {
		event.preventDefault()
		if (!values.name || !values.email || !values.pass || !values.cpass) {
			setMsg("Fill all Fields")
			return
		}
		if (values.pass !== values.cpass) {
			setMsg("Passwords does not match")
			return
		}

		setMsg("")
		createUserWithEmailAndPassword(auth, values.email, values.pass)
			.then(async res => {
				const user = res.user
				await updateProfile(user, {
					displayName: values.name,
					photoURL: values.url,
					score: 0,
					solved: 0,
				})
				const docRef = addDoc(collection(db, "profile"), {
					solved: 0,
					score: 0,
					uid: user.uid,
					name: values.name,
				})
				navigate("/Signin")
			})
			.catch(err => {
				setMsg(err.message)
			})
	}
	return (
		<div className="bg-gray-800 h-screen flex justify-center items-center">
			<form className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg">
				<h2 className="text-4xl text-white font-bold text-center">
					SIGNUP
				</h2>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Name</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						placeholder="Enter UserName"
						name="name"
						onChange={solve}
						required
					/>
				</div>
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
				<div className="flex flex-col text-gray-400 py-2">
					<label>Password</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="password"
						placeholder="Confirm Password"
						name="cpass"
						onChange={solve}
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Upload Image</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="file"
						name="image"
						onChange={handleImage}
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
								to="/Signin"
								element={<Signin />}
							>
								Signin
							</Link>
						</span>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Signup
