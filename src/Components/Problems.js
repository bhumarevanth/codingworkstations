import React from "react"
import { useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../Config/firebase"
import Editor from "../Editor/Editor"
import Navbar from "./Nav"

function Problems() {
	const params = useParams()
	const Id = params.Id
	const [data, setData] = React.useState({
		data: {},
		id: "",
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
	return (
		<>
			<Navbar />
			<div className="grid grid-cols-2 divide-x-0 bg-slate-50">
				<div>
					{data.id !== "" && (
						<>
							<h1 className="font-bold text-4xl mt-6 pt-6 pb-2 pl-4 pr-4 resize-x rounded-md">
								{data.data.heading}
							</h1>
							<p className="pb-10 pl-4 pr-4 text-2xl font-mono">{`(${data.data.medium})`}</p>
						</>
					)}
					{data.id !== "" && (
						<h2 className="pl-4 pr-4 text-2xl leading-relaxed whitespace-pre-line">
							{data.data.question}
						</h2>
					)}
					{data.id !== "" && (
						<>
							<h2 className="font-bold text-2xl m-4 resize-x rounded-md">
								Input :
							</h2>
							<h2 className="pl-8 pr-4 text-2xl leading-relaxed whitespace-pre-line">
								{data.data.input}
							</h2>
						</>
					)}
					{data.id !== "" && (
						<div className="">
							<h2 className="font-bold text-2xl m-4 resize-x rounded-md">
								Output :
							</h2>
							<h2 className="pl-8 pr-4 text-2xl leading-relaxed whitespace-pre-line">
								{data.data.output}
							</h2>
						</div>
					)}
				</div>
				<div>{data.id != "" && <Editor data={data} />}</div>
			</div>
		</>
	)
}

export default Problems
