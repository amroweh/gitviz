import {changeHead, findBranchByName, findCommitById, getNodeTypeById} from './gitstate.js'
import {addToTerminalHistory, clearTerminal} from './terminalHandler.js'

let initialized = false

export const run = cmd => {
	// Regexes to match command against
	const regex1 = new RegExp('^git checkout -b ')
	const regex2 = new RegExp('^git checkout')
	const regex3 = new RegExp('^git branch -d ')
	const regex4 = new RegExp('git add .')
	const regex5 = new RegExp('^git commit -m')
	const regex6 = new RegExp('^git branch$')
	const regex7 = new RegExp('^git branch')
	const regex8 = new RegExp('git init')

	// Basic command cleaning
	cmd = cmd.trim()
	if (cmd === '') return addToTerminalHistory('nothing here...')
	if (cmd === 'clear') return clearTerminal()
	// convert string to array of words
	const words = cmd.split(' ')

	// Git still not initialized (no git init command performed yet)
	if (!initialized) {
		if (regex8.test(cmd)) {
			initialized = true
			return addToTerminalHistory('Initialized empty Git repository in /')
		} else return addToTerminalHistory(`fatal: not a git repository (or any of the parent directories): .git`)
	}
	// DON'T FORGET FIRST REGEX
	if (regex2.test(cmd)) {
		console.log('regex 2 passed!')
		// extract branch name from this array
		const stringToCheckout = words.length === 3 ? words[2] : null
		if (!stringToCheckout)
			return addToTerminalHistory('please use the correct git checkout syntax: git checkout branch_name|commit_id')

		// check if branch/commit exists
		const branch = findBranchByName(stringToCheckout)
		const commit = findCommitById(stringToCheckout * 1)
		if (!branch && !commit) return addToTerminalHistory('A branch/commit with this name/id does not exist, aborting...')

		// Create message based on node type && set HEAD to new id
		if (branch) {
			changeHead(branch.id)
			return addToTerminalHistory(`You are checking out branch: ${branch.name}`)
		}
		if (commit) {
			changeHead(commit.id)
			return addToTerminalHistory(`You are checking out commit: ${commit.id}. You are now in 'detached head' state`)
		}
	}
}
