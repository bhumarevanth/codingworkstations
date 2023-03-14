import React, { useState } from "react"
import Editor from "@monaco-editor/react"
import Languages from "./Languages"
import CheckCircle from "../Icons/CheckCircle"
import { auth } from "../Config/firebase"
import { db } from "../Config/firebase"
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore"
import Wrong from "../Icons/Wrong"
import Error from "../Icons/Error"
import Spinner from "../Icons/Spinner"
import { query, where } from "firebase/firestore"

function Edito(props) {
	const [language, setLanguage] = useState("63")
	const [Output, setOutput] = useState("")
	const [code, setCode] = useState("")
	// console.log(props)
	let x
	if ("data" in props) {
		x = props.data.data.input
	} else {
		x = ""
	}
	const [input, setInput] = useState(x)
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState("")
	const [uid, setUid] = React.useState("")
	const [prof, setProf] = React.useState([])
	const [submissions, setSubmissions] = React.useState([])
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUid(user.uid)
				// console.log(user.uid)
				// console.log(props.data.id)
				if ("data" in props) {
					const q = query(
						collection(db, "submissions"),
						where("userid", "==", user.uid),
						where("questionId", "==", props.data.id),
						where("status", "==", "Accepted")
					)
					getDocs(q)
						.then(response => {
							const qsns = response.docs.map(doc => ({
								data: doc.data(),
								id: doc.id,
							}))
							setSubmissions(qsns)
							console.log(qsns)
						})
						.catch(err => console.log(err.message))
					const p = query(
						collection(db, "profile"),
						where("uid", "==", user.uid)
					)
					getDocs(p)
						.then(response => {
							const prfl = response.docs.map(doc => ({
								data: doc.data(),
								id: doc.id,
							}))
							setProf(prfl)
							console.log(prfl)
						})
						.catch(err => console.log(err.message))
				}
			} else {
				navigate("/Signin")
			}
		})
	}, [])
	function handleEditorChange(value, event) {
		setCode(value)
		console.log(value)
	}

	function handleLanguageChange(event) {
		setLanguage(event.target.value)
		console.log(event.target.value)
	}

	function handleInputChange(event) {
		console.log(event.target.value)
		setInput(event.target.value)
	}
	const handleExecuteClick = async e => {
		setLoading(true)
		console.log(input)
		let xinput
		if (!input) {
			xinput = props.data.data.input
		} else {
			xinput = input
		}
		const encodedSourceCode = btoa(code)
		const encodedInput = btoa(xinput)
		const options = {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"Content-Type": "application/json",
				"X-RapidAPI-Key":
					"7ce176b642msh789b80276da3652p10ff17jsn9e58052b2ede",
				"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
			},
			body: `{"language_id":${language},"source_code":"${encodedSourceCode}","stdin":"${encodedInput}"}`,
		}
		console.log(options.body)
		fetch(
			"https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*",
			options
		)
			.then(response => response.json())
			.then(response => {
				const jsonResponse = response
				console.log(jsonResponse)
				const options = {
					method: "GET",
					headers: {
						"X-RapidAPI-Key":
							"7ce176b642msh789b80276da3652p10ff17jsn9e58052b2ede",
						"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
					},
				}
				fetch(
					`https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true&fields=*`,
					options
				)
					.then(response => response.json())
					.then(response => {
						setLoading(false)
						console.log(response)
						if ("data" in props) {
							if (
								response.stdout != null &&
								atob(response.stdout) == props.data.data.output
							) {
								console.log(atob(response.stdout))
								if (submissions.length == 0) {
									console.log("Hi")
									console.log(prof[0].id)
									console.log(prof[0].data.score)
									const puid = prof[0].id
									console.log(typeof puid)
									const uprofile = {
										score:
											parseInt(prof[0].data.score) + 10,
										solved:
											parseInt(prof[0].data.solved) + 1,
										uid: prof[0].data.uid,
									}
									console.log(uprofile)
									// const profileRef = doc(db, 'profile', "pGLAwRpOjSvvELd8fbBR")
									// console.log("Hi")
									// updateDoc(profileRef,uprofile).then(ref => console.log("updated"))
									// console.log("Accepted")
									db.collection("profile")
										.doc(prof[0].id)
										.update(uprofile)
								}
								setOutput(atob(response.stdout))
								setStatus("Accepted")
							} else if (
								response.stdout &&
								atob(response.stdout) != props.data.data.output
							) {
								console.log("false")
								setOutput(atob(response.stdout))
								setStatus("Wrong Answer")
							} else if (response.stderr) {
								setOutput(atob(response.stderr))
								setStatus("Error")
							} else {
								setOutput(atob(response.compile_output))
								setStatus("Compilation Error")
								console.log(atob(response.compile_output))
							}
						} else {
							if (response.stdout) {
								setOutput(atob(response.stdout))
								console.log(atob(response.stdout))
							} else if (response.stderr) {
								setOutput(atob(response.stderr))
								console.log(atob(response.stderr))
							} else {
								setOutput(atob(response.compile_output))
								console.log(atob(response.compile_output))
							}
						}
						let date = new Date()
						console.log(date) // 17.6.2022
						if ("data" in props) {
							const docRef = addDoc(
								collection(db, "submissions"),
								{
									questionId: props.data.id,
									heading: props.data.data.heading,
									status: status,
									date: date,
									userid: uid,
								}
							)
							console.log("Document written with ID: ", docRef.id)
						}
					})
					.catch(err => setOutput(err))
			})
			.catch(err => setOutput(err))
	}

	return (
		<div className="flex flex-col border-gray-700 pl-4 pr-8">
			<div className="flex justify-between items-center ml-4 mr-6 mb-4 mt-4">
				<div>
					<select
						id="language-select"
						value={language}
						onChange={handleLanguageChange}
						className="border border-gray-400 rounded-md p-1"
					>
						{Languages.map(lang => (
							<option
								key={lang.id}
								value={lang.id}
							>
								{lang.name}
							</option>
						))}
					</select>
				</div>
				{!loading ? (
					<div className="flex justify-between items-center">
						{status == "Accepted" && <CheckCircle />}
						{status == "Wrong Answer" && <Wrong />}
						{status == "Compilation Error" && <Error />}
						<button
							onClick={handleExecuteClick}
							className="bg-blue-500 text-white px-2 py-1 mx-4 rounded-md"
						>
							Execute
						</button>
					</div>
				) : (
					<div>
						<Spinner className="animate" />
					</div>
				)}
			</div>
			<Editor
				className="rounded-md shadow-xl"
				height="65vh"
				language={language}
				defaultValue="// some comment"
				onChange={handleEditorChange}
				theme="dracula"
			/>
			<div className="flex">
				<div className="w-1/2 border-r">
					<div className="m-4 border-gray-700">Input:</div>
					<div className="m-4">
						<textarea
							className="w-full border border-gray-400 rounded-md p-2 h-64 resize-none"
							defaultValue={
								"data" in props ? props.data.data.input : ""
							}
							onChange={handleInputChange}
							placeholder={input}
						></textarea>
					</div>
				</div>
				<div className="w-1/2">
					<div className="m-4 border-gray-700">Output:</div>
					<div className="m-4 flex justify-center items-center">
						<div className="w-full border border-gray-400 rounded-md p-2 h-64 resize-none">
							{Output}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Edito
