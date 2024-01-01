let branchIds = 0,
	commitIds = 0,
	treeIds = 0,
	blobIds = 0

export const newBranchId = () => branchIds++
export const newCommitId = () => commitIds++
export const newTreeId = () => treeIds++
export const newBlobId = () => blobIds++
