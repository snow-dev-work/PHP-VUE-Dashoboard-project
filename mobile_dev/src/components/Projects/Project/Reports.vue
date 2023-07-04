<template>
	<section>
		<header>
			<h3>Documents</h3>
			<button @click="() => showFileForm({ id: projectId })" v-if="admin">
				Ajouter <Icon icon="more" />
			</button>
		</header>

		<table>
			<thead>
				<tr>
					<th>Nom</th>
					<th>Description</th>
					<th>Date d'ajout</th>
					<th></th>
				</tr>
			</thead>

			<tbody v-if="_reports.length > 0">
				<tr v-for="report in _reports" :key="report.id">
					<td>{{ report.filename }}</td>
					<td class="description">
						<p v-html="report.description.replace(/\n/, '<br>')" />
					</td>
					<td class="date">{{ report.date.format("L HH:mm") }}</td>
					<td>
						<div class="btn-group">
							<button
								:style="[downloadBtnStyle]"
								title="Télécharger le document"
								@click="() => downloadHandler(report)"
							>
								<Icon icon="download" />
							</button>
							<button
								:style="[deleteBtnStyle]"
								title="Supprimer le document"
								@click="() => removeHandler(report.id)"
								v-if="admin"
							>
								<Icon icon="delete" />
							</button>
						</div>
					</td>
				</tr>
			</tbody>

			<tbody v-else>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
import { mapState, mapActions } from "@Modules/vuex"
import { STORE, OVERLAY } from "@Constants"

export default {
	name: "Reports",
	props: {
		projectId: {
			type: Number,
			required: true
		},
		reports: {
			type: Array,
			default: () => []
		}
	},
	data() {
		const downloadBtnStyle = {
			"--btn-color": "var(--color-secondary)",
			border: "none",
			fontSize: "1.25em"
		}
		const deleteBtnStyle = {
			"--btn-color": "crimson",
			border: "none"
		}
		return { downloadBtnStyle, deleteBtnStyle }
	},
	computed: {
		...mapState({
			admin: ({ admin }) => admin
		}),
		_reports() {
			const reports = [...this.reports]
			reports.sort(({ date: a }, { date: b }) =>
				a.isBefore(b) ? 1 : a.isSame(b) ? 0 : -1
			)

			return reports
		}
	},
	methods: {
		...mapActions({
			showFileForm: STORE.ACTIONS.OVERLAY_SHOW_FILE_FORM,
			load: STORE.ACTIONS.OVERLAY_LOAD,
			unload: STORE.ACTIONS.OVERLAY_UNLOAD,
			download: STORE.ACTIONS.FILES_DOWNLOAD,
			confirm: STORE.ACTIONS.CONFIRM_SHOW
		}),
		async downloadHandler({ id, filename }) {
			this.load()
			const FILE = await this.download({ id })
			const BLOB_URL = URL.createObjectURL(FILE)
			const LINK = document.createElement("a")
			LINK.href = BLOB_URL
			LINK.download = filename
			document.body.append(LINK)
			LINK.dispatchEvent(
				new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					view: window
				})
			)
			document.body.removeChild(LINK)
			this.unload()
		},
		async removeHandler(file_id) {
			this.confirm({
				header: "Suppression d'un fichier",
				text: "Êtes-vous sûr de vouloir supprimer ce fichier ?",
				action: OVERLAY.ACTIONS.REMOVE_FILE,
				details: { file_id }
			})
		}
	}
}
</script>

<style scoped>
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
table {
	margin-top: 1em;
	width: 100%;
	border-collapse: collapse;
}

th {
	text-transform: uppercase;
}

th,
td {
	padding: 0.5em 1em;
}

td:empty {
	text-align: center;
}
td:empty::before {
	content: "-";
}

tbody tr:nth-of-type(2n + 1) {
	background-color: hsla(0, 0%, 0%, 0.025);
}

.btn-group {
	display: flex;
	align-items: stretch;
	justify-content: center;
}

.date {
	text-align: center;
}
</style>
