import { STORE } from "@Constants"
export default {
	[STORE.GETTERS.PROJECT_GET]: state => {
		return id => state.list.find(project => project.id === id)
	},
}
