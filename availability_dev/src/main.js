import Vue from "@Modules/vue"
import App from "@/App.vue"
import { useMoment } from "@Hooks"

import "@Modules/normalize.css"
import "@CommonComponents/apexcharts.js"

Vue.prototype.$moment = useMoment()

Vue.config.productionTip = false

new Vue({
	render: h => h(App)
}).$mount("#availability")
