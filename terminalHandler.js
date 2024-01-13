import {gitState} from './gitstate.js'
import {run} from './runFunction.js'

const terminalInputElement = document.querySelector('#terminal_input')
const terminalHistoryElement = document.querySelector('#terminal_history')
const terminalPromptElement = document.querySelector('#terminal_prompt')

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

setInterval(() => {
	terminalPromptElement.innerHTML = `gitsim&nbsp;<span style='color: #4AF626;'>[${gitState.HEAD}]</span>&nbsp;%&nbsp;`
}, 500)
