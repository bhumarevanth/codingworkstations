import React from "react"
import Qstns from "./Qstns"
import { db, auth } from "../Config/firebase"
import Navbar from "./Navbar"
import History from "./History"
import { query, where } from "firebase/firestore"
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	orderBy,
} from "firebase/firestore"

function Profile() {
	const [uid, setUid] = React.useState("")
	const [data, setData] = React.useState([])
	const [ldrboard, setLdrboard] = React.useState([])
	const [profile, setProfile] = React.useState({
		name: "",
		email: "",
		imgurl: "",
		score: "",
		solved: "",
	})
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUid(user.uid)
			}
		})
	}, [])
	React.useEffect(() => {
		if (uid) {
			const q = query(collection(db, "profile"), where("uid", "==", uid))
			getDocs(q)
				.then(response => {
					const qsns = response.docs.map(doc => ({
						data: doc.data(),
						id: doc.id,
					}))
					setData(qsns)
					console.log(qsns)
				})
				.catch(err => console.log(err.message))
		}
	}, [uid])
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setProfile({
					name: user.displayName,
					email: user.email,
				})
			}
		})
	}, [])
	React.useEffect(() => {
		const n = query(
			collection(db, "profile"),
			orderBy("score", "desc"),
			orderBy("solved", "desc")
		)
		getDocs(n)
			.then(response => {
				const ld = response.docs.map(doc => ({
					data: doc.data(),
					id: doc.id,
				}))
				console.log(ld)
				setLdrboard(ld)
			})
			.catch(err => console.log(err.message))
	}, [])
	return (
		<div>
			<Navbar />
			<div className="grid grid-cols-2">
				<div className="bg-slate-100 m-4 rounded-xl">
					<div className="flex flex-col justify-center items-center">
						<h1 className="mt-10 text-4xl font-bold">Profile</h1>
					</div>
					<div className="flex justify-evenly items-center mt-4">
						<div className="flex flex-col">
							<div className="flex justify-center m-2">
								<p className="text-xl m-1 font-bold">Name:</p>
								<p className="text-xl m-1 font-mono">
									{profile.name}
								</p>
							</div>
							<div className="flex justify-center m-2">
								<p className="text-xl m-1 font-bold">Email:</p>
								<p className="text-xl m-1 font-mono">
									{profile.email}
								</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex justify-center m-2">
								<p className="text-xl m-1 font-bold">Solved:</p>
								{data.length != 0 && (
									<p className="text-xl m-1 font-mono">
										{data[0].data.solved}
									</p>
								)}
							</div>
							<div className="flex justify-center m-2">
								<p className="text-xl m-1 font-bold">Score:</p>
								{data.length != 0 && (
									<p className="text-xl m-1 font-mono">
										{data[0].data.score}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="bg-slate-100 m-4 rounded-xl overflow-auto max-h-60">
					<div className="flex flex-col justify-center items-center">
						<h1 className="m-4 text-4xl font-bold">Leader Board</h1>
					</div>
					<table className="w-full table-auto border-collapse">
						<thead className="bg-gray-50">
							<tr>
								<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
									Rank
								</th>
								<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
									User Name
								</th>
								<th className="py-2 px-8 font-semibold text-left border-b border-gray-200">
									Score
								</th>
							</tr>
						</thead>
						<tbody className="text-gray-700">
							{ldrboard.map((item, index) => (
								<tr key={index}>
									<td className="py-2 px-8 border-b border-gray-200">
										<p className="text-xl m-1 font-mono">
											{index + 1}
										</p>
									</td>
									<td className="py-2 px-8 border-b border-gray-200">
										<p className="text-xl m-1 font-mono">
											{item.data.name}
										</p>
									</td>
									<td className="py-2 px-8 border-b border-gray-200">
										<p className="text-xl m-1 font-mono">
											{item.data.score}
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<h2 className="font-bold text-2xl my-4 px-4 py-2 rounded-md bg-gray-200 text-gray-800">
				History:
			</h2>
			<History />
		</div>
	)
}

export default Profile
