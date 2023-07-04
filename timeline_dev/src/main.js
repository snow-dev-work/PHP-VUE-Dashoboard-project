import Vue from "@Modules/vue"
import App from "@/App.vue"
import store from "@Store"
import "@CommonComponents/lazy"
import "@CommonComponents/apexcharts.js"

import { useMoment } from "@Hooks"
Vue.prototype.$moment = useMoment()

Vue.config.productionTip = false

/** Directives (v-) */
Vue.directive("focus", function(el, { value }) {
	if (value) el.focus()
	else el.blur()
})

new Vue({
	store,
	render: h => h(App)
}).$mount("#timeline")
