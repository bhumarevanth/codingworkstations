import React from "react"
import Qstns from "./Qstns"
import { db, auth } from "../Config/firebase"
import Navbar from "./Navbar"
import History from "./History"
import { query, where } from "firebase/firestore"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"

function Profile() {
	const [uid, setUid] = React.useState("")
	const [data, setData] = React.useState([])
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
					imgurl: user.photoURL,
				})
			}
		})
		console.log(profile.imgurl)
	}, [])
	return (
		<div className="bg-slate-150">
			<Navbar />
			<div className="flex flex-col justify-center items-center">
				<h1 className="mt-10 text-4xl font-bold">Profile</h1>
			</div>
			<div className="flex justify-evenly items-center m-8">
				<div className="flex flex-col">
					<div className="flex justify-center m-2">
						<p className="text-2xl m-1 font-bold">Name:</p>
						<p className="text-2xl m-1 font-mono">{profile.name}</p>
					</div>
					<div className="flex justify-center m-2">
						<p className="text-2xl m-1 font-bold">Email:</p>
						<p className="text-2xl m-1 font-mono">
							{profile.email}
						</p>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex justify-center m-2">
						<p className="text-2xl m-1 font-bold">Solved:</p>
						{data.length != 0 && (
							<p className="text-2xl m-1 font-mono">
								{data[0].data.solved}
							</p>
						)}
					</div>
					<div className="flex justify-center m-2">
						<p className="text-2xl m-1 font-bold">Score:</p>
						{data.length != 0 && (
							<p className="text-2xl m-1 font-mono">
								{data[0].data.score}
							</p>
						)}
					</div>
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
