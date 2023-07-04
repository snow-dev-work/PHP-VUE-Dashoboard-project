<template>
	<div id="dashboard-table">
		<Popups />
		<transition name="overlay" mode="out-in" appear>
			<Overlay v-if="overlayIsVisible" />
		</transition>
		<Header :show_btns="false" :view="'TABLE'" />
		<main>
			<Table :class="[{ superadmin: admin }]" :fields="fields" />
		</main>
	</div>
</template>

<script>
import Header from "@CommonComponents/Header.vue"
import { STORE } from "@Constants"
import { mapActions, mapState } from "@Modules/vuex"

const Overlay = () =>
	import(/* webpackChunkName: "overlay" */ "@CommonComponents/Overlay")
const Popups = () =>
	import(/* webpackChunkName: "popups" */ "@CommonComponents/Popups")

const Table = () => import(/* webpackChunkName: "table" */ "@Components/Table")

export default {
	name: "App",
	components: { Header, Overlay, Popups, Table },
	computed: {
		...mapState({
			overlayIsVisible: ({ overlay }) => overlay.visible,
			admin: ({ admin }) => admin
		}),
		fields() {
			let fields = [
				{ key: "title", label: "Nom du projet", sortable: true },
				{ key: "fields", label: "Domaines", sortable: true },
				{ key: "service", label: "Demandeur", sortable: true },
				{ key: "status", label: "Statut", sortable: true },
				{ key: "date", label: "Date", sortable: true },
				{ key: "progression", label: "Progression", sortable: true },
				{ key: "referent_info", label: "Scrum Master" },
				{ key: "referent_business", label: "Product Owner" },
				{ key: "developers", label: "Developpeurs" }
			]

			if (this.admin) {
				fields = [
					...fields,
					{ key: "users", label: "Utilisateurs autorisés" },
					{ key: "actions", label: "Actions" }
				]
			}

			return fields
		}
	},
	methods: {
		...mapActions({
			load: STORE.ACTIONS.OVERLAY_LOAD,
			unload: STORE.ACTIONS.OVERLAY_UNLOAD
		})
	},
	async beforeMount() {
		this.load()
		await this.$store.dispatch(STORE.ACTIONS.INIT)
		this.unload()
	}
}
</script>

<style src="@CommonAssets/css/variables.css"></style>
<style>
body {
	min-height: 100vh;
}

#dashboard-table {
	background-color: var(--bg-color);
	display: flex;
	flex-direction: column;
	align-items: stretch;
	height: 100vh;
	overflow: hidden;
}

.header {
	padding: 2em;
}

.header .search-bar {
	border: none;
}

main {
	overflow: auto;
	position: relative;
}

h1 {
	font-size: 2em;
	font-weight: bold;
	color: var(--color-secondary);
	margin: 0;
}

h3 {
	font-size: 0.85em;
	text-transform: uppercase;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 500ms;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

:is(button, .btn) {
	--btn-bg-color: var(--bg-color);
	--btn-color: var(--txt-color);
	--btn-border-color: var(--txt-color);

	background-color: var(--btn-bg-color);
	color: var(--btn-color);
	border: solid 2px var(--btn-border-color);
	text-decoration: none;
	padding: 0.5em 1.5em;
	border-radius: 0.75em;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 1em;
}

:is(button, .btn)[disabled] {
	pointer-events: none;
	opacity: 0.5;
}

.buttons-group {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	gap: 0.2em;
	flex: 1;
	position: relative;
	z-index: 105;
}

.buttons-group button {
	padding: 0;
	color: inherit;
	background-color: transparent;
}

.custom-table__project.enattente tr:first-child .custom-table__cell {
	background-color: var(--color-wait-25);
}
.custom-table__project.encours tr:first-child .custom-table__cell {
	background-color: var(--color-prog-25);
}
.custom-table__project.recette tr:first-child .custom-table__cell {
	background-color: var(--color-rec-25);
}
.custom-table__project.production tr:first-child .custom-table__cell {
	background-color: var(--color-prod-25);
}
.custom-table__project.annule tr:first-child .custom-table__cell {
	background-color: var(--color-can-25);
}

.custom-table__project.priority .custom-table__cell.title::before {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	top: calc(50% - 1em);
	z-index: 0;
	border: solid 1em transparent;
	border-left-color: var(--color-priority);
}
.custom-table__project.priority
	.custom-table__cell.title
	.custom-table__cell__content {
	position: relative;
	z-index: 1;
}

.custom-table__project
	.custom-table__project__row__1
	.custom-table__cell:nth-child(1) {
	font-weight: bold;
}

.custom-table__project.focus .custom-table__project__row__2 {
	display: table-row;
}

.custom-table__project__row__2 {
	display: none;
	border-top: solid 2px hsla(0, 0%, 0%, 0.05);
}

.project-footer__history {
	display: flex;
	max-width: 65.5vw;
}
</style>
