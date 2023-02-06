import React from "react"
import { useNavigate } from "react-router-dom"
// import { getFirestore } from "firebase/firestore"
import { app, db } from "../Config/firebase"
import { collection, addDoc } from "firebase/firestore"

function Question() {
	// const db = getFirestore(app)

	const navigate = useNavigate()
	const [qstn, setQstn] = React.useState({
		heading: "",
		question: "",
	})
	const [msg, setMsg] = React.useState("")
	function solve(event) {
		const { name, value } = event.target
		setQstn(prev => {
			return {
				...prev,
				[name]: value,
			}
		})
	}
	function handleSubmission(event) {
		event.preventDefault()
		if (qstn == "") {
			setMsg("Enter all fields")
			return
		}
		setMsg("")
		// try {
		const docRef = addDoc(collection(db, "questions"), {
			question: qstn.question,
			heading: qstn.heading,
		})
		console.log("Document written with ID: ", docRef.id)
		//   } catch (e) {
		//     console.error("Error adding document: ", e);
		//   }
		navigate("/")
	}
	return (
		<div className="bg-gray-800 h-screen flex justify-center items-center">
			<form className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg">
				<h2 className="text-4xl text-white font-bold text-center">
					Add Question
				</h2>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Heading</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						placeholder="Type Heading"
						name="heading"
						onChange={solve}
						required
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Question</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						placeholder="Type Question"
						name="question"
						onChange={solve}
						required
					/>
				</div>
				<b className="text-red-500 w-full text-center">{msg}</b>
				<button
					onClick={handleSubmission}
					className="w-full my-5 p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
				>
					Add Question
				</button>
			</form>
		</div>
	)
}

export default Question
