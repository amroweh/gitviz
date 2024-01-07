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
			{id: newTreeId(), type: 'blob'},
			{id: newTreeId(), type: 'blob'},
			{id: newTreeId(), type: 'tree'}
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

// Branch Functions
export const findBranchById = id => {
	if (id === null || id === undefined) throw new Error('No branch id specified. Aborting...')
	return gitState.Branches.find(branch => branch.id === id)
}
export const findBranchByName = name => {
	if (name === null || name === undefined) throw new Error('No branch name specified. Aborting...')
	return gitState.Branches.find(branch => branch.name === name)
}
export const addBranch = (name = 'branch', pointsTo = 4 /* UPDATE THIS */) => {
	if (findBranchByName(name)) throw new Error('A branch with this name already exists. Aborting...')
	gitState.Branches.push({id: newCommitId(), name, pointsTo})
	updateGraph()
}
export const removeBranchById = id => {
	if (id === null || id === undefined) throw new Error('No branch id specified. Aborting...')
	gitState.Branches = gitState.Branches.filter(branch => branch.id !== id)
	updateGraph()
}
export const removeBranchByName = name => {
	if (name === null || name === undefined) throw new Error('No branch name specified. Aborting...')
	if (!findBranchByName(name)) throw new Error(`Branch ${name} does not exist. Aborting...`)
	gitState.Branches = gitState.Branches.filter(branch => branch.name !== name)
	updateGraph()
}

// Commit Functions
export const findCommitById = id => {
	if (id === null || id === undefined) throw new Error('No commit id specified. Aborting...')
	return gitState.Objects.Commits.find(commit => commit.id === id)
}
export const addCommit = (message, tree, parentCommit = null, author, committer) => {
	gitState.Objects.Commits.push({id: newCommitId(), message, tree, parentCommit, author, committer})
	updateGraph()
}
export const removeCommitById = id => {
	if (id === null || id === undefined) throw new Error('No commit id specified. Aborting...')
	gitState.Objects.Commits = gitState.Objects.Commits.filter(commit => commit.id !== id)
	updateGraph()
}

// HEAD Functions
export const changeHead = id => {
	if (!findBranchById(id) && !findCommitById(id)) throw new Error('This commit/branch id does not exist')
	else gitState.HEAD = id
	updateGraph()
}

// Other Functions
export const getNodeTypeById = id => {
	if (id === null || id === undefined) throw new Error('No id specified. Aborting...')
	if (findBranchById(id)) return 'branch'
	if (findCommitById(id)) return 'commit'
	return null
}
