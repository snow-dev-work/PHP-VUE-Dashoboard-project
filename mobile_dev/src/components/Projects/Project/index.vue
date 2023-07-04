<template>
	<article class="project" :id="`project-${id}`">
		<Actions
			:id="id"
			@opened-menu="$emit('opened-menu')"
			:closed-menu="closedMenu"
			v-if="admin"
		/>

		<div class="project-fields" v-if="fields.length > 0">
			<span v-for="(field, i) in _fields" :key="i" class="project-field">
				{{ field }}
			</span>
		</div>

		<div class="project-priority" v-if="priority">
			<img class="project-priority__img" src="@CommonAssets/img/priority.svg" />
			<span class="project-priority__txt">Prioritaire</span>
		</div>

		<header class="project-header">
			<div class="project-header__title">
				<h2>
					{{ title }}
					<a
						v-if="this.link"
						:href="this.link"
						:title="this.link"
						style="display: inline-flex; align-items: flex-end"
						target="_blank"
					>
						<Icon icon="link" />
					</a>
				</h2>
				<span v-if="date_start !== null || date_end !== null">
					<template v-if="date_start !== null">{{ date_start._i }} ~ </template>
					<template v-else>
						Date de livraison
						{{ status !== STATUS.PRODUCTION ? 'estimée' : '' }} :
					</template>
					<template v-if="date_end !== null">{{ date_end._i }} </template>
				</span>
			</div>

			<div class="project-header__badges">
				<span class="project-header__badge service" :data-text="service"></span>
				<span
					class="project-header__badge status"
					:class="[statusClass + '-bg']"
					:data-text="status"
				></span>
			</div>
		</header>

		<section class="project-progression" v-if="status !== STATUS.CANCELLED">
			<div class="project-progression__progress-bar__bg">
				<span
					class="project-progression__progress-bar"
					:class="[statusClass + '-bg']"
					:style="{ width: progression + '%' }"
				></span>
			</div>
			<span
				class="project-progression__txt"
				:class="[statusClass + '-txt']"
				:data-progression="progression + '%'"
			>
				Progression :
			</span>
		</section>

		<footer class="project-footer" :style="[footerStyle]">
			<input
				type="checkbox"
				:id="`details__input__${id}`"
				v-model="show_details"
				v-if="details"
				hidden
			/>
			<input
				type="checkbox"
				:id="`history__input__${id}`"
				v-model="show_history"
				v-if="admin || history.length > 0"
				hidden
			/>
			<input
				type="checkbox"
				:id="`reports__input__${id}`"
				v-if="admin || reports.length > 0"
				v-model="show_reports"
				hidden
			/>

			<section class="project-footer__btns">
				<label
					class="btn"
					:class="[{ active: show_details }]"
					v-if="details"
					:for="`details__input__${id}`"
				>
					Détails
				</label>
				<label
					class="btn"
					:class="[{ active: show_history }]"
					v-if="admin || history.length > 0"
					:for="`history__input__${id}`"
				>
					Historique
				</label>
				<label
					class="btn"
					:class="[{ active: show_reports }]"
					v-if="admin || reports.length > 0"
					:for="`reports__input__${id}`"
				>
					Documents ({{ reports.length }})
				</label>
				<span>Temps consommé : {{ timeSpent }} {{ estimation ? `/ ${estimation}` : "" }} JH</span>
			</section>

			<section class="project-footer__details" v-if="show_details">
				<div v-if="description" class="project-footer__details__description">
					<h3>Description</h3>
					<p v-html="_description"></p>
				</div>

				<div>
					<h3>Demandeur</h3>
					<p>
						{{ service }}
						<template v-if="applicant">({{ applicant }})</template>
					</p>
				</div>

				<div v-if="referent_info">
					<h3>Scrum Master</h3>
					<p>{{ referent_info }}</p>
				</div>

				<div v-if="referent_business">
					<h3>Product Owner</h3>
					<p>{{ referent_business }}</p>
				</div>

				<div v-if="developers.length > 0">
					<h3>Développeurs</h3>
					<template v-if="developers.length === 1">
						<p>{{ _developers }}</p>
					</template>
					<template v-else>
						<ul style="margin-left: 1.5rem">
							<li v-for="(developer, index) in developers" :key="index">
								{{ developer }}
							</li>
						</ul>
					</template>
				</div>

				<div v-if="clickup">
					<h3>Lien Clickup</h3>
					<a :href="clickup" target="_blank" class="project-link">
						<img src="@CommonAssets/img/clickup.png" height="100%" />
					</a>
				</div>
			</section>

			<History
				:id="id"
				:history="history"
				@content-edition="handlerContentEdition"
				v-if="(admin && show_history) || (history.length > 0 && show_history)"
			/>

			<Reports :reports="reports" :project-id="id" v-if="show_reports" />
		</footer>
	</article>
</template>

<script>
	import { STATUS, STORE } from '@Constants'
import { useMoment } from '@Hooks'
import { mapState } from '@Modules/vuex'

	const { Moment } = useMoment()
	const Actions = () =>
		import(/* webpackChunkName = "project" */ './Actions.vue')
	const History = () =>
		import(
			/* webpackChunkName = "project" */ '@CommonComponents/History/index.vue'
		)
	const Reports = () =>
		import(/* webpackChunkName = "project" */ './Reports.vue')

	export default {
		name: 'Project',
		components: { Actions, History, Reports },
		props: {
			closedMenu: {
				type: Boolean,
				default: () => false,
			},
			id: {
				type: Number,
				default: () => null,
			},
			title: {
				type: String,
				default: () => null,
			},
			users: {
				type: Array,
				default: () => [],
			},
			date_start: {
				type: Moment,
				default: () => null,
			},
			date_end: {
				type: Moment,
				default: () => null,
			},
			priority: {
				type: Boolean,
				default: () => false,
			},
			progression: {
				type: Number,
				default: () => 0,
			},
			service: {
				type: String,
				default: () => null,
			},
			fields: {
				type: Array,
				default: () => [],
			},
			applicant: {
				type: String,
				default: () => null,
			},
			referent_info: {
				type: String,
				default: () => null,
			},
			referent_business: {
				type: String,
				default: () => null,
			},
			status: {
				type: String,
				default: 'EN COURS',
				validator: value => Object.values(STATUS).includes(value),
			},
			description: {
				type: String,
				default: () => null,
			},
			clickup: {
				type: String,
				default: () => null,
			},
			link: {
				type: String,
				default: () => null,
			},
			developers: {
				type: Array,
				default: () => [],
			},
			history: {
				type: Array,
				default: () => [],
			},
			timeSpent: {
				type: Number,
				default: () => 0.0,
			},
			estimation: {
				type: Number,
				default: () => 0.0
			}
		},
		data() {
			const show_details = false
			const show_history = false
			const show_reports = false

			return { show_details, show_history, show_reports }
		},
		computed: {
			...mapState({
				admin: ({ admin }) => admin,
			}),
			externalLink() {
				return this.link ? ` ${this.link}` : ''
			},
			reports() {
				return this.$store.getters[STORE.GETTERS.FILES_GET_BY_PROJECT](this.id)
			},
			_description() {
				return this.description?.replace(/\n/g, '<br>') ?? null
			},
			_developers() {
				return this.developers.join(', ')
			},
			_fields() {
				return [...this.fields]
					.sort((a, b) => a.localeCompare(b))
					.map(field => field.replace(/_/g, ' '))
			},
			statusClass() {
				return this.status.replace(' ', '').toLowerCase()
			},
			footerStyle() {
				return [STATUS.WAITING, STATUS.CANCELLED].includes(this.status)
					? { marginTop: '2em' }
					: {}
			},
			STATUS() {
				return STATUS
			},
			details() {
				return (
					(this.applicant ?? false) ||
					(this.referent_info ?? false) ||
					(this.referent_business ?? false) ||
					(this.description ?? false) ||
					this.developers.length > 0 ||
					(this.link ?? false)
				)
			},
			footer() {
				return this.details || this.history.length > 0
			},
		},
		methods: {
			handlerContentEdition() {},
		},
	}
</script>

<style src="@Assets/css/project.css"></style>
