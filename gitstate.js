import {working_area_files} from './utils/areaFunctions.js'
import {updateGraph} from './utils/graphFunctions.js'
import {newCommitId, newTreeId, newBlobId} from './utils/idGen.js'

// Only needed for inital graph drawing
const generateCommitIds = () => {
	return [newCommitId(), newCommitId(), newCommitId(), newCommitId(), newCommitId()]
}
const dummyCommitIds = generateCommitIds()

export const gitState = {
	initialized: false,
	HEAD: 'main',
	Branches: [
		{name: 'main', pointsTo: dummyCommitIds[0]},
		{name: 'myBranch', pointsTo: dummyCommitIds[1]}
	],
	Objects: {
		Blobs: [
			{id: newBlobId(), content: 'Hello from file 1'},
			{id: newBlobId(), content: 'Hello from file 2'},
			{id: newBlobId(), content: 'Hello from file 3'},
			{id: newBlobId(), content: 'Hello from file 4'}
		],
		Trees: [
			{
				id: newTreeId(),
				refs: [
					{modeBits: 100644, type: 'blob', ref: 0, objectName: 'file1'},
					{modeBits: 100644, type: 'blob', ref: 1, objectName: 'file2'}, // objectname = filename
					{modeBits: 100644, type: 'tree', ref: 1, objectName: 'dir1'} // objectname = dirname
				]
			},
			{
				id: newTreeId(),
				refs: [
					{modeBits: 100644, type: 'blob', ref: 0, objectName: 'file3'},
					{modeBits: 100644, type: 'tree', ref: 1, objectName: 'dir1'}
				]
			},
			{
				id: newTreeId(),
				refs: [{modeBits: 100644, type: 'blob', ref: 3, objectName: 'file4'}]
			}
		],
		Commits: [
			{
				id: dummyCommitIds[0],
				message: 'initialcommit',
				tree: 2,
				parentCommits: null,
				author: 'ali',
				committer: 'ali'
			},
			{
				id: dummyCommitIds[1],
				message: '2nd commit',
				tree: 0,
				parentCommits: [dummyCommitIds[0]],
				author: 'ali',
				committer: 'ali'
			},
			{
				id: dummyCommitIds[2],
				message: '3rd commit',
				tree: 0,
				parentCommits: [dummyCommitIds[1]],
				author: 'ali',
				committer: 'ali'
			},
			{
				id: dummyCommitIds[3],
				message: '4th commit',
				tree: 1,
				parentCommits: [dummyCommitIds[2]],
				author: 'ali',
				committer: 'ali'
			},
			{
				id: dummyCommitIds[4],
				message: '5th commit',
				tree: 1,
				parentCommits: [dummyCommitIds[3]],
				author: 'ali',
				committer: 'ali'
			}
		]
	},
	Index: [
		{modeBits: 100644, ref: 0, stageNumber: null, objectName: 'file1'},
		{modeBits: 100644, ref: 1, stageNumber: null, objectName: 'file2'}
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
	const pointsTo = ref
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

export const updateBranch = (branch, newName, newCommitToPointTo) => {
	branch.name = newName ?? branch.name
	branch.pointsTo = newCommitToPointTo ?? branch.pointsTo
	updateGraph()
}

// Commit Functions
export const findCommitById = id => {
	if (isNotDefined(id)) throw new Error('No commit id specified. Aborting...')
	return gitState.Objects.Commits.find(commit => commit.id === id)
}
export const addCommit = (
	message,
	tree,
	parentCommits = [],
	author = gitState.Config.userName,
	committer = gitState.Config.userName
) => {
	if (isNotDefined(message)) throw new Error('No commit message specified. Aborting...')
	const newCommit = {id: newCommitId(), message, tree, parentCommits, author, committer}
	gitState.Objects.Commits.push(newCommit)
	updateGraph()
	return newCommit
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
			ref: ref.ref,
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

export const getBranchPointedByHead = () => findBranchByName(gitState.HEAD)
export const getCommitPointedByHead = () => {
	const branchPointedByHead = getBranchPointedByHead()
	if (branchPointedByHead) return findCommitById(branchPointedByHead.pointsTo)
	else return findCommitById(gitState.HEAD)
}

export const diffWorkingStaging = () => {
	const workingAreaContent = working_area_files
	const stagingAreaContent = gitState.Index

	if (workingAreaContent.length !== stagingAreaContent.length) return true
	let result = false
	stagingAreaContent.forEach(entry => {
		const objectName = entry.objectName
		const content = findBlobById(entry.ref).content
		const workingDirEquivalent = working_area_files.find(entry => entry.filename == objectName)
		if (!workingDirEquivalent || workingDirEquivalent.content !== content) result = true
	})
	return result
}

export const findFileInStaging = filename => gitState.Index.find(entry => entry.objectName === filename)
export const findFileInWorking = filename => working_area_files.find(entry => entry.filename === filename)

export const addFileToStaging = (modeBits = 100644, ref, stageNumber, objectName) => {
	if (findFileInStaging(objectName)) throw new Error('File already exists in staging area')
	else gitState.Index.push({modeBits, ref: ref, stageNumber: null, objectName})
}

export const updateFileInStaging = (modeBits = 100644, ref, stageNumber, objectName) => {
	const entry = findFileInStaging(objectName)
	if (!entry) throw new Error('File does not exist in staging area')
	else {
		entry.modeBits = modeBits
		entry.ref = ref
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
	else if (findBlobById(fileInStaging.ref).content !== fileToCheck.content) return true
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

// Tree traversals
export const generateNodeHistory = (commit, history = []) => {
	if (commit.parentCommits == null) return
	history.push(...commit.parentCommits)
	commit.parentCommits.forEach(commitId => generateNodeHistory(findCommitById(commitId), history))
}

export const generateNodeHistoryWithCommit = commit => {
	const history = [commit.id]
	generateNodeHistory(commit, history)
	return history
}

export const findCommonNodeAncestor = (commit1, commit2) => {
	const history1 = generateNodeHistoryWithCommit(commit1)
	const history2 = generateNodeHistoryWithCommit(commit2)
	var set2 = new Set(history2)
	const setIntersection = [...new Set(history1)].filter(x => set2.has(x))
	return findCommitById(setIntersection[0])
}

const generateBlobArrayFromTree = tree => {
	const blobs = []
	tree.refs?.forEach(ref => {
		if (ref.type === 'blob') blobs.push(ref)
		else if (ref.type === 'tree') {
			const subTree = findTreeById(ref.ref)
			blobs.push(...generateBlobArrayFromTree(subTree))
		}
	})
	return blobs
}

export const diffTrees = (commit1, commit2) => {
	const tree1 = findTreeById(commit1.tree)
	const tree2 = findTreeById(commit2.tree)
	const treeClone1 = structuredClone(tree1)
	const treeClone2 = structuredClone(tree2)
	const resultTree = {id: newTreeId(), refs: []}
	treeClone1.refs?.forEach((ref1, index) => {
		// check if type, object name, and ref are all equal in second tree -> identical tree -> remove in 1st tree
		const ref1InTree2 = treeClone2.refs.find(
			ref2 => ref2.ref === ref1.ref && ref2.objectName === ref1.objectName && ref2.type === ref1.type
		)
		if (ref1InTree2) return treeClone1.refs.splice(index, 1)
		// check if type and ref are equal, but object name is different -> rename only -> let user decide which name to use -> How? Currently Prompt
		const treeRef1RenamedInTree2 = treeClone2.refs.find(
			ref2 => ref2.ref === ref1.ref && ref2.objectName !== ref1.objectName && ref2.type === ref1.type
		)
		if (treeRef1RenamedInTree2) {
			const promptMessage = `You have two different names for the same ${
				treeRef1RenamedInTree2.type === 'blob' ? 'file' : 'directory'
			}: ${ref1.objectName} vs ${treeRef1RenamedInTree2.objectName}. Please input the filename you wish to use: `
			let promptInput = prompt(promptMessage)
			treeRef1RenamedInTree2.objectName = promptInput
			return treeClone1.refs.splice(index, 1)
		}
	})
	// Add remaining stuff in trees 1 & 2
	treeClone1.refs?.forEach(ref => resultTree.refs.push(ref))
	treeClone2.refs?.forEach(ref => resultTree.refs.push(ref))
	// Create new commit from result tree
	return resultTree
}

// Utility
function isNotDefined(variable) {
	variable === null || variable === undefined
}
