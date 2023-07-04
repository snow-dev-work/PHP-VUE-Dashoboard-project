<template>
	<form @submit.prevent @reset.prevent="reset" class="custom-form filters-form">
		<header class="custom-form__header large">
			<h2>Filtres</h2>
			<button @click="cancel" class="custom-form__exit">
				<Icon icon="times" />
			</button>
		</header>

		<section id="filters-form__status" class="filters-form__section">
			<h4>Statut</h4>
			<div class="filters-form__options" :tabindex="1">
				<input
					hidden
					class="filters-form__status__input"
					name="status"
					type="radio"
					id="status-all"
					v-model="status"
					:value="Object.values(STATUS)"
				/>
				<label for="status-all" class="filters-form__status__label">Tous</label>

				<template v-for="(option, i) in options_status">
					<input
						hidden
						class="filters-form__status__input"
						name="status"
						type="checkbox"
						:id="`status-${i}`"
						:value="option.value"
						v-model="status"
						:key="`status-${i}`"
					/>
					<label
						:for="`status-${i}`"
						class="filters-form__status__label"
						:class="{ [option.class]: status.includes(option.value) }"
						:key="i"
					>
						{{ option.label }}
					</label>
				</template>
			</div>
		</section>

		<section
			id="filters-form__date-range"
			class="filters-form__section filters-form__section-large"
		>
			<span>Date de livraison du</span>
			<CustomDatePicker name="date_start" label="" v-model="date_start" />
			<span>au</span>
			<CustomDatePicker name="date_end" label="" v-model="date_end" />
		</section>

		<section
			v-if="admin"
			id="filters-form__service"
			class="filters-form__section filters-form__section-large"
		>
			<h4>Service(s) demandeur(s)</h4>
			<CustomSelectMultiple
				name="services"
				:options="options_users"
				v-model="services"
				style="text-transform: uppercase"
			/>
		</section>

		<section class="filters-form__section">
			<h4>Réferent Informatique</h4>
			<CustomSelect
				name="referent_info"
				:options="options_referent_info"
				v-model="referent_info"
				:disabled="options_referent_info.length === 0"
			/>
		</section>

		<section class="filters-form__section">
			<h4>Référent Métier</h4>
			<CustomSelect
				name="referen_business"
				:options="options_referent_business"
				v-model="referent_business"
				:disabled="options_referent_business.length === 0"
			/>
		</section>

		<section class="filters-form__section">
			<h4>Développeur</h4>
			<CustomSelect
				name="developer"
				:options="options_developers"
				v-model="developer"
				:disabled="options_developers.length === 0"
			/>
		</section>

		<section class="filters-form__section" v-if="!user.includes('_ADMIN')">
			<h4>Domaine</h4>
			<CustomSelect name="field" :options="options_fields" v-model="field" />
		</section>

		<button class="filters-form__reset" type="reset">
			Effacer les filtres
		</button>
	</form>
</template>

<script>
import { mapActions, mapMutations, mapState } from "@Modules/vuex"
import { STATUS, STORE, USERS, FIELDS } from "@Constants"

import { useMoment } from "@Hooks"

const moment = useMoment()

export default {
	name: "FiltersForm",
	data() {
		return {}
	},
	computed: {
		...mapState({
			projects: ({ projects }) => projects.list,
			admin: ({ admin }) => admin,
			filters: ({ projects }) => projects.filters,
		}),
		options_status() {
			const options = Object.values(STATUS).map(status => ({
				value: status,
				label: status,
				class: status.toLocaleLowerCase().replace(/ /g, "") + "-bg",
			}))
			return options
		},
		options_users() {
			return Object.values(USERS)
				.filter(u => u !== USERS.SUPERADMIN)
				.sort((a, b) => a.localeCompare(b))
		},
		options_referent_info() {
			return [
				...new Set(
					this.projects
						.map(project => project.referent_info)
						.filter(referent => referent !== null)
						.sort((a, b) => a.localeCompare(b))
				),
			]
		},
		options_referent_business() {
			return [
				...new Set(
					this.projects
						.map(project => project.referent_business)
						.filter(referent => referent !== null)
						.sort((a, b) => a.localeCompare(b))
				),
			]
		},
		options_developers() {
			return [
				...new Set(
					this.projects
						.flatMap(project => project.developers)
						.sort((a, b) => {
							if (a.toLocaleLowerCase() === "tous") return -1
							if (b.toLocaleLowerCase() === "tous") return 1

							return a.localeCompare(b)
						})
				),
			]
		},
		options_fields() {
			return Object.values(FIELDS).sort((a, b) => a.localeCompare(b))
		},
		STATUS() {
			return STATUS
		},
		status: {
			get() {
				return (
					this.filters?.status ?? [
						STATUS.WAITING,
						STATUS.PROGRESS,
						STATUS.RECIPE,
					]
				)
			},
			set(status) {
				const filters = {
					...this.filters,
					status,
				}
				this.filter({ filters })
			},
		},
		user: {
			get() {
				return this.filters?.users ?? ""
			},
			set(user) {
				const filters = {
					...this.filters,
					user,
				}
				this.filter({ filters })
			},
		},
		services: {
			get() {
				return this.filters?.service ?? []
			},
			set(service) {
				const filters = {
					...this.filters,
					service,
				}
				this.filter({ filters })
			},
		},
		referent_info: {
			get() {
				return this.filters?.referent_info ?? ""
			},
			set(referent_info) {
				const filters = {
					...this.filters,
					referent_info,
				}
				this.filter({ filters })
			},
		},
		referent_business: {
			get() {
				return this.filters?.referent_business ?? ""
			},
			set(referent_business) {
				const filters = {
					...this.filters,
					referent_business,
				}
				this.filter({ filters })
			},
		},
		developer: {
			get() {
				return this.filters?.developers ?? ""
			},
			set(developers) {
				const filters = {
					...this.filters,
					developers,
				}
				this.filter({ filters })
			},
		},
		field: {
			get() {
				return this.filters?.fields ?? ""
			},
			set(fields) {
				const filters = {
					...this.filters,
					fields,
				}
				this.filter({ filters })
			},
		},
		date_start: {
			get() {
				return this.filters.date_range.start
			},
			set(start) {
				const filters = {
					...this.filters,
					date_range: {
						...this.filters.date_range,
						start,
					},
				}

				this.filter({ filters })
			},
		},
		date_end: {
			get() {
				return this.filters.date_range.end
			},
			set(end) {
				const filters = {
					...this.filters,
					date_range: {
						...this.filters.date_range,
						end,
					},
				}

				this.filter({ filters })
			},
		},
	},
	methods: {
		...mapActions({
			hide: STORE.ACTIONS.OVERLAY_HIDE,
			filter: STORE.ACTIONS.PROJECTS_FILTER,
		}),
		...mapMutations({
			set: STORE.MUTATIONS.PROJECTS_SET_FILTERS,
		}),
		cancel() {
			this.hide()
		},
		reset() {
			this.status = [STATUS.WAITING, STATUS.PROGRESS, STATUS.RECIPE]
			this.date_start = moment().startOf("year")
			this.date_end = moment().endOf("year")
		},
	},
}
</script>

<style src="@CommonAssets/css/custom-form.css"></style>
<style scoped>
.filters-form {
	overflow-x: visible;
}

.filters-form button {
	padding: 0;
	border: none;
}

#filters-form__status {
	grid-column: 1 / -1;
	display: flex;
	align-items: center;
}

.filters-form__options {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1em;
	flex-wrap: wrap;
}

.filters-form__status__label {
	text-transform: uppercase;
	font-size: 0.75em;
	font-weight: 500;
	padding: 0.4em 1em;
	background-color: var(--txt-color-light);
	border-radius: 1em;
	color: #fff;
}

.filters-form__status__input:checked + .filters-form__status__label::after {
	content: "\002713";
	display: inline-block;
	margin-left: 0.5em;
}

#status-all:checked + .filters-form__status__label {
	background-color: var(--txt-color-dark);
}

.filters-form__section-large {
	grid-column: 1 / -1;
}

.sorting-form__close {
	color: var(--color-primary);
}

.filters-form__reset {
	--contrasting-color: transparent !important;
	color: var(--color-danger) !important;
	margin-top: auto;
	place-self: end;

	grid-column: 2;
}

.filters-form .custom-select__display,
.filters-form .custom-select-multiple__display {
	background-color: hsla(0, 0%, 0%, 0.05);
	border-radius: 0.75em;
}

#filters-form__date-range > h4 {
	grid-column: 1 / -1;
	align-self: end;
}
#filters-form__date-range {
	display: grid;
	grid-template-columns: auto 1fr auto 1fr;
	align-items: center;
	column-gap: 1rem;
}

@media screen and (max-width: 650px) {
	#filters-form__status {
		flex-direction: column;
		align-items: stretch;
		gap: 0.5em;
	}

	.filters-form__reset {
		grid-column: 1 / -1;
	}
}
</style>
