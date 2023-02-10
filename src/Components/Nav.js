import React from "react"
import { signOut } from "firebase/auth"
import { auth } from "../Config/firebase"
import "font-awesome/css/font-awesome.min.css"
import Bars from "../Icons/Bars"
import Snout from "../Icons/Snout"
import Pfle from "../Icons/Pfle"
import Pground from "../Icons/Pground"

export default function Navbar() {
	const [navbarOpen, setNavbarOpen] = React.useState(false)
	const [isSignedin, setIsSignedin] = React.useState(false)
	React.useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setIsSignedin(true)
			} else {
				setIsSignedin(false)
			}
		})
	}, [])
	function logout() {
		signOut(auth)
			.then(() => {
				console.log("logged out")
			})
			.catch(error => {
				console.log(error.message)
			})
	}
	return (
		<>
			<nav className="relative flex flex-wrap items-center justify-between px-2 py-4 bg-slate-500 mb-3">
				<div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
						<a
							className="font-bold leading-relaxed inline-block mr-4 py-4 whitespace-nowrap uppercase text-white text-2xl"
							href="/"
						>
							Coding Workstation
						</a>
						<button
							className="text-white cursor-pointer text-xl leading-none px-3 py-3 border border-solid border-transparent rounded  block lg:hidden outline-none focus:outline-none"
							type="button"
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<Bars />
						</button>
					</div>
					<div
						className={
							"lg:flex flex-grow items-center" +
							(navbarOpen ? " flex" : " hidden")
						}
						id="example-navbar-danger"
					>
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
							<li className="nav-item">
								<a
									className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
									href="/"
								>
									<Pground />
									<span className="ml-2">Play Ground</span>
								</a>
							</li>
							{!isSignedin && (
								<>
									<li className="nav-item">
										<a
											className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
											href="/Signin"
										>
											<span className="ml-2">Signin</span>
										</a>
									</li>
									<li className="nav-item">
										<a
											className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
											href="/Signup"
										>
											<span className="ml-2">Signup</span>
										</a>
									</li>
								</>
							)}
							{isSignedin && (
								<>
									<li className="nav-item">
										<a
											className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
											href="/"
											onClick={logout}
										>
											<Snout />
											<span className="ml-2">
												Signout
											</span>
										</a>
									</li>
									<li className="nav-item">
										<a
											className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
											href="/Profile"
										>
											<Pfle />
											<span className="ml-2">
												Profile
											</span>
										</a>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}
