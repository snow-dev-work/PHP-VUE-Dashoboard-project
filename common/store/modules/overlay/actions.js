import { STORE, OVERLAY } from "@Constants"

let top = 0
var handlerScroll = function () {
	window.scroll({ top })
}

export default {
	[STORE.ACTIONS.OVERLAY_SHOW]({ commit }, { content }) {
		if (!Object.values(OVERLAY.CONTENT_TYPES).includes(content)) return

		commit(STORE.MUTATIONS.OVERLAY_SET_CONTENT, { content })
		commit(STORE.MUTATIONS.OVERLAY_SET_VISIBLE, { visible: true })

		top = window.screenY
		window.addEventListener("scroll", handlerScroll, { passive: true })
	},
	[STORE.ACTIONS.OVERLAY_HIDE]({ commit }) {
		commit(STORE.MUTATIONS.OVERLAY_SET_VISIBLE, { visible: false })
		commit(STORE.MUTATIONS.PROJECTS_UNSELECT, null, { root: true })

		window.removeEventListener("scroll", handlerScroll, { passive: true })
	},
	[STORE.ACTIONS.OVERLAY_SHOW_PROJECT_FORM](
		{ commit, dispatch },
		{ id = null } = {}
	) {
		if (id !== null)
			commit(STORE.MUTATIONS.PROJECTS_SELECT, { id }, { root: true })

		const content = OVERLAY.CONTENT_TYPES.PROJECT_FORM
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_SHOW_FILE_FORM]({ commit, dispatch }, { id }) {
		commit(STORE.MUTATIONS.PROJECTS_SELECT, { id }, { root: true })
		const content = OVERLAY.CONTENT_TYPES.FILE_FORM
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_SHOW_SORTING_FORM]({ dispatch }) {
		const content = OVERLAY.CONTENT_TYPES.SORTING_FORM
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_SHOW_FILTERS_FORM]({ dispatch }) {
		const content = OVERLAY.CONTENT_TYPES.FILTERS_FORM
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_SHOW_SIDE_VIEW_SELECTOR](
		{ commit, dispatch },
		{ id }
	) {
		const content = OVERLAY.CONTENT_TYPES.SIDE_VIEW_SELECTOR
		commit(STORE.MUTATIONS.PROJECTS_SET_PENDING, { id })
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_LOAD]({ dispatch }) {
		const content = OVERLAY.CONTENT_TYPES.LOADER
		dispatch(STORE.ACTIONS.OVERLAY_SHOW, { content })
	},
	[STORE.ACTIONS.OVERLAY_UNLOAD]({ dispatch }) {
		dispatch(STORE.ACTIONS.OVERLAY_HIDE)
	},
}
