import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import LanguageDropdown from "./LanguageDropdown"
import Editor from "@monaco-editor/react"
import Languages from "./Languages"
import Spin from "../Icons/Spin"
import Refresh from "../Icons/Refresh"
import Check_circle from "../Icons/Check_circle"
import { auth } from "../Config/firebase"
import { app, db } from "../Config/firebase"
import { collection, addDoc } from "firebase/firestore"

function Edito(props) {
	const [language, setLanguage] = useState("63")
	const [Output, setOutput] = useState("")
	const [code, setCode] = useState("")
	console.log(props)
	let x
	if ("data" in props) {
		x = props.data.data.input
	} else {
		x = ""
	}
	const [input, setInput] = useState(x)
	const [loading, setLoading] = useState(false)
	let status = ""
	const [uid, setUid] = React.useState("")
	let date = new Date().toJSON()
	console.log(date)
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUid(user.uid)
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
		const encodedSourceCode = btoa(code)
		const encodedInput = btoa(input)
		const options = {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"Content-Type": "application/json",
				"X-RapidAPI-Key":
					"142e647f7bmsh69117b87f333cb8p1aa34bjsne06b9a101f38",
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
							"142e647f7bmsh69117b87f333cb8p1aa34bjsne06b9a101f38",
						"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
					},
				}
				fetch(
					`https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true&fields=*`,
					options
				)
					.then(response => response.json())
					.then(response => {
						console.log(response)
						setLoading(false)
						if ("data" in props) {
							if (response.stdout == props.data.data.output) {
								setOutput(atob(response.stdout))
								status = "Accepted"
								console.log(atob(response.stdout))
							} else if (
								response.stdout != props.data.data.output
							) {
								setOutput(atob(response.stdout))
								status = "Wrong Answer"
							} else if (response.stderr) {
								setOutput(atob(response.stderr))
								status = "Error"
								console.log(atob(response.stderr))
							} else {
								setOutput(atob(response.compile_output))
								status = "Compilation Error"
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
					<button
						onClick={handleExecuteClick}
						className="bg-blue-500 text-white px-2 py-1 rounded-md"
					>
						Execute
					</button>
				) : (
					<div>
						<Spin />
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
							value={input}
							onChange={handleInputChange}
							placeholder="Enter input here..."
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
