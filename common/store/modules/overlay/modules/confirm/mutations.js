import { STORE } from "@Constants"

export default {
	[STORE.MUTATIONS.CONFIRM_SET_HEADER](state, { header }) {
		state.header = header
	},
	[STORE.MUTATIONS.CONFIRM_SET_TEXT](state, { text }) {
		state.text = text
	},
	[STORE.MUTATIONS.CONFIRM_SET_ACTION](state, { action }) {
		state.action = action
	},
	[STORE.MUTATIONS.CONFIRM_SET_DETAILS](state, { details }) {
		state.details = details
	},
}
