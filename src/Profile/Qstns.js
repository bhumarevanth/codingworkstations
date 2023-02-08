import React from "react"
import { db, auth } from "../Config/firebase"
import { collection, getDocs } from "firebase/firestore"
import { query, where } from "firebase/firestore"

function Qstns() {
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
				collection(db, "questions"),
				where("userid", "==", uid)
			)
			getDocs(q)
				.then(response => {
					const qsns = response.docs.map(doc => ({
						data: doc.data(),
						id: doc.id,
					}))
					setData(qsns)
				})
				.catch(err => console.log(err.message))
		}
	}, [uid])

	return (
		<div>
			{data.map(item => (
				<li
					key={item.id}
					className="flex justify-between items-center px-4 py-6 bg-gray-200 m-8 rounded-lg"
				>
					<h1 className="px-5 text-2xl">{item.data.heading}</h1>
				</li>
			))}
		</div>
	)
}

export default Qstns
