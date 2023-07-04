<template>
	<table class="custom-table">
		<TableHeader :fields="_fields" />
		<Row
			v-for="project in projects"
			:key="project.id"
			:fields="_fields"
			:project="project"
		/>
	</table>
</template>

<script>
import { mapState } from "@Modules/vuex"
import TableHeader from "./Header.vue"
import Row from "./Row.vue"

export default {
	name: "CustomTable",
	components: {
		TableHeader,
		Row
	},
	props: {
		fields: {
			type: Array,
			validator: fields => {
				return fields.every(({ key = null }) => key !== null)
			}
		}
	},
	computed: {
		...mapState({
			projects: ({ projects }) => projects.searched,
			admin: ({ admin }) => admin
		}),
		_fields() {
			return this.fields.map(({ key, label = null, sortable = false }) => {
				if (label === null) {
					return { key, label: key }
				}

				return { key, label, sortable }
			})
		}
	}
}
</script>

<style scoped>
.custom-table {
	height: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	border: none;
	width: max-content;
	min-width: 100%;
}
</style>
