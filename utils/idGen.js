let commitIds = 1,
	treeIds = 0,
	blobIds = 0

export const newCommitId = () => commitIds++
export const newTreeId = () => treeIds++
export const newBlobId = () => blobIds++
