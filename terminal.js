import {diffWorkingStaging, gitState} from './gitstate.js'
import {run} from './commands.js'

const terminalHistorySection = document.querySelector('#terminal_history_section')
const terminalInputElement = document.querySelector('#terminal_input')
const terminalHistoryElement = document.querySelector('#terminal_history')
const terminalPromptElement = document.querySelector('#terminal_prompt')

const cmdHistory = [],
	terminalHistory = []
let cmdIndex = -1,
	terminalInputText = null

terminalInputElement.addEventListener('input', e => {
	terminalInputText = e.target.value
})
terminalInputElement.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		addToTerminalHistory(terminalInputText)
		addToCommandHistory(terminalInputText)
		run(terminalInputText)
		clearTerminalInput()
		resetCmdIndex()
		scrollTerminalSectionHistoryBottom()
	}
	if (e.key === 'ArrowUp') {
		e.preventDefault()
		cmdIndex > -1 && (terminalInputElement.value = cmdHistory[cmdIndex])
		cmdIndex--
	}
})
function scrollTerminalSectionHistoryBottom() {
	terminalHistorySection.scrollTop = terminalHistorySection.scrollHeight
}
const addToCommandHistory = cmd => {
	cmdHistory.push(cmd)
}
function resetCmdIndex() {
	cmdIndex = cmdHistory.length - 1
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
	if (!gitState.initialized) terminalPromptElement.innerHTML = `gitsim&nbsp;%&nbsp;`
	else {
		const diffCircleDisplay = diffWorkingStaging() ? 'inline' : 'none'
		terminalPromptElement.innerHTML = `gitsim&nbsp;<span style='color: #4AF626;'>[${gitState.HEAD.slice(
			0,
			6
		)}<span style='color: red; display: ${diffCircleDisplay};'>&#x25CF;</span>]</span>&nbsp;%&nbsp;`
	}
}, 500)
