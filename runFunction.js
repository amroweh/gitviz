import {
	addAllFromWorkingToIndex,
	addBlob,
	addBranch,
	addCommit,
	addFileFromWorkingToIndex,
	addTree,
	changeHead,
	diffFileWorkingStaging,
	diffWorkingStaging,
	findAllBranches,
	findBranchByName,
	findCommitById,
	gitState,
	removeBranchByName,
	updateFileInStaging,
	getNodeTypeById,
	getBranchPointedByHead,
	getCommitPointedByHead,
	findCommonNodeAncestor,
	updateBranch,
	diffTrees
} from './gitstate.js'
import {addToTerminalHistory, clearTerminal} from './terminalHandler.js'
import {updateAreas, working_area_files} from './utils/areaFunctions.js'

export const run = cmd => {
	// Regexes to match command against
	const regex1 = new RegExp('^git checkout -b ')
	const regex2 = new RegExp('^git checkout')
	const regex3 = new RegExp('^git branch -d ')
	const regex5 = new RegExp('^git commit -m')
	const regex6 = new RegExp('^git branch$')
	const regex7 = new RegExp('^git branch')
	const regex8 = new RegExp('git init')
	const regex9 = new RegExp('^git add')
	const regex10 = new RegExp('^git merge')

	// Basic command cleaning
	cmd = cmd.trim()
	if (cmd === '') return addToTerminalHistory('nothing here...')
	if (cmd === 'clear') return clearTerminal()
	// convert string to array of words
	const words = cmd.split(' ')

	// Git still not initialized (no git init command performed yet)
	if (!gitState.initialized) {
		if (regex8.test(cmd)) {
			gitState.initialized = true
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
	if (regex5.test(cmd)) {
		console.log('regex 5 passed!')
		// extract commit message from this array
		const commitMessage = words.length === 4 ? words[3] : null
		if (!commitMessage || commitMessage === '')
			return addToTerminalHistory('please use the correct git commit syntax: git commit -m <message>')
		// Using bolbs in index, create tree for these blobs
		const tree = addTree(gitState.Index)
		// Create commit using this tree
		const commitIdPointedByHead = getCommitPointedByHead().id
		const commitId = addCommit(commitMessage, tree, commitIdPointedByHead, gitState.Config.userName).id
		// Check if HEAD points to branch, if so we need to point the branch to new commit & head to new branch
		let branchPointedByHead = null
		if (getNodeTypeById(gitState.HEAD) === 'branch') {
			branchPointedByHead = getBranchPointedByHead()
			branchPointedByHead.pointsTo = commitId
			changeHead(branchPointedByHead.name)
		} else changeHead(commitId)
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
	if (regex9.test(cmd)) {
		console.log('regex 9 passed!')
		// extract file name from this array
		const change = words.length === 3 ? words[2] : null
		if (!change) return addToTerminalHistory('please use "git add file_name" or "git add ."...')
		if (!diffWorkingStaging())
			return addToTerminalHistory('no working area changes to add to staging area. aborting...')
		// For git add .
		if (change === '.') {
			addAllFromWorkingToIndex()
		} else {
			// check if there's a difference between file in working/staging
			if (!diffFileWorkingStaging(change))
				return addToTerminalHistory('file unchanged in working vs staging area. aborting...')
			else addFileFromWorkingToIndex(change)
		}
		updateAreas()
	}
	if (regex10.test(cmd)) {
		console.log('regex 10 passed!')
		// extract commit from branch/commit specified
		let commitToMerge = words[2],
			currentCommit = getCommitPointedByHead()
		if (!commitToMerge) return addToTerminalHistory('please use "git merge commit_to_merge". Aborting...')
		commitToMerge = findBranchByName(commitToMerge)
			? findCommitById(findBranchByName(commitToMerge).pointsTo)
			: findCommitById(+commitToMerge)
		if (!commitToMerge) return addToTerminalHistory('This branch/commit does not exist. Aborting...')
		// If current commit and commit to merge are the same
		if (currentCommit === commitToMerge)
			return addToTerminalHistory('You cannot merge two identical commits. Aborting...')
		// Find common ancestor between currentCommit & commitToMerge
		const commonNodeAncestor = findCommonNodeAncestor(currentCommit, commitToMerge)
		// If the current branch head is an ancestor of the commit to merge, only need to fast forward
		const branchPointedByHead = getBranchPointedByHead()
		if (commonNodeAncestor === currentCommit && branchPointedByHead) {
			updateBranch(branchPointedByHead, null, commitToMerge.id)
			changeHead(branchPointedByHead.name)
			return addToTerminalHistory('Fast-forward...')
		}
		// Otherwise, we need to perform a three-way merge
		else {
			// find diff between each commit and create a new commit from that
			const resultTree = diffTrees(commitToMerge, currentCommit)
			const branchToMerge = findBranchByName(words[2])
			const currentBranch = getBranchPointedByHead()
			const resultCommitMessage = `Merged branch ${currentBranch ? currentBranch.name : currentCommit} and ${
				branchToMerge ? branchToMerge.name : commitToMerge.message
			}`
			const resultCommit = addCommit(resultCommitMessage, resultTree, [currentCommit.id, commitToMerge.id])
			if (currentBranch) updateBranch(currentBranch, null, resultCommit.id)
			return addToTerminalHistory(resultCommitMessage)
		}
	}
}
