/* eslint-disable */
import Vue from "@Modules/vue"

/** Composants Globaux */
Vue.component("Icon", () =>
	import(/* webpackChunkName: "icons" */ "./icon/index.vue")
)
Vue.component("CustomInput", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomInput.vue")
)
Vue.component("CustomCheckbox", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomCheckbox.vue")
)
Vue.component("CustomTextarea", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomTextarea.vue")
)
Vue.component("CustomSelect", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomSelect.vue")
)
Vue.component("CustomSelectMultiple", () =>
	import(
		/* webpackChunkName: "custom-form" */ "./Base/CustomSelectMultiple.vue"
	)
)
Vue.component("CustomSelectInput", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomSelectInput.vue")
)
Vue.component("CustomRange", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomRange.vue")
)
Vue.component("CustomInputMultiple", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomInputMultiple.vue")
)
Vue.component("CustomDatePicker", () =>
	import(/* webpackChunkName: "custom-form" */ "./Base/CustomDatePicker.vue")
)
