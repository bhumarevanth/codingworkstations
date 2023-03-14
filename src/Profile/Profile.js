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
		<>
			<Navbar />
			<div className="flex flex-col justify-center items-center">
				<h1 className="mt-10 text-4xl">Profile</h1>
				<p className="mt-4 text-2xl">Name: {profile.name}</p>
				<p className="mt-4 text-2xl">Email: {profile.email}</p>
				{data.length != 0 && (
					<p className="mt-4 text-2xl">Score: {data[0].data.score}</p>
				)}
				{data.length != 0 && (
					<p className="mt-4 text-2xl">
						Score: {data[0].data.solved}
					</p>
				)}
				<img src={profile.imgurl} />
			</div>
			<hr />
			<h2 className="font-bold text-2xl m-4 resize-x rounded-md">
				History :
			</h2>
			<History />
		</>
	)
}

export default Profile
