import actions from "./actions"
import getters from "./getters"
import * as modules from "./modules"
import mutations from "./mutations"
import state from "./state"

export default {
	namespaced: false,
	state,
	getters,
	mutations,
	actions,
	modules,
}
