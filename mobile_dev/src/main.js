import Vue from "@Modules/vue"
import store from "@Store"
import { useMoment } from "@Hooks"

import "@CommonComponents/lazy.js"
import "@Modules/normalize.css"
import "@Assets/css/index.css"

/** Configuration */
Vue.config.productionTip = false

/** Variables globales */
Vue.prototype.$moment = useMoment()

/** Directives (v-) */
Vue.directive("focus", function(el, { value }) {
	if (value) el.focus()
	else el.blur()
})

const App = () => import(/** webpackChunkName = "app" */ "@/App.vue")

/** Instance */
new Vue({
	store,
	render: h => h(App)
}).$mount("#dashboard")
