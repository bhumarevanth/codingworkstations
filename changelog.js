const child = require("child_process")
const fs = require("fs")
const releaseIdx = []
const commitReleases = []
const releaseIdxs = []
let changeLog = ``

let remoteUrl = child
	.execSync("git config --get remote.origin.url")
	.toString("utf-8")
remoteUrl = remoteUrl.substring(0, remoteUrl.lastIndexOf("."))

const firstCommit = child
	.execSync(`git rev-list --max-parents=0 HEAD`)
	.toString("utf-8")
	.slice(0, -1)

const output = child
	.execSync(`git log --format=%B%H%ci----DELIMITER----`)
	.toString("utf-8")

const commitsArray = output
	.split("----DELIMITER----\n")
	.map(commit => {
		const [message, sha] = commit.split("\n")

		return {
			sha,
			message,
		}
	})
	.filter(commit => Boolean(commit.sha) && commit.sha.length > 40)
	.map(commit => ({
		...commit,
		sha: commit.sha.substring(0, 40),
		date: new Date(commit.sha.substring(40)).toISOString().split("T")[0],
	}))
	.filter(commit => !commit.message.includes("Merge branch"))
// console.log(commitsArray)

const initialCommitMessage = commitsArray[commitsArray.length - 1].message

commitsArray[commitsArray.length - 1].message = `0.0.0 [${
	commitsArray[commitsArray.length - 1].message
}]`

commitsArray.forEach((commit, idx) => {
	if (
		/(\d+\.)(\d+\.)(\d+)/.test(commit.message) ||
		idx === commitsArray.length - 1
	) {
		if (!/^(\d+\.)(\d+\.)(\d+)$/.test(commit.message))
			commit.message = /(\d+\.)(\d+\.)(\d+)/.exec(commit.message)[0]
		releaseIdx.push(idx)
	}
})

commitsArray[commitsArray.length - 1].message = `${initialCommitMessage}`

releaseIdx.push(commitsArray.length)
releaseIdx.forEach((rIdx, idx) => {
	if (idx !== releaseIdx.length - 1)
		releaseIdxs.push([rIdx, releaseIdx[idx + 1]])
})

const types = {
	feat: "✨ Features",
	fix: "🐛 Bug Fixes",
	docs: "📚 Documentation",
	style: "🎨 Styles",
	refactor: ":recycle: Code Refactoring",
	perf: "🚀 Performance Improvements",
	test: "🚨 Tests",
	build: "🛠 Builds",
	merge: "🔀 Merge",
	ci: "⚙️ Continuous Integrations",
	chore: "* Chores",
	revert: "⏪ Reverts",
	deprecate: "☠️ Deprecated",
	security: "🔐 Security",
	remove: "🗑️ Security",
	upgrade: "⬆️ Packages Upgrades",
	wip: "🚧 Work In Progress",
	add: ":heavy_plus_sign: Add",
}
releaseIdxs.forEach(idx => {
	const commitSlice = commitsArray.slice(idx[0], idx[1])
	const first = commitSlice.slice(0, 1)[0]
	const restCommits = commitSlice.slice(1)
	let newCommits = {
		ambulance: [],
		art: [],
		boom: [],
		building_construction: [],
		construction: [],
		hammer: [],
		loud_sound: [],
		package: [],
		rewind: [],
		rocket: [],
		sparkles: [],
		tada: [],
		wrench: [],
		feat: [],
		fix: [],
		docs: [],
		style: [],
		refactor: [],
		perf: [],
		test: [],
		build: [],
		merge: [],
		ci: [],
		chore: [],
		revert: [],
		deprecate: [],
		security: [],
		remove: [],
		upgrade: [],
		wip: [],
		add: [],
		"*": [],
	}
	if (restCommits.length) {
		restCommits.forEach(commit => {
			if (
				/(:).{3,}\1/.test(commit.message) ||
				Object.keys(types).includes(commit.message.split(":")[0])
			) {
				Object.keys(newCommits).forEach(key => {
					if (commit.message.includes(`:${key}:`)) {
						newCommits[key].push(
							`* ${commit.message.replace(
								`:${key}: `,
								""
							)} ([${commit.sha.substring(
								0,
								6
							)}](${remoteUrl}/commit/${commit.sha}))\n`
						)
					} else if (commit.message.includes(`${key}:`)) {
						newCommits[key].push(
							`* ${commit.message.replace(
								`:${key}s: `,
								types[key]
							)} ([${commit.sha.substring(
								0,
								6
							)}](${remoteUrl}/commit/${commit.sha}))\n`
						)
					}
				})
			} else {
				newCommits["*"].push(
					`* ${commit.message} ([${commit.sha.substring(
						0,
						6
					)}](${remoteUrl}/commit/${commit.sha}))\n`
				)
			}
		})
	}
	newCommits = Object.fromEntries(
		Object.entries(newCommits).filter(([_, value]) => value.length > 0)
	)
	commitReleases.push([first, newCommits])
})

// console.log(JSON.stringify(commitReleases, null, 4))
commitReleases.forEach((commits, idx) => {
	const first = commits.slice(0, 1)[0]
	const restCommits = commits.slice(1)
	let link = ""

	if (idx === commitReleases.length - 1)
		link = `${remoteUrl}/commit/${firstCommit}`
	else if (idx === commitReleases.length - 2)
		link = `${remoteUrl}/compare/v${first.message}...${
			commitReleases[idx + 1][0].sha
		}`
	else
		link = `${remoteUrl}/compare/v${first.message}...${
			commitReleases[idx + 1][0].message
		}`

	changeLog += `## [${first.message}](${link}) (${first.date})\n`
	restCommits.forEach(commit => {
		Object.keys(commit).forEach(key => {
			console.log(key)
			if (commit[key].length) {
				const header =
					key === "*"
						? "*"
						: Object.keys(types).includes(key)
						? types[key]
						: `:${key}:`
				console.log(header)
				changeLog += `### ${header}\n`
				commit[key].forEach(commit => {
					changeLog += commit
				})
				console.log(changeLog)
				changeLog += "\n"
			}
		})
	})
	changeLog += "\n"
})

fs.writeFileSync(`${process.env.PWD}/${process.argv[3]}`, changeLog)
