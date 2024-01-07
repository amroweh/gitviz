import {addBranch, removeBranchById} from './gitstate.js'
import {updateGraph} from './utils/graphFunctions.js'

updateGraph()
setTimeout(() => {
	addBranch()
}, 3000)
