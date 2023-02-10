import React from "react"
import Qstns from "./Qstns"
import { auth } from "../Config/firebase"
import Navbar from "./Navbar"

function Profile() {
	const [profile, setProfile] = React.useState({
		name: "",
		email: "",
		imgurl: "",
	})
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
				<img src={profile.imgurl} />
			</div>
		</>
	)
}

export default Profile
