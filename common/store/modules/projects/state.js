import { ORDER, STATUS } from "@Constants"
import moment from "moment"
moment.locale("fr")

const yardsticks = new Map([
	["status", ORDER.DESC],
	["date", ORDER.ASC],
])

export default () => ({
	date: moment(),
	list: [],
	filtered: [],
	filters: {
		status: [STATUS.WAITING, STATUS.PROGRESS, STATUS.RECIPE],
		date_range: {
			start: moment().subtract(3, "months"),
			end: moment().add(1, "year"),
		},
	},
	sorted: [],
	yardsticks,
	searched: [],
	search: "",
	selected: undefined,
	sideViews: {
		left: "",
		right: "",
		pending: "",
	},
})
