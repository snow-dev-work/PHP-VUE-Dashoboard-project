import { STORE, OVERLAY } from "@Constants"

export default {
	[STORE.GETTERS.OVERLAY_COMPONENT]({ content }) {
		switch (content) {
			case OVERLAY.CONTENT_TYPES.PROJECT_FORM:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/ProjectForm.vue"
					)
			case OVERLAY.CONTENT_TYPES.FILE_FORM:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/FileForm.vue"
					)
			case OVERLAY.CONTENT_TYPES.FILTERS_FORM:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/FiltersForm.vue"
					)
			case OVERLAY.CONTENT_TYPES.SORTING_FORM:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/SortingForm.vue"
					)
			case OVERLAY.CONTENT_TYPES.CONFIRM:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/Confirm.vue"
					)
			case OVERLAY.CONTENT_TYPES.LOADER:
				return () =>
					import(
						/* webpackChunkName: "overlay-components" */ "@CommonComponents/Overlay/Loader.vue"
					)
			case OVERLAY.CONTENT_TYPES.SIDE_VIEW_SELECTOR:
				return () =>
					import(
						/* webpackChunkName: "side-views" */ "@CommonComponents/Overlay/SideViewSelector.vue"
					)
			default:
				return null
		}
	},
}
