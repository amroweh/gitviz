const generateUniqueString = () => {
	const timestamp = new Date().getTime()
	const randomString = Array.from({length: 16}, () =>
		Math.floor(Math.random() * 256)
			.toString(16)
			.padStart(2, '0')
	).join('')
	return randomString + timestamp.toString(16)
}

let treeIds = 0,
	blobIds = 0

export const newCommitId = () => {
	return generateUniqueString()
}
export const newTreeId = () => treeIds++
export const newBlobId = () => blobIds++
