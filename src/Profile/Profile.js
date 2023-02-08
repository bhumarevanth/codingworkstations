import React from "react"
import Qstns from "./Qstns"
import { auth } from "../Config/firebase"

function Profile() {
	const [uid, setUid] = React.useState("")
	auth.onAuthStateChanged(user => {
		if (user) {
			setUid(user.uid)
		}
	})
	return (
		<div>
			<Qstns uid={uid} />
			<a href="/Addqstn">Add Question</a>
		</div>
	)
}

export default Profile
