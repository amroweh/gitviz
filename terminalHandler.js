import {run} from './runFunction.js'

const terminalInputElement = document.querySelector('#terminalInput')
const terminalHistoryElement = document.querySelector('#terminalHistory')

const cmdHistory = []
const terminalHistory = []
let terminalInputText = null

terminalInputElement.addEventListener('input', e => {
	terminalInputText = e.target.value
})
terminalInputElement.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		addToTerminalHistory(terminalInputText)
		addToCommandHistory(terminalInputText)
		run(terminalInputText)
		clearTerminalInput()
		console.log(cmdHistory)
		console.log(terminalHistory)
	}
	if (e.key === 'ArrowUp') {
		console.log('Arrow Up') // FOR THIS CASE USE PREVIOUS COMMAND FROM COMMAND HISTORY
	}
})

const addToCommandHistory = cmd => {
	cmdHistory.push(cmd)
}
export const addToTerminalHistory = cmd => {
	terminalHistory.push(cmd)
	const commandElement = document.createElement('div')
	commandElement.innerHTML = cmd
	terminalHistoryElement.appendChild(commandElement)
}
const clearTerminalInput = () => (terminalInputElement.value = '')
export const clearTerminal = () => {
	terminalHistoryElement.innerHTML = null
}
