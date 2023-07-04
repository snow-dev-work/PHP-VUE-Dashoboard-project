import actions from "./actions.js"
import getters from "./getters.js"
import * as modules from "./modules"
import mutations from "./mutations.js"
import state from "./state.js"

export default {
	namespaced: false,
	state,
	getters,
	mutations,
	actions,
	modules,
}
