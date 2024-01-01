import { addBranch, gitState, removeBranchById } from "./gitstate.js";
import { updateGraph } from "./utils/graphFunctions.js";


updateGraph()
setTimeout(() => {
    addBranch()    
}, 3000);
setTimeout(() => {
	removeBranchById(1)
}, 5000)

