import React from "react"
import { auth, db } from "../Config/firebase"
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	orderBy,
} from "firebase/firestore"
import { query, where } from "firebase/firestore"
import CheckCircle from "../Icons/CheckCircle"
import Error from "../Icons/Error"
import Wrong from "../Icons/Wrong"

function History() {
	const [uid, setUid] = React.useState("")
	const [data, setData] = React.useState([])
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUid(user.uid)
			}
		})
	}, [])
	React.useEffect(() => {
		if (uid) {
			const q = query(
				collection(db, "submissions"),
				where("userid", "==", uid),
				orderBy("date", "desc")
			)
			getDocs(q)
				.then(response => {
					const qsns = response.docs.map(doc => ({
						data: doc.data(),
						id: doc.id,
					}))
					console.log(qsns)
					setData(qsns)
				})
				.catch(err => console.log(err.message))
		}
	}, [uid])
	function formatDateTime(sec) {
		const date = new Date(sec * 1000) // convert to milliseconds
		const year = date.getFullYear()
		const month = ("0" + (date.getMonth() + 1)).slice(-2) // add leading zero
		const day = ("0" + date.getDate()).slice(-2) // add leading zero
		const hours = ("0" + date.getHours()).slice(-2) // add leading zero
		const minutes = ("0" + date.getMinutes()).slice(-2) // add leading zero
		const seconds = ("0" + date.getSeconds()).slice(-2) // add leading zero
		return `${year}-${month}-${day} ${hours}:${minutes}:${sec}`
	}

	return (
		<div>
			<table className="w-full table-auto border-collapse">
				<thead className="bg-gray-50">
					<tr>
						<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
							Heading
						</th>
						<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
							Time
						</th>
						<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="text-gray-700">
					{data.map((item, index) => (
						<tr key={index}>
							<td className="py-2 px-8 border-b border-gray-200 underline">
								<a href={`Problems/${item.data.questionId}`}>
									{item.data.heading}
								</a>
							</td>
							<td className="py-2 px-8 border-b border-gray-200">
								{formatDateTime(item.data.date.seconds)}
							</td>
							<td className="py-2 px-8 border-b border-gray-200">
								<div className="flex">
									{item.data.status == "Accepted" && (
										<CheckCircle />
									)}
									{item.data.status == "Wrong Answer" && (
										<Wrong />
									)}
									{item.data.status ==
										"Compilation Error" && <Error />}
									{item.data.status == "Error" && <Error />}
									<div className="px-2">
										{item.data.status}
									</div>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default History
