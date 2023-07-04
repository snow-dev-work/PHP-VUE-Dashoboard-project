import { STORE } from "@Constants"

export default {
	[STORE.MUTATIONS.OVERLAY_SET_VISIBLE](state, { visible }) {
		state.visible = visible
	},
	[STORE.MUTATIONS.OVERLAY_SET_CONTENT](state, { content }) {
		state.content = content
	},
}
