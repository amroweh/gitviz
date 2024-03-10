const helpToggle = document.querySelector('#help_btn')
const helpBox = document.querySelector('#help_box')
const helpBoxExitButton = document.querySelector('#help_box_exit_btn')

helpToggle.addEventListener('click', () => {
	helpBox.style.display = getComputedStyle(helpBox).display === 'none' ? 'block' : 'none'
})

helpBoxExitButton.addEventListener('click', () => {
	helpBox.style.display = 'none'
})
