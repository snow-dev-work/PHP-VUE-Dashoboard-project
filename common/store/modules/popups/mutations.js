import { counter } from "@Utils"
import { POPUP_VARIANTS, STORE } from "@Constants"

const COUNTER = counter()

export default {
	[STORE.MUTATIONS.POPUPS_ADD](
		state,
		{ message, variant = POPUP_VARIANTS.INFO, action = null }
	) {
		state.list.push({
			id: COUNTER.next().value,
			message,
			variant,
			action,
		})
	},
	[STORE.MUTATIONS.POPUPS_REMOVE](state, { id }) {
		state.list = state.list.filter(popup => popup.id !== id)
	},
}
