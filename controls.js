import {findBranchByName, findCommitById} from './gitstate.js'

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
	console.log(d)
	if (d.type === 'branch') {
		title.textContent = 'Branch: ' + d.name
		subtitle1.textContent = 'Branches'
		p1.textContent =
			'Simply put, a branch is just a pointer to a commit (or a snapshot of your files). New branches are typically created to diverge from the main branch, make some changes, and then merge back into the main branch. This allows you to make changes without messing with the main line of work.'
		subtitle2.textContent = null
		p2.textContent = 'This branch points to the following commit: \n' + findBranchByName(d.name).pointsTo
	} else if (d.type === 'commit') {
		const commit = findCommitById(d.id)
		title.textContent = 'Commit: ' + d.name
		subtitle1.textContent = 'Commits'
		p1.textContent =
			'A commit is a snapshot of your files. This means that each commit has the state of your files at a specific point in time. This allows you to jump between different states when needed. Commits are probably the most important component of any git repository.'
		subtitle2.textContent = 'Commit Message'
		p2.innerHTML =
			'The commit message for this commit is: ' +
			commit.message +
			'<br><br>The sha value for this commit is: ' +
			commit.id
	}
}
