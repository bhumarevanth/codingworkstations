import React from "react"
import { useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../Config/firebase"
import Editor from "../Editor/Editor"

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
		<div className="grid grid-cols-2 divide-x-0">
			<div>
				{data.id !== "" && (
					<h1 className="font-bold text-4xl mt-8 pt-8 pb-10 pl-4 pr-4 resize-x rounded-md">
						{data.data.heading}
					</h1>
				)}
				{data.id !== "" && (
					<h2 className="pl-4 pr-4 text-2xl leading-relaxed">
						{data.data.question}
					</h2>
				)}
			</div>
			<div>
				<Editor />
			</div>
		</div>
	)
}

export default Problems
