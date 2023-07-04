import { STORE, OVERLAY } from "@Constants"

export default {
	[STORE.ACTIONS.CONFIRM_SHOW](
		{ commit, dispatch },
		{ header, text, action = null, details = {} }
	) {
		commit(STORE.MUTATIONS.CONFIRM_SET_HEADER, { header })
		commit(STORE.MUTATIONS.CONFIRM_SET_TEXT, { text })
		commit(STORE.MUTATIONS.CONFIRM_SET_ACTION, { action })
		commit(STORE.MUTATIONS.CONFIRM_SET_DETAILS, { details })

		dispatch(
			STORE.ACTIONS.OVERLAY_SHOW,
			{ content: OVERLAY.CONTENT_TYPES.CONFIRM },
			{ root: true }
		)
	},
	[STORE.ACTIONS.CONFIRM_HIDE]({ dispatch }) {
		dispatch(STORE.ACTIONS.OVERLAY_HIDE)
	},
}
