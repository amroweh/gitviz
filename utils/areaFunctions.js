import {findBlobById, gitState} from '../gitstate.js'

export const working_area_files = [
	{filename: 'file1', content: 'Hello from file 1'},
	{filename: 'file2', content: 'Hello from file 2'}
]

export const updateWorkingArea = workingAreaFilesElement => {
	workingAreaFilesElement.innerHTML = ''
	working_area_files.forEach(file => {
		workingAreaFilesElement.innerHTML += `<li><b>${file.filename}</b><br>Content: ${file.content}</li>`
	})
}

export const updateStagingArea = stagingAreaFilesElement => {
	stagingAreaFilesElement.innerHTML = ''
	gitState.Index.forEach(file => {
		const blob = findBlobById(file.blobRef)
		if (blob) stagingAreaFilesElement.innerHTML += `<li><b>${file.objectName}</b><br>Content: ${blob.content}</li>`
	})
}

export const updateAreas = (
	workingAreaFilesElement = document.querySelector('#working_area_files'),
	stagingAreaFilesElement = document.querySelector('#staging_area_files')
) => {
	updateWorkingArea(workingAreaFilesElement)
	updateStagingArea(stagingAreaFilesElement)
}
