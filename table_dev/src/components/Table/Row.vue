<template>
	<tbody
		class="custom-table__project"
		:class="[{ focus }, { priority: project.priority }]"
		tabindex="0"
		title="Cliquez pour afficher/masquer les informations de ce projet"
		@click="focus = !focus"
	>
		<tr>
			<template v-for="{ key } in fields">
				<Cell v-if="key === 'actions'" :key="key" :id="key">
					<template #content>
						<div class="buttons-group">
							<button title="Supprimer" @click="handlerClick__delete">
								<Icon icon="delete" />
							</button>
							<button title="Modifier" @click="handlerClick__edit">
								<Icon icon="edit" />
							</button>
						</div>
					</template>
				</Cell>

				<Cell v-else-if="key === 'title'" scope="row" :key="key" :id="key">
					<template #content>
						<a
							v-if="project.clickup !== null"
							:href="project.clickup"
							target="_blank"
							title="Lien ClickUp"
						>
							<img src="@CommonAssets/img/clickup.png" height="30px" />
						</a>
						{{ project[key] }}
					</template>
				</Cell>

				<Cell v-else-if="key === 'fields'" :key="key" :id="'fields'">
					<template #content v-if="project.fields.length > 0">
						<ul>
							<li v-for="(field, i) in project.fields" :key="i">{{ field }}</li>
						</ul>
					</template>
				</Cell>

				<Cell v-else-if="key === 'service'" :key="key" :id="key">
					<template #content>
						{{ project.service }}
						<template
							v-if="project.applicant !== null && project.applicant.length > 0"
						>
							<br />{{ project.applicant }}
						</template>
					</template>
				</Cell>

				<Cell v-else-if="key === 'date'" :key="key" :id="key">
					<template
						#content
						v-if="
							project.status === STATUS.WAITING && project.date_start !== null
						"
					>
						{{ project.date_start._i }}
					</template>
					<template #content v-else-if="project.date_end !== null">
						{{ project.date_end._i }}
					</template>
				</Cell>

				<Cell
					v-else-if="['developers', 'users'].includes(key)"
					:key="key"
					:id="key"
				>
					<template #content v-if="project[key].length > 0">
						<ul>
							<li v-for="(data, i) in project[key]" :key="i">
								{{ data }}
							</li>
						</ul>
					</template>
				</Cell>

				<Cell v-else-if="key === 'progression'" :key="key" :id="'progression'">
					<template #content v-if="project.status !== STATUS.WAITING">
						{{ project.progression }} %
					</template>
				</Cell>

				<Cell
					v-else-if="key === 'status'"
					:key="key"
					:id="'status'"
					:class="[
						project.status
							.toLowerCase()
							.split(' ')
							.join('') + '-txt'
					]"
				>
					<template #content>
						{{ project.status }}
					</template>
				</Cell>

				<Cell v-else :key="key" :id="key">
					<template #content v-if="project[key] !== null">
						{{ project[key] }}
					</template>
				</Cell>
			</template>
		</tr>

		<tr class="custom-table__row custom-table__project__row__2" @click.stop>
			<Cell :id="'description'">
				<template #content>
					<h3>Description</h3>
					<p v-html="description">-</p>
				</template>
			</Cell>

			<Cell :colspan="admin ? '9' : '8'" :id="'history'">
				<template #content>
					<History :id="project.id" :history="project.history" />
				</template>
			</Cell>

			<Cell :id="'empty'" v-if="admin">
				<template #content> &nbsp; </template>
			</Cell>
		</tr>
	</tbody>
</template>

<script>
import { OVERLAY, STATUS, STORE } from "@Constants"
import { mapActions, mapState } from "@Modules/vuex"
import Cell from "./Cell.vue"


const History = () =>
	import(
		/* webpackChunkName = "project" */ "@CommonComponents/History/index.vue"
	)

export default {
	name: "Row",
	components: { Cell, History },
	props: {
		project: {
			type: Object,
			validator: ({
				id = null,
				title = null,
				service = null,
				status = null
			}) => {
				return (
					id !== null && title !== null && service !== null && status !== null
				)
			}
		},
		fields: {
			type: Array,
			required: true,
			validator: fields => {
				return fields.every(({ key = null }) => {
					return key !== null
				})
			}
		}
	},
	data() {
		const focus = false

		return { focus }
	},
	computed: {
		...mapState({
			admin: ({ admin }) => admin
		}),
		STATUS() {
			return STATUS
		},
		description() {
			if ((this.project?.description ?? null) === null) return "-"

			return this.project.description.replace(/\n/g, "<br>")
		},
		statusClass() {
			return this.project.status
				.toLowerCase()
				.split(" ")
				.join("")
		}
	},
	methods: {
		...mapActions({
			confirm: STORE.ACTIONS.CONFIRM_SHOW,
			edit: STORE.ACTIONS.OVERLAY_SHOW_PROJECT_FORM
		}),
		handlerClick__delete() {
			this.confirm({
				header: `Suppression du projet:<br>${this.project.title}`,
				text: "Êtes-vous sûr de vouloir le supprimer ?",
				action: OVERLAY.ACTIONS.REMOVE_PROJECTS
			})
		},
		handlerClick__edit() {
			const id = this.project.id
			this.edit({ id })
		}
	}
}
</script>

<style scoped>
.custom-table__project {
	cursor: pointer;
	filter: opacity(0.75);
}

.custom-table__project:is(:hover, .focus) {
	filter: opacity(1);
}
</style>
