<template>
	<article class="confirm">
		<header v-html="header"></header>
		<hr />
		<p v-html="text"></p>
		<div class="buttons">
			<button @click="handlerClickNo">Annuler</button>
			<button @click="handlerClickYes">Oui</button>
		</div>
	</article>
</template>

<script>
import { mapState, mapActions, mapMutations } from "@Modules/vuex"
import { OVERLAY, STORE } from "@Constants"

export default {
	name: "Confirm",
	computed: {
		...mapState({
			header: ({ overlay }) => overlay.confirm.header,
			text: ({ overlay }) => overlay.confirm.text,
			action: ({ overlay }) => overlay.confirm.action,
			project_id: ({ overlay }) => overlay.confirm.details?.project_id,
			event_id: ({ overlay }) => overlay.confirm.details?.event_id,
			file_id: ({ overlay }) => overlay.confirm.details?.file_id,
		}),
	},
	methods: {
		...mapActions({
			remove: STORE.ACTIONS.PROJECTS_DELETE,
			removeHistoryItem: STORE.ACTIONS.HISTORY_DELETE,
			hide: STORE.ACTIONS.CONFIRM_HIDE,
			removeFile: STORE.ACTIONS.FILES_DELETE,
		}),
		...mapMutations({
			pop: STORE.MUTATIONS.POPUPS_ADD,
		}),
		async handlerClickYes() {
			await this.executeAction()
			this.hide()
		},
		handlerClickNo() {
			this.hide()
		},
		async executeAction() {
			switch (this.action) {
				case OVERLAY.ACTIONS.REMOVE_PROJECT:
					await this.remove({ id: this.project_id })
					this.pop({ message: "Projet supprimé avec succès" })
					break
				case OVERLAY.ACTIONS.REMOVE_HISTORY_ITEM:
					await this.removeHistoryItem({
						project_id: this.project_id,
						id: this.event_id,
					})
					break
				case OVERLAY.ACTIONS.REMOVE_FILE:
					await this.removeFile({ id: this.file_id })
					break
				default:
					break
			}
		},
	},
}
</script>

<style scoped>
.confirm {
	display: flex;
	margin: auto;
	margin-top: 5vh;
	background-color: #fff;
	padding: 2rem;
	border-radius: 10px;
	flex-direction: column;
	align-items: stretch;
	gap: 1rem;
}

.confirm header {
	text-transform: uppercase;
	font-weight: bold;
}

.confirm p {
	padding: 0.5rem;
}

.confirm .buttons {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
}

.confirm button {
	cursor: pointer;
	padding: 0.25rem 1rem;
	border: solid 2px var(--txt-color);
	color: var(--txt-color);
	background: none;
	border-radius: 10px;
}

@media screen and (max-width: 800px) {
	.confirm {
		border-radius: 0;
	}
}
</style>
