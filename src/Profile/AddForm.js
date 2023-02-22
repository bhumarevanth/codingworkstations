import React from "react"
import { getDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../Config/firebase"
import { useNavigate } from "react-router-dom"
function AddForm(props) {
	const navigate = useNavigate()
	const Id = props.qid
	const [data, setData] = React.useState({
		data: {},
		id: "",
	})
	const [qstn, setQstn] = React.useState({
		heading: "",
		question: "",
		userid: "",
	})
	React.useEffect(() => {
		const qref = doc(db, "questions", Id)
		getDoc(qref)
			.then(response => {
				const qstns = {
					data: response.data(),
					id: response.id,
				}
				setData(qstns)
			})
			.catch(err => console.log(err.message))
	}, [])

	const [msg, setMsg] = React.useState("")
	function solve(event) {
		const { name, value } = event.target
		if (qstn.heading == "") {
			qstn.heading = data.data.heading
		}
		if (qstn.question == "") {
			qstn.question = data.data.question
		}
		if (qstn.userid == "") {
			qstn.userid = data.data.userid
		}
		setQstn(prev => {
			return {
				...prev,
				[name]: value,
			}
		})
		console.log(qstn)
	}
	function handleSubmission(event) {
		event.preventDefault()
		if (qstn.heading == "" || qstn.question == "") {
			setMsg("Enter all fields")
			return
		}
		setMsg("")
		const docRef = doc(db, "questions", Id)
		updateDoc(docRef, qstn).then(docRef => {
			props.onClose()
			navigate("/Questions")
		})
	}
	return (
		<div className="bg-gray-800 flex justify-center items-center">
			<form className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg">
				<h2 className="text-4xl text-white font-bold text-center">
					Edit Question
				</h2>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Heading</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						// placeholder="Type Heading"
						name="heading"
						onChange={solve}
						required
						defaultValue={data.data.heading}
					/>
				</div>
				<div className="flex flex-col text-gray-400 py-2">
					<label>Question</label>
					<input
						className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
						type="text"
						defaultValue={data.data.question}
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
					Edit Question
				</button>
			</form>
		</div>
	)
}

export default AddForm
