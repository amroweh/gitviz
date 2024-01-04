import {updateGraph} from './utils/graphFunctions.js'
import {newCommitId, newTreeId, newBlobId} from './utils/idGen.js'

export const gitState = {
	HEAD: 1,
	Branches: [
		{id: newCommitId(), name: 'main', pointsTo: 5},
		{id: newCommitId(), name: 'myBranch', pointsTo: 6}
	],
	Objects: {
		Blobs: [],
		Trees: [
			{type: 'blob', id: newTreeId()},
			{type: 'blob', id: newTreeId()},
			{type: 'tree', id: newTreeId()}
		],
		Commits: [
			{id: newCommitId(), message: 'initialcommit', tree: 3, parentCommit: null, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '2nd commit', tree: 3, parentCommit: 2, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '3rd commit', tree: 4, parentCommit: 3, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '4th commit', tree: 4, parentCommit: 4, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '5th commit', tree: 5, parentCommit: 4, author: 'ali', committer: 'ali'}
		]
	}
}

// CHANGE DEFAULTS!
export const findBranch = branchName => {
	if (!branchName) return
	return gitState.Branches.find(branch => branch.name === branchName)
}
export const addBranch = (name = 'branch', pointsTo = 4) => {
	if(findBranch(name)) return
	gitState.Branches.push({id:newCommitId(), name, pointsTo})
	updateGraph()
}
export const removeBranchById = id => {
	gitState.Branches = gitState.Branches.filter(branch => branch.id !== id)
	updateGraph()
}
