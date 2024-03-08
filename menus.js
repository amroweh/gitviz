const menuButtons = document.querySelectorAll('.menu_button')

const toggleMenu = menu => {
	if (getComputedStyle(menu).right === '0px') {
		const menuWidth = getComputedStyle(menu).width
		menu.style.right = `-${menuWidth}`
	} else menu.style.right = 0
}

menuButtons.forEach(button => (button.onclick = () => toggleMenu(button.parentElement)))
