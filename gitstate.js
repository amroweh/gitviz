import {updateGraph} from './utils/graphFunctions.js'
import {newCommitId, newTreeId, newBlobId} from './utils/idGen.js'

export const gitState = {
	HEAD: 'myBranch',
	Branches: [
		{name: 'main', pointsTo: 5},
		{name: 'myBranch', pointsTo: 2}
	],
	Objects: {
		Blobs: [
			{id: newBlobId(), content: 'Hello from file 1'},
			{id: newBlobId(), content: 'Hello from file 1, amended'},
			{id: newBlobId(), content: 'Hello from file 1'}
		],
		Trees: [
			{id: newTreeId(), modeBits: 100644, type: 'blob', blobRef: 1, objectName: 'file1.txt'}, // name or path?
			{id: newTreeId(), modeBits: 100644, type: 'blob', blobRef: 2, objectName: 'file1.txt'},
			{id: newTreeId(), modeBits: 100644, type: 'tree', treeRef: 1, objectName: 'file1.txt'} // what would this be for tree?
		],
		Commits: [
			{id: newCommitId(), message: 'initialcommit', tree: 3, parentCommit: null, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '2nd commit', tree: 3, parentCommit: 1, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '3rd commit', tree: 4, parentCommit: 2, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '4th commit', tree: 4, parentCommit: 3, author: 'ali', committer: 'ali'},
			{id: newCommitId(), message: '5th commit', tree: 5, parentCommit: 3, author: 'ali', committer: 'ali'}
		]
	},
	Index: [
		{modeBits: 100644, blobRef: 1, stageNumber: null, objectName: 'file1.txt'},
		{modeBits: 100644, blobRef: 1, stageNumber: null, objectName: 'file2.txt'},
		{modeBits: 100644, blobRef: 2, stageNumber: null, objectName: null},
		{modeBits: 100644, blobRef: 3, stageNumber: null, objectName: null}
	]
}

// Branch Functions
export const findAllBranches = () => {
	return gitState.Branches
}
export const findBranchByName = name => {
	if (name === null || name === undefined) throw new Error('No branch name specified. Aborting...')
	return gitState.Branches.find(branch => branch.name === name)
}
export const addBranch = (name = 'branch', ref = gitState.HEAD) => {
	if (findBranchByName(name)) throw new Error('A branch with this name already exists. Aborting...')
	const pointsTo = Number.isInteger(ref) ? ref : getCommitIdPointedByBranch_Name(ref)
	gitState.Branches.push({name, pointsTo})
	gitState.HEAD = name
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
export const changeHead = ref => {
	if (!findBranchByName(ref) && !findCommitById(ref)) throw new Error('This commit/branch does not exist')
	else gitState.HEAD = ref
	updateGraph()
}

// Other Functions
export const getNodeTypeById = id => {
	if (id === null || id === undefined) throw new Error('No id specified. Aborting...')
	if (findBranchById(id)) return 'branch'
	if (findCommitById(id)) return 'commit'
	return null
}

export const getCommitIdPointedByBranch_Name = branchName => {
	if (branchName === null || branchName === undefined) throw new Error('No branch name specified. Aborting...')
	const branch = findBranchByName(branchName)
	if (!branch) throw new Error('Branch with this name not found')
	else return branch.pointsTo
}
