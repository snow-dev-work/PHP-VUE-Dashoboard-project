import { STORE } from "@Constants"

export default {
	[STORE.MUTATIONS.SET_EVENT_SOURCE](state, { eventSource }) {
		state.eventSource = eventSource
	},
	[STORE.MUTATIONS.CLOSE_EVENT_SOURCE](state) {
		state.eventSource?.close?.()
	},
	[STORE.MUTATIONS.SET_SENDER](state, { sender }) {
		state.sender = sender
	},
	[STORE.MUTATIONS.SET_USER_TOKEN](state, { token }) {
		state.token = token
	},
	[STORE.MUTATIONS.SET_USER](state, { user }) {
		state.user = user
		document.title = `Suivi de projets - ${user}`
	},
	[STORE.MUTATIONS.SET_ADMIN](state, { admin }) {
		state.admin = admin
	},
	[STORE.MUTATIONS.SET_IS_MOBILE](state, { isMobile }) {
		state.isMobile = isMobile
	},
	[STORE.MUTATIONS.SET_IS_SCROLL](state, { isScroll }) {
		state.isScroll = isScroll
	},
}
