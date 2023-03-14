import React from "react"
import Navbar from "./Nav"
import { db, auth } from "../Config/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function Home(props) {
	const navigate = useNavigate()
	const [isSignedin, setIsSignedin] = React.useState(false)
	const [data, setData] = React.useState([])
	React.useEffect(() => {
		const qref = collection(db, "questions")
		getDocs(qref)
			.then(response => {
				const qsns = response.docs.map(doc => ({
					data: doc.data(),
					id: doc.id,
				}))
				setData(qsns)
			})
			.catch(err => console.log(err.message))
		auth.onAuthStateChanged(user => {
			if (user) {
				setIsSignedin(true)
			} else {
				setIsSignedin(false)
			}
		})
	}, [])
	const handleSubmission = event => {
		const { name } = event.target
		console.log(name)
		if (isSignedin) {
			navigate("Problems/" + name)
		} else {
			navigate("/Signin")
		}
	}
	return (
		<div className="bg-purple-50">
			<Navbar />
			<h1 className="flex flex-col justify-center items-center font-bold text-4xl mt-4">
				Welcome {props.name}
			</h1>
			<ul>
				{Object.values(data).map(item => (
					<li
						key={item.id}
						className="flex justify-between items-center px-4 py-6 bg-slate-200 m-8 rounded-lg"
					>
						<h1 className="px-5 text-2xl">{item.data.heading}</h1>
						<button
							className="px-10 py-2 bg-purple-500 rounded-lg mr-4"
							onClick={handleSubmission}
							name={item.id}
						>
							Solve
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Home
