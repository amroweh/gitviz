import {working_area_files} from './utils/areaFunctions.js'
import {updateGraph} from './utils/graphFunctions.js'
import {newCommitId, newTreeId, newBlobId} from './utils/idGen.js'

export const gitState = {
	initialized: false,
	HEAD: 1,
	Branches: [
		{name: 'main', pointsTo: 5},
		{name: 'myBranch', pointsTo: 2}
	],
	Objects: {
		Blobs: [
			{id: newBlobId(), content: 'Hello from file 1'},
			{id: newBlobId(), content: 'Hello from file 22'},
			{id: newBlobId(), content: 'Hello from file 1'}
		],
		Trees: [
			{
				id: newTreeId(),
				refs: [
					{modeBits: 100644, type: 'blob', blobRef: 1, objectName: 'file1'}, // name or path?
					{modeBits: 100644, type: 'blob', blobRef: 2, objectName: 'file1'}
				]
			},
			{
				id: newTreeId(),
				refs: [
					{modeBits: 100644, type: 'blob', blobRef: 1, objectName: 'file1'}, // name or path?
					{modeBits: 100644, type: 'blob', blobRef: 2, objectName: 'file1'},
					{modeBits: 100644, type: 'tree', treeRef: 1, objectName: 'file1'} // what would this be for tree?
				]
			}
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
		{modeBits: 100644, blobRef: 0, stageNumber: null, objectName: 'file1'},
		{modeBits: 100644, blobRef: 1, stageNumber: null, objectName: 'file2'}
	],
	Config: {
		userName: 'Default User' 
	}
}

// Branch Functions
export const findAllBranches = () => {
	return gitState.Branches
}
export const findBranchByName = name => {
	if (isNotDefined(name)) throw new Error('No branch name specified. Aborting...')
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
	if (isNotDefined(name)) throw new Error('No branch name specified. Aborting...')
	if (!findBranchByName(name)) throw new Error(`Branch ${name} does not exist. Aborting...`)
	gitState.Branches = gitState.Branches.filter(branch => branch.name !== name)
	updateGraph()
}

// Commit Functions
export const findCommitById = id => {
	if (isNotDefined(id)) throw new Error('No commit id specified. Aborting...')
	return gitState.Objects.Commits.find(commit => commit.id === id)
}
export const addCommit = (message, tree, parentCommit = null, author, committer) => {
	if (isNotDefined(message)) throw new Error('No commit message specified. Aborting...')
	const commitId = newCommitId()
	gitState.Objects.Commits.push({id: commitId, message, tree, parentCommit, author, committer})
	updateGraph()
	return commitId
}
export const removeCommitById = id => {
	if (isNotDefined(id)) throw new Error('No commit id specified. Aborting...')
	gitState.Objects.Commits = gitState.Objects.Commits.filter(commit => commit.id !== id)
	updateGraph()
}

// Blob Functions
export const findBlobById = id => {
	if (isNotDefined(id)) throw new Error('No blob id specified. Aborting...')
	return gitState.Objects.Blobs.find(blob => blob.id === id)
}

export const addBlob = blobContent => {
	const blob = {id: newBlobId(), content: blobContent}
	gitState.Objects.Blobs.push(blob)
	return blob
}

// Tree Functions
export const findTreeById = id => {
	if (isNotDefined(id)) throw new Error('No tree id specified. Aborting...')
	return gitState.Objects.Trees.find(tree => tree.id === id)
}

export const addTree = treeRefs => {
	const tree = {id: newTreeId(), refs: []}
	treeRefs.forEach(ref => {
		tree.refs.push({
			modeBits: ref.modeBits ?? 100644,
			type: ref.type ?? 'blob',
			blobRef: ref.blobRef,
			objectName: ref.objectName
		})
	})
	gitState.Objects.Trees.push(tree)
	updateGraph()
	return tree
}

// HEAD Functions
export const changeHead = ref => {
	if (!findBranchByName(ref) && !findCommitById(ref)) throw new Error('This commit/branch does not exist')
	else gitState.HEAD = ref
	updateGraph()
}

// Other Functions
export const getNodeTypeById = ref => {
	if (isNotDefined(ref)) throw new Error('No ref specified. Aborting...')
	if (findBranchByName(ref)) return 'branch'
	if (findCommitById(ref)) return 'commit'
	return null
}

export const getCommitIdPointedByBranch_Name = branchName => {
	if (isNotDefined(branchName)) throw new Error('No branch name specified. Aborting...')
	const branch = findBranchByName(branchName)
	if (!branch) throw new Error('Branch with this name not found')
	else return branch.pointsTo
}

export const getCommitIdPointedByHead = () => {
	// Case 1: HEAD is pointing to a branch
	const branchPointedByHead = findBranchByName(gitState.HEAD)
	if(isDefined(branchPointedByHead)) return branchPointedByHead.pointsTo
	// Case 2: HEAD is pointing to commit
	const commitPointedByHead = findCommitById(gitState.HEAD)
	if (isDefined(commitPointedByHead)) return commitPointedByHead.id
	// Case 3: HEAD is not pointing to anything
	return null
}

export const getBranchPointedByHead = () => {
	const branchPointedByHead = findBranchByName(gitState.HEAD)
	if (isDefined(branchPointedByHead)) return branchPointedByHead
}

export const diffWorkingStaging = () => {
	const workingAreaContent = working_area_files
	const stagingAreaContent = gitState.Index

	if (workingAreaContent.length !== stagingAreaContent.length) return true
	let result = false
	stagingAreaContent.forEach(entry => {
		const objectName = entry.objectName
		const content = findBlobById(entry.blobRef).content
		const workingDirEquivalent = working_area_files.find(entry => entry.filename == objectName)
		if (!workingDirEquivalent || workingDirEquivalent.content !== content) result = true
	})
	return result
}

export const findFileInStaging = filename => {
	return gitState.Index.find(entry => entry.objectName === filename)
}

export const findFileInWorking = filename => {
	return working_area_files.find(entry => entry.filename === filename)
}

export const addFileToStaging = (modeBits = 100644, blobRef, stageNumber, objectName) => {
	if (findFileInStaging(objectName)) throw new Error('File already exists in staging area')
	else gitState.Index.push({modeBits, blobRef: blobRef, stageNumber: null, objectName})
}

export const updateFileInStaging = (modeBits = 100644, blobRef, stageNumber, objectName) => {
	const entry = findFileInStaging(objectName)
	if (!entry) throw new Error('File does not exist in staging area')
	else {
		entry.modeBits = modeBits
		entry.blobRef = blobRef
		entry.stageNumber = stageNumber
		entry.objectName = objectName
	}
}

export const diffFileWorkingStaging = filename => {
	const fileToCheck = findFileInWorking(filename)
	// Not in working
	if (!fileToCheck) throw new Error('The specified filename does not exist in the working directory')
	const fileInStaging = findFileInStaging(filename)
	// In working but not in staging
	if (!fileInStaging) return true
	// In working and staging, need to check if content is different
	else if (findBlobById(fileInStaging.blobRef).content !== fileToCheck.content) return true
	return false
}

export const addFileFromWorkingToIndex = objectName => {
	const fileInWorking = findFileInWorking(objectName)
	if (!fileInWorking) throw new Error('The specified filename does not exist in the working directory')
	if (!diffFileWorkingStaging(objectName)) throw new Error('file unchanged in working vs staging area')
	const fileInStaging = findFileInStaging(objectName)
	// file is in working but not in staging
	const blob = addBlob(fileInWorking.content)
	if (!fileInStaging) addFileToStaging(undefined, blob.id, undefined, objectName)
	// file is in working & staging but content is different
	else updateFileInStaging(undefined, blob.id, undefined, objectName)
}

export const addAllFromWorkingToIndex = () => {
	if (!diffWorkingStaging()) throw new Error('no working area changes to add to staging area. aborting...')
	working_area_files.forEach(file => {
		if (diffFileWorkingStaging(file.filename)) addFileFromWorkingToIndex(file.filename)
	})
}

// Utility
const isNotDefined = variable => variable === null || variable === undefined
const isDefined = variable => !isNotDefined(variable)