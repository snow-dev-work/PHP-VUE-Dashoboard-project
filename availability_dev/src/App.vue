<template>
	<div id="availability">
		<header>
			<a
				:href="`/?token=${token}`"
				class="btn btn__return"
				title="Retour au Suivi de projets"
			>
				<Icon icon="arrow-up" />
			</a>
			<h1>Disponibilité informatique</h1>
		</header>

		<main>
			<nav>
				<ul>
					<li v-for="tab in tabs" :key="tab.id">
						<button
							:class="['btn', { active: selected === tab.id }]"
							@click="() => selectView(tab.id)"
						>
							{{ tab.label }}
						</button>
					</li>
				</ul>
			</nav>

			<section ref="prtgSection" style="margin: auto; aspect-ratio: 16 / 9">
				<iframe
					v-if="currentTab.type === 'iframe'"
					width="100%"
					height="100%"
					id="prtg"
					:src="currentTab.src"
					style="border: 0"
				/>
				<img
					v-else-if="currentTab.type === 'img'"
					:src="currentTab.src"
					:alt="currentTab.label"
					:style="{
						objectfit: 'cover',
					}"
				/>
			</section>
		</main>
	</div>
</template>

<script>
	import Icon from '@CommonComponents/icon/index.vue'
	import GLPI from './dashboard-tickets.png'

	export default {
		name: 'App',
		components: { Icon },
		data() {
			const current = this.$moment()
			const lastWeekStart = current.clone().subtract({ week: 1 })
			const lastMonthStart = current.clone().subtract({ month: 1 })
			const firstDayOrYear = current.clone().startOf('year')

			const tabs = [
				{
					id: 1,
					label: 'Disponibilité Infrastructure - Alarmes',
					src: 'https://prtg.ageo.fr:8082/public/mapshow.htm?id=4958&mapid=1386C669-55F7-4384-8A48-6F6F583820CC',
					type: 'iframe',
				},
				{
					id: 2,
					label: 'Dispo site WEB - Semaine précédente',
					src: `https://prtg.ageo.fr:8082/historicdata_html.htm?id=5434&sdate=${lastWeekStart.format(
						'YYYY-MM-DD'
					)}-00-00-00&edate=${current.format(
						'YYYY-MM-DD'
					)}-23-59-00&avg=86400&pctavg=300&pctshow=false&pct=95&pctmode=false&hide=0,1,2,3&username=PRTG_API_DEV&passhash=3605512846`,
					type: 'iframe',
				},
				{
					id: 3,
					label: 'Dispo site WEB - Mois précédent',
					src: `https://prtg.ageo.fr:8082/historicdata_html.htm?id=5434&sdate=${lastMonthStart.format(
						'YYYY-MM-DD'
					)}-00-00-00&edate=${current.format(
						'YYYY-MM-DD'
					)}-23-59-00&avg=86400&pctavg=300&pctshow=false&pct=95&pctmode=false&hide=0,1,2,3&username=PRTG_API_DEV&passhash=3605512846`,
					type: 'iframe',
				},
				{
					id: 4,
					label: "Dispo site WEB - Depuis le début de l'année",
					src: `https://prtg.ageo.fr:8082/historicdata_html.htm?id=5434&sdate=${firstDayOrYear.format(
						'YYYY-MM-DD'
					)}-00-00-00&edate=${current.format(
						'YYYY-MM-DD'
					)}-23-59-00&avg=86400&pctavg=300&pctshow=false&pct=95&pctmode=false&hide=0,1,2,3&username=PRTG_API_DEV&passhash=3605512846`,
					type: 'iframe',
				},
				{
					id: 5,
					label: 'Dashboard Tickets',
					type: 'img',
					src: GLPI,
				},
			]

			return { tabs, selected: tabs[0].id }
		},
		computed: {
			prtgSectionClientRect() {
				if (this.prtgSection === null)
					return {
						width: 0,
						height: 0,
					}

				return this.prtgSection.getBoundingClientRect()
			},
			token() {
				return new URLSearchParams(window.location.search).get('token') ?? ''
			},
			currentTab() {
				return this.tabs.find(tab => tab.id === this.selected)
			},
		},
		methods: {
			selectView(id) {
				this.selected = id
			},
		},
	}
</script>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
	}

	#availability {
		height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr;
		font-family: sans-serif;
	}

	#availability h1 {
		margin: 0;
		font-size: 1.5em;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: hsla(0, 0%, 0%, 0.5);
	}
	#availability > header {
		padding: 1rem;
		display: flex;
		gap: 2em;
		align-items: center;
	}

	.select-month {
		margin-left: auto;
		text-transform: uppercase;
		padding: 0.5em 1em;
		flex: 1;
	}

	.select-month option {
		text-transform: uppercase;
	}

	#availability > main {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-auto-rows: 1fr;
		gap: 1em;
		overflow-y: auto;
		padding: 0 1em;
		height: 100%;
	}

	section {
		overflow-y: auto;
		height: 100%;
		display: grid;
		place-items: center;
	}

	.data-month-graph {
		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr 0.75fr;
		border: 0;
	}

	.btn {
		--accent: rgb(20 210 179 / 1);
		color: var(--accent);
		display: flex;
		min-height: 2.5em;
		width: 100%;

		text-decoration: none;
		border: solid 2px currentColor;
		border-radius: 0.75em;
		align-items: center;
		justify-content: flex-start;

		padding-inline: 16px;
		padding-block: 1rem;

		background-color: transparent;
	}
	.btn.active {
		background-color: var(--accent);
		color: white;
	}

	.btn__return {
		justify-content: center;
		transform: rotate(-90deg);
		width: 2.5em;
		padding-inline: 0;
		padding-block: 0;
	}

	#collabs {
		grid-template-columns: 1fr 0.5fr;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		justify-content: center;

		height: 100%;
	}
</style>
