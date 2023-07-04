<template>
	<thead class="custom-table__header">
		<tr>
			<template v-for="{ key, label, sortable } in fields">
				<Cell
					:key="key"
					:id="key"
					scope="col"
					:is-header="true"
					:is-sortable="sortable"
				>
					<template #content>
						<label>{{ label }}</label>
						<span v-if="sortable" class="sorting-btn"></span>
					</template>
				</Cell>
			</template>
		</tr>
	</thead>
</template>

<script>
import Cell from "./Cell.vue"

export default {
	name: "TableHeader",
	components: { Cell },
	props: {
		fields: {
			type: Array,
			required: true,
			validator: fields => {
				return fields.every(
					({ key = null, label = null }) => !(key === null || label === null)
				)
			}
		}
	}
}
</script>

<style></style>
