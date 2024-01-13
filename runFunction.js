import {
	addBranch,
	changeHead,
	findAllBranches,
	findBranchByName,
	findCommitById,
	getCommitIdPointedByBranch_Name,
	gitState,
	removeBranchByName
} from './gitstate.js'
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
	if (regex1.test(cmd)) {
		console.log('regex 1 passed!')
		// extract branch name from this array
		const branchName = words.length === 4 ? words[3] : null
		if (!branchName) return addToTerminalHistory('not a recognized git command...')
		// check if branch name exists
		if (findBranchByName(branchName)) return addToTerminalHistory('branch with this name already exists, aborting...')
		else {
			addBranch(branchName)
			return addToTerminalHistory(`branch ${branchName} was created successfully`)
		}
	}
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
			changeHead(branch.name)
			return addToTerminalHistory(`You are checking out branch: ${branch.name}`)
		}
		if (commit) {
			changeHead(commit.id)
			return addToTerminalHistory(`You are checking out commit: ${commit.id}. You are now in 'detached head' state`)
		}
	}
	if (regex3.test(cmd)) {
		console.log('regex 3 passed!')
		// extract branch name from this array
		const branchName = words.length === 4 ? words[3] : null
		if (!branchName) return addToTerminalHistory('not a recognized git command...')
		// if branch requested is main, abort
		if (branchName === 'main') return addToTerminalHistory(`main branch cannot be deleted! aborting...`)
		// check if branch name exists
		const branch = findBranchByName(branchName)
		if (!branch) return addToTerminalHistory(`branch ${branchName} not found, aborting...`)
		// check if the branch is current
		if (branchName === gitState.HEAD)
			return addToTerminalHistory(`please switch to a different branch before deleting. aborting...`)
		// if branch exists & not pointing to same commit as HEAD, we are able to delete it
		removeBranchByName(branchName)
		return addToTerminalHistory(`branch ${branchName} deleted successfully`)
	}
	if (regex4.test(cmd)) {
		console.log('regex 4 passed!')
		// TO BE ADDED IN DIFFERENT WAY
		// save changes from working area
		// const changes = new Array(...workingAreaChanges)
		// remove them from working area
		// removeAllChangesFromWorkingArea()
		// add them to staging area
		// addAllChangesToStagingArea(changes)
	}
	if (regex5.test(cmd)) {
		console.log('regex 5 passed!')
		// // save changes from staging area
		// const changes = new Array(...stagingAreaChanges)
		// // remove them from staging area
		// removeAllChangesFromStagingArea()
		// // add them to git dir area
		// addAllChangesToGitDirArea(changes)
		// // create new node for the commit and add to graph
		// const newId = randomId()
		// addNewNode(newId, 'commit_' + newId, 'commit')
		// // Link new commit to previous commit
		// console.log(headId)
		// if (headId === 0) addNewLink(headId, newId)
		// else {
		// 	const targetNodeFromSource = getTargetNodeFromSource(headId)
		// 	console.log(targetNodeFromSource)
		// 	addNewLink(newId, getTargetNodeFromSource(headId).id)
		// 	// Link new commit to head
		// 	linkNodeToHead(newId, false)
		// 	// Remove previous link between head and previous commit/branch
		// 	removeLink(headId, getTargetNodeFromSource(headId).id)
		// }
		// addToHistory(`new commit created successfully`)
		// return
	}
	if (regex6.test(cmd)) {
		console.log('regex 6 passed!')
		findAllBranches().forEach(branch =>
			addToTerminalHistory(branch.name === gitState.HEAD ? '*' + branch.name : branch.name)
		)
		return
	}
	if (regex7.test(cmd)) {
		console.log('regex 7 passed!')
		// extract branch name from this array
		const branchName = words.length === 3 ? words[2] : null
		if (!branchName) return addToTerminalHistory('not a recognized git command...')
		// check if branch name exists
		if (findBranchByName(branchName)) return addToTerminalHistory('branch with this name already exists, aborting...')
		else {
			addBranch(branchName)
			return addToTerminalHistory(`branch ${branchName} was created successfully`)
		}
	}
}
