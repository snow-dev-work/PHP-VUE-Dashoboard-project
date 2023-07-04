<template>
	<component
		:is="component"
		class="custom-table__cell"
		:class="[customClass, orderClass]"
		:colspan="colspan"
		:rowspan="rowspan"
		@click="handlerClick"
	>
		<div class="custom-table__cell__content">
			<slot name="content">-</slot>
		</div>
	</component>
</template>

<script>
import { mapState, mapActions } from "@Modules/vuex"
import { STORE, ORDER } from "@Constants"

export default {
	name: "Cell",
	props: {
		id: {
			type: String,
			default: () => ""
		},
		scope: {
			type: String,
			default: () => ""
		},
		isHeader: {
			type: Boolean,
			default: () => false
		},
		rowspan: {
			type: String,
			default: () => "1",
			validator: rowspan => /^\d+$/.test(rowspan)
		},
		colspan: {
			type: String,
			default: () => "1",
			validator: colspan => /^\d+$/.test(colspan)
		},
		isSortable: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		const orderClass = ""

		return { orderClass }
	},
	computed: {
		...mapState({
			yardsticks: ({ projects }) => projects.yardsticks
		}),
		component() {
			if (this.isHeader) return "th"
			return "td"
		},
		customClass() {
			return `${this.id}${this.isHeader ? " custom-table__cell__header" : ""}`
		}
	},
	methods: {
		...mapActions({
			sort: STORE.ACTIONS.PROJECTS_SORT
		}),
		handlerClick() {
			if (this.isSortable) {
				this.orderClass = ""
				switch (this.yardsticks.get(this.id)) {
					case ORDER.ASC:
						this.orderClass = `order-${ORDER.DESC}`
						this.yardsticks.set(this.id, ORDER.DESC)
						break
					case ORDER.DESC:
						this.yardsticks.delete(this.id)
						break
					default:
						this.orderClass = `order-${ORDER.ASC}`
						this.yardsticks.set(this.id, ORDER.ASC)
				}
				this.sort()
			}
		}
	},
	mounted() {
		if (this.yardsticks.has(this.id)) {
			this.orderClass = `order-${this.yardsticks.get(this.id)}`
		}
	}
}
</script>

<style scoped>
.custom-table__cell {
	background-color: var(--bg-color);
	position: relative;
}

.custom-table__cell__header {
	position: sticky;
	top: 0;
	z-index: 101;
	width: max-content;
}

.custom-table__cell__header::before {
	content: "";
	display: block;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 2px;
	background-color: hsla(0, 0%, 0%, 0.05);
}

.custom-table__cell:is(.description, .history) {
	vertical-align: top;
}

.custom-table__cell__content {
	padding: 0.8em 1.5em;
	display: flex;
}

.custom-table__cell__header .custom-table__cell__content {
	align-items: center;
	justify-content: center;
	gap: 1em;
}

.custom-table__cell:is(.description, .history, .empty):not(.custom-table__cell__header)
	.custom-table__cell__content {
	flex-direction: column;
	gap: 2em;
}

.custom-table__cell__header.actions {
	width: 7.5vw !important;
	position: sticky;
	right: 0;
	z-index: 101;
}

.custom-table__cell:is(.actions, .empty):not(.custom-table__cell__header) {
	position: sticky;
	right: 0;
	z-index: 100;
	vertical-align: middle;
}
.custom-table__cell.actions button {
	border: none;
}

.custom-table__cell__header.title {
	width: 25vw !important;
	position: sticky;
	left: 0;
	z-index: 102;
}

.custom-table__cell.title:not(.custom-table__cell__header) {
	position: sticky;
	left: 0;
	z-index: 100;
	font-weight: bold;
	font-size: 1.05em;
	overflow: hidden;
	vertical-align: middle;
}

.custom-table__cell.title:not(.custom-table__cell__header)
	.custom-table__cell__content {
	gap: 0.5em;
	align-items: center;
}
.custom-table__cell:is(.title, .actions, .description, .empty)::after {
	content: "";
	background-color: hsla(0, 0%, 0%, 0.05);
	display: block;
	position: absolute;
	bottom: 0;
	right: 0;
	top: 0;
	width: 2px;
	z-index: 103;
}

.custom-table__cell:is(.actions, .empty)::after {
	right: 100%;
}

.custom-table__cell.status {
	font-weight: bold;
}

.custom-table__cell:is(.developers, .users, .fields) ul {
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

.custom-table__cell.date {
	text-align: center;
}

.custom-table__cell.progression {
	text-align: end;
}

.custom-table__cell.description {
	padding: 0;
	position: sticky;
	left: 0;
	z-index: 100;
}

.custom-table__cell.history {
	position: sticky;
	left: 25vw;
}

.custom-table__cell.actions .custom-table__cell:is(.description, .history) {
	vertical-align: top;
}

.custom-table__cell:is(.description, .history, .empty)::before {
	content: "";
	background-color: hsla(0, 0%, 0%, 0.05);
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 1px;
	z-index: 101;
}

.sorting-btn {
	position: relative;
	display: inline-flex;
	flex-direction: column;
}

.sorting-btn::before,
.sorting-btn::after {
	opacity: 0.5;
	color: var(--txt-color);
}
.sorting-btn::before {
	content: "▲";
}
.sorting-btn::after {
	content: "▼";
}

.custom-table__cell.order-ASC .sorting-btn::before {
	color: var(--color-primary);
	opacity: 1;
}

.custom-table__cell.order-DESC .sorting-btn::after {
	color: var(--color-primary);
	opacity: 1;
}
</style>
