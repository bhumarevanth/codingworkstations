import React from "react"

function Code(props) {
	console.log(props.sdata)
	return (
		<>
			<h1 className="text-2xl m-4 font-bold">{props.sdata.heading}</h1>
			<hr className="border-t border-black my-8" />
			<p className="whitespace-pre-line m-4 text-xl font-mono">
				{props.sdata.code}
			</p>
		</>
	)
}

export default Code
