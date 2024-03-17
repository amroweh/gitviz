// Help Section
const helpToggle = document.querySelector('#help_btn')
const helpBox = document.querySelector('#help_box')
const helpBoxExitButton = document.querySelector('#help_box_exit_btn')

helpToggle.addEventListener('click', () => {
	helpBox.style.display = getComputedStyle(helpBox).display === 'none' ? 'block' : 'none'
})

helpBoxExitButton.addEventListener('click', () => {
	helpBox.style.display = 'none'
})

// Info Section
const infoArea = document.querySelector('#info_area')
const infoAreaExitBtn = document.querySelector('#info_area_exit_btn')

infoAreaExitBtn.addEventListener('click', () => {
	infoArea.style.opacity = 0
})
