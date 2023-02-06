child.execSync("npm init @eslint/config")
console.log("Eslint config generated")

const huskyInstall = child
	.execSync("npx husky install")
	.toString("utf-8")
	.slice(0, -1)
console.log(huskyInstall)

const huskyCommitMsg = child
	.execSync(
		'npx husky add .husky/commit-msg "npx --no -- commitlint --edit --verbose"'
	)
	.toString("utf-8")
	.slice(0, -1)
console.log(huskyCommitMsg)

const huskyPreCommit = child
	.execSync(`npx husky add .husky/pre-commit "npx lint staged"`)
	.toString("utf-8")
	.slice(0, -1)
console.log(huskyPreCommit)

console.log("Running Postinstall script...")
console.log(child.execSync(`npm run postinstall`).toString("utf-8"))
