const menuButtons = document.querySelectorAll('.menu_button')

const toggleMenu = menu => {
	if (getComputedStyle(menu).right === '0px') {
		const menuWidth = getComputedStyle(menu).width
		menu.style.right = `-${menuWidth}`
	} else menu.style.right = 0
}

// const toggleMenu = menu => {
// 	if (menu.classList.contains('open')) menu.classList.remove('open')
// 	else menu.classList.add('open')
// }

menuButtons.forEach(button => (button.onclick = () => toggleMenu(button.parentElement)))
