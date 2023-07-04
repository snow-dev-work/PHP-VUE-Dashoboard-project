import Vue from "@Modules/vue"
import Vuex, { Store } from "@Modules/vuex"
import actions from "./actions"
import * as modules from "./modules"
import mutations from "./mutations"
import state from "./state"

Vue.use(Vuex)

export default new Store({
	state,
	mutations,
	actions,
	modules,
})
