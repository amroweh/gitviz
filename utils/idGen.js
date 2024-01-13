let branchIds = 0,
	commitIds = 1,
	treeIds = 0,
	blobIds = 0
	// graphIds = 0

export const newBranchId = () => branchIds++
export const newCommitId = () => commitIds++
export const newTreeId = () => treeIds++
export const newBlobId = () => blobIds++
// export const newGraphId = () => graphIds++
