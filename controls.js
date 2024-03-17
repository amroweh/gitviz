import {findBranchByName, findCommitById, getNodeTypeById, gitState} from './gitstate.js'

// Help Section
const helpToggle = document.querySelector('#help_btn')
const helpBox = document.querySelector('#help_box')
const helpBoxExitButton = document.querySelector('#help_box_exit_btn')

helpToggle.addEventListener('click', () => {
	helpBox.style.display = getComputedStyle(helpBox).display === 'none' ? 'block' : 'none'
})
helpBoxExitButton.addEventListener('click', () => (helpBox.style.display = 'none'))

// Info Section
const infoArea = document.querySelector('#info_area')
const infoAreaExitBtn = document.querySelector('#info_area_exit_btn')

infoAreaExitBtn.addEventListener('click', () => (infoArea.style.opacity = 0))

export const showInfoPane = () => (infoArea.style.opacity = 1)
export const updateInfoPane = d => {
	const title = infoArea.querySelector('#info_title')
	const subtitle1 = infoArea.querySelector('#info_subtitle_1')
	const p1 = infoArea.querySelector('#info_p_1')
	const subtitle2 = infoArea.querySelector('#info_subtitle_2')
	const p2 = infoArea.querySelector('#info_p_2')
	if (d.type === 'branch') {
		title.innerHTML = 'Branch: ' + d.name
		subtitle1.innerHTML = 'Branches'
		p1.innerHTML =
			'Simply put, a branch is just a pointer to a commit (or a snapshot of your files). New branches are typically created to diverge from the main branch, make some changes, and then merge back into the main branch. This allows you to make changes without messing with the main line of work.'
		subtitle2.innerHTML = null
		p2.innerHTML = 'This branch points to the following commit: \n' + findBranchByName(d.name).pointsTo
	} else if (d.type === 'commit') {
		const commit = findCommitById(d.id)
		title.innerHTML = 'Commit: ' + d.name
		subtitle1.innerHTML = 'Commits'
		p1.innerHTML =
			'A commit is a snapshot of your files. This means that each commit has the state of your files at a specific point in time. This allows you to jump between different states when needed. Commits are probably the most important component of any git repository.'
		subtitle2.innerHTML = 'Commit Message'
		p2.innerHTML =
			'The commit message for this commit is: ' +
			commit.message +
			'<br><br>The sha value for this commit is: ' +
			commit.id
	} else if (d.type === 'head') {
		const type = getNodeTypeById(gitState.HEAD)
		const headPointsTo = type === 'branch' ? findBranchByName(gitState.HEAD) : findCommitById(gitState.HEAD)
		const label = type === 'branch' ? headPointsTo.name : headPointsTo.id
		title.innerHTML = 'Head'
		subtitle1.innerHTML = 'Head'
		p1.innerHTML =
			'Git Head usually refers to the branch or commit you are currently on. It is called a symbolic reference, which means that it points to another reference, usually a branch. However, it may also point to a git object such as a commit.'
		subtitle2.innerHTML = null
		p2.innerHTML = 'Git head currently points to a ' + type + ', specifically: ' + label
	}
}
