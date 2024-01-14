const menuButtons = document.querySelectorAll('.menu_button')

const toggleMenu = menu => {
	const menuContent = getComputedStyle(menu.querySelector('.menu_content'))
	if (menuContent.display === 'flex') {
		menu.querySelector('.menu_content').style.width = 0
	} else {
		menu.querySelector('.menu_content').style.width = '100%'
	}
}

menuButtons.forEach(button => {
	button.onclick = () => toggleMenu(button.parentElement)
})
