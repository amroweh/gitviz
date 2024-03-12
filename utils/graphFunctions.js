import Graph from '../graph.js'
import {
	findBranchByName,
	findCommitById,
	generateNodeHistoryWithCommit,
	getNodeTypeById,
	gitState
} from '../gitstate.js'
import {newCommitId} from './idGen.js'
import {updateAreas} from './areaFunctions.js'

const convertStateToGraph = () => {
	const nodes = []
	const links = []
	const headRef = gitState.HEAD
	const headNode = getNodeTypeById(headRef) === 'branch' ? findBranchByName(headRef) : findCommitById(headRef)
	const headHistory = generateNodeHistoryWithCommit(headNode)
	// Create Nodes & Links for Commits
	gitState.Objects.Commits.forEach(commit => {
		const isMergeCommit = commit.parentCommits?.length > 1
		nodes.push({
			id: commit.id,
			name: commit.message,
			type: isMergeCommit ? 'mergecommit' : 'commit',
			withShadow: headHistory.includes(commit.id)
		})
		console.log(commit)
		if (commit.parentCommits) {
			commit.parentCommits.forEach(parentCommit =>
				links.push({
					source: commit.id,
					target: parentCommit,
					lineStyle: isMergeCommit ? 'dotted' : 'regular',
					withShadow: headHistory.includes(commit.id) && headHistory.includes(parentCommit)
				})
			)
		}
	})
	// Create Nodes & Links for Branches
	gitState.Branches.forEach(branch => {
		const branchGraphId = newCommitId()
		nodes.push({id: branch.name, name: branch.name, type: 'branch'})
		if (branch.pointsTo !== null && branch.pointsTo !== undefined)
			links.push({source: branch.name, target: branch.pointsTo})
	})
	// Create Nodes & Links for HEAD
	const headId = newCommitId()
	nodes.push({id: headId, name: 'H', type: 'head'})
	links.push({source: headId, target: headRef})

	console.log({nodes, links, headId: headRef})
	return {nodes, links, headId: headRef}
}
export const updateGraph = () => {
	Graph(convertStateToGraph())
	updateAreas()
}
