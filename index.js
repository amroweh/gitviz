import {addBranch, findBranch, removeBranchById} from './gitstate.js'
import {updateGraph} from './utils/graphFunctions.js'

updateGraph()
setTimeout(() => {
	addBranch()
    // console.log(findBranch('branch'))
}, 3000)
// setTimeout(() => {
// 	removeBranchById(1)
// }, 5000)
