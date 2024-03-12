function generateUniqueString() {
	// Get the current timestamp in milliseconds
	const timestamp = new Date().getTime()

	// Generate a random 16-byte string
	const randomString = Array.from(
		{length: 16},
		() => Math.floor(Math.random() * 256).toString(16)
		.padStart(2, '0')
	).join('')

	// Combine timestamp and randomString to create a unique string
	const uniqueString = randomString + timestamp.toString(16)

	return uniqueString
}

let commitIds = 1,
	treeIds = 0,
	blobIds = 0

export const newCommitId = () => {
	return generateUniqueString()
	// commitIds++
	// console.log(commitIds)
	// console.log(sha1(Math.random(20)))
	// return '#' + sha1(commitIds)
}
export const newTreeId = () => treeIds++
export const newBlobId = () => blobIds++
