const child = require("child_process")
const fs = require("fs")
process.argv = process.argv.slice(2)

const SCRIPT_PATH = __dirname
const EXEC_PATH = process.env.PWD ?? "."
const PACKAGE_INSTALLER = process.argv[0]

if (PACKAGE_INSTALLER === undefined) {
	console.log("Package installer not specified")
	console.log(SCRIPT_PATH)
	process.exit(1)
}

// const CHANGELOG_SCRIPT = `${SCRIPT_PATH}/changelog.js`
// const COMMITLINT_CONFIG = `${SCRIPT_PATH}/commitlint.config.js`
// const COMMITLINT_RULES_CONFIG = `${SCRIPT_PATH}/commitlintRules.config.js`
// const PRETTIER_CONFIG = `${SCRIPT_PATH}/prettier.config.js`
// const PRETTIER_IGNORE = `${SCRIPT_PATH}/.prettierignore`
// const RELEASE_IT_CONFIG = `${SCRIPT_PATH}/.release-it.json`
// const EDITOR_CONFIG = `${SCRIPT_PATH}/.editorconfig`

// child.execSync(`node ${CHANGELOG_SCRIPT} ./package.json ./CHANGELOG.md`)
// console.log("Changelog generated")

// console.log(`Using "${PACKAGE_INSTALLER}" to install packages`)

// let GLOBAL_INSTALL_CMD
// switch (PACKAGE_INSTALLER) {
// 	case "yarn":
// 		GLOBAL_INSTALL_CMD = "yarn global add"
// 		breakhus
// 	case "npm":
// 		GLOBAL_INSTALL_CMD = "npm i -g"
// 		break
// 	case "pnpm":
// 		GLOBAL_INSTALL_CMD = "pnpm add -g"
// 		break
// 	default:
// 		console.log("Invalid package installer")
// 		process.exit(1)
// }

// let INSTALL_CMD
// switch (PACKAGE_INSTALLER) {
// 	case "yarn":
// 		INSTALL_CMD = "yarn add"
// 		break
// 	case "npm":
// 		INSTALL_CMD = "npm i"
// 		break
// 	case "pnpm":
// 		INSTALL_CMD = "pnpm add"
// 		break
// 	default:
// 		console.log("Invalid package installer")
// 		process.exit(1)
// }

// console.log("Installing global packages...")
// child.execSync(
// 	`${GLOBAL_INSTALL_CMD} release-it @release-it/conventional-changelog ${
// 		PACKAGE_INSTALLER === "pnpm" ? "lint-staged" : ""
// 	}`
// )

// console.log("Installing local dev packages...")
// child.execSync(
// 	`${INSTALL_CMD} -D @commitlint/config-conventional husky is-ci lint-staged prettier`
// )

let currentPackageJSON = fs.readFileSync(`${EXEC_PATH}/package.json`, "utf8")
currentPackageJSON = JSON.parse(currentPackageJSON)
currentPackageJSON.scripts = {
	...currentPackageJSON.scripts,
	prepare: "husky install",
	release: "release-it",
	lint: 'prettier --config prettier.config.js "**/*.{js,ts,jsx,tsx,json}" --write --ignore-unknown',
	postinstall: "is-ci || (npm run prepare && npm run lint)",
}
currentPackageJSON["lint-staged"] = {
	"**/*.{js,ts,jsx,tsx,json}": "prettier --write --ignore-unknown",
}

fs.writeFileSync(
	`${EXEC_PATH}/package.json`,
	`${JSON.stringify(currentPackageJSON, null, 4)}\n`
)
console.log("package.json updated")

// // child.execSync(`cp ${COMMITLINT_CONFIG} ${EXEC_PATH}`)
// // child.execSync(`cp ${COMMITLINT_RULES_CONFIG} ${EXEC_PATH}`)
// // child.execSync(`cp ${PRETTIER_CONFIG} ${EXEC_PATH}`)
// // child.execSync(`cp ${PRETTIER_IGNORE} ${EXEC_PATH}`)
// // child.execSync(`cp ${RELEASE_IT_CONFIG} ${EXEC_PATH}`)
// // child.execSync(`cp ${EDITOR_CONFIG} ${EXEC_PATH}`)
// console.log("Copied config files")

// // child.execSync("npm init @eslint/config")
// // console.log("Eslint config generated")

// const huskyInstall = child
// 	.execSync("npx husky install")
// 	.toString("utf-8")
// 	.slice(0, -1)
// console.log(huskyInstall)

// const huskyCommitMsg = child
// 	.execSync(
// 		"npx husky add .husky/commit-msg 'npx --no -- commitlint --edit --verbose'"
// 	)
// 	.toString("utf-8")
// 	.slice(0, -1)
// console.log(huskyCommitMsg)

// const huskyPreCommit = child
// 	.execSync(
// 		`npx husky add .husky/pre-commit ${
// 			PACKAGE_INSTALLER === "pnpm" ? "lint-staged" : "'npx lint-staged'"
// 		}`
// 	)
// 	.toString("utf-8")
// 	.slice(0, -1)
// console.log(huskyPreCommit)

// console.log("Running Postinstall script...")
// console.log(child.execSync(`npm run postinstall`).toString("utf-8"))
