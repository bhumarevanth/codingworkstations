import React from "react"
import { db, auth } from "../Config/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { query, where } from "firebase/firestore"
import Navbar from "../Components/Nav"
import Box from "@mui/material/Box"
import AddForm from "./AddForm"
import Modal from "@mui/material/Modal"

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
}

function Qstns() {
	const refresh = () => window.location.reload(true)
	const [uid, setUid] = React.useState("")
	const [data, setData] = React.useState([])
	const [open, setOpen] = React.useState(false)
	const [qid, setQid] = React.useState("")
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

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
	function editQstn(event) {
		const { name } = event.target
		setQid(name)
		console.log(qid)
		handleOpen()
	}
	function deleteQstn(event) {
		const { name } = event.target
		const qstnId = name
		console.log(qstnId)
		deleteDoc(doc(db, "questions", qstnId))
		const q = query(collection(db, "questions"), where("userid", "==", uid))
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

	return (
		<>
			<Navbar />
			<h1 className="m-8 font-bold text-4xl">Questions Uploaded :</h1>
			{data.map(item => (
				<li
					key={item.id}
					className="flex justify-between items-center px-4 py-6 bg-gray-200 mx-8 mt-8 rounded-lg"
				>
					<h1 className="px-5 text-2xl">{item.data.heading}</h1>
					<div className="flex justify-between items-center">
						<button
							className="px-10 py-2 bg-purple-500 rounded-lg mr-4"
							name={item.id}
							onClick={editQstn}
						>
							Edit
						</button>
						<button
							className="px-10 py-2 bg-purple-500 rounded-lg mr-4"
							name={item.id}
							onClick={deleteQstn}
						>
							Delete
						</button>
					</div>
				</li>
			))}
			<div className="m-6 flex flex-col justify-center items-center font-bold text-2xl">
				<button className="px-10 py-2 bg-purple-500 rounded-lg ">
					<a href="/Addqstn">Add Question</a>
				</button>
			</div>
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<AddForm
							qid={qid}
							onClose={handleClose}
						/>
					</Box>
				</Modal>
			</div>
		</>
	)
}

export default Qstns
