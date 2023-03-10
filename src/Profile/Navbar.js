import React from "react"
import { signOut } from "firebase/auth"
import { auth } from "../Config/firebase"
import "font-awesome/css/font-awesome.min.css"
import Bars from "../Icons/Bars"
export default function Navbar() {
	const [navbarOpen, setNavbarOpen] = React.useState(false)
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
							className="text-2xl font-bold leading-relaxed inline-block mr-4 py-4 whitespace-nowrap uppercase text-white"
							href="/"
						>
							<span>Coding Workstation</span>
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
									<span className="ml-2">Play Ground</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
									href="/"
									onClick={logout}
								>
									<span className="ml-2">Signout</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									className="px-3 py-3 flex items-center text-base uppercase font-bold leading-snug text-white hover:opacity-75"
									href="/Questions"
								>
									<span className="ml-2">Questions</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}
