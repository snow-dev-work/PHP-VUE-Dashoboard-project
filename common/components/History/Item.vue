<template>
	<div class="project-history__item" tabindex="0">
		<p
			:contenteditable="content_editable"
			ref="message"
			class="project-history__item__message"
			:class="[{ edition: content_editable && admin }]"
			v-html="_message"
			@input="handlerInput"
		></p>

		<span class="project-history__item__infos">
			<span class="project-history__item__date">
				<template v-if="content_editable">
					<input type="date" v-model="date_edited" /> ~
					<input type="time" v-model="time_edited" />
				</template>
				<template v-else>
					{{ date.format("L [~] HH:mm") }}
				</template>
			</span>

			<span v-if="admin" class="project-history__item__actions">
				<template v-if="content_editable">
					<span
						class="project-history__item__actions__validate"
						@click="validate"
						>✓</span
					>
					<span
						class="project-history__item__actions__cancel"
						@click="content_editable = false"
						>✗</span
					>
				</template>
				<template v-else>
					<span
						class="project-history__item__actions__edit"
						@click="content_editable = true"
					>
						Modifier
					</span>
					<span class="project-history__item__actions__remove" @click="remove"
						>Supprimer</span
					>
				</template>
			</span>
		</span>
	</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "@Modules/vuex"
import { POPUP_VARIANTS, STORE, OVERLAY } from "@Constants"

import { useMoment } from "@Hooks"
const { Moment } = useMoment()

export default {
	name: "HistoryItem",
	props: {
		id: Number,
		project_id: Number,
		date: Moment,
		message: String,
		stopEdition: Boolean,
	},
	data() {
		const content_editable = false
		const message_edited = this._message_w_br
		const date_edited = this.date.format("YYYY-MM-DD")
		const time_edited = this.date.format("HH:mm")

		return { content_editable, message_edited, date_edited, time_edited }
	},
	computed: {
		...mapState({
			admin: ({ admin }) => admin,
		}),
		_message_w_br() {
			return this.message.replace(/\n/g, "<br>")
		},
		_message: {
			get() {
				return this._message_w_br
			},
			set(message) {
				this.message_edited = message.replace(/<br>/g, "\n").trim()
			},
		},
		message_html() {
			return this.$refs.message
		},
	},
	watch: {
		content_editable(value) {
			if (value) this.$emit("content-edition")
			else {
				this.message_html.innerHTML = this._message
				this.date_edited = this.date.format("YYYY-MM-DD")
				this.time_edited = this.date.format("HH:mm")
			}
		},
	},
	methods: {
		...mapMutations({
			pop: STORE.MUTATIONS.POPUPS_ADD,
		}),
		...mapActions({
			confirm: STORE.ACTIONS.CONFIRM_SHOW,
			update: STORE.ACTIONS.HISTORY_PUT,
		}),
		handlerInput(e) {
			// console.log(e)
			this.message_edited = e.target.innerHTML
		},
		async validate() {
			const date = this.$moment(
				`${this.date_edited} ${this.time_edited}`,
				"YYYY-MM-DD HH:mm"
			)

			if (!date.isValid()) {
				return this.pop({
					message: "Date ou heure renseignée invalide",
					variant: POPUP_VARIANTS.WARNING,
				})
			}

			const data = {
				date: date.format("DD/MM/YYYY HH:mm"),
				message: this.message_edited,
			}

			await this.update({ project_id: this.project_id, id: this.id, data })

			this.content_editable = false
		},
		remove() {
			this.confirm({
				header: "Suppression d'un événement",
				text: "Êtes-vous sûr de vouloir supprimer cet événement ?",
				action: OVERLAY.ACTIONS.REMOVE_HISTORY_ITEM,
				details: {
					project_id: this.project_id,
					event_id: this.id,
				},
			})
		},
	},
}
</script>

<style scoped>
.project-history__item {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
	position: relative;
	gap: 0.5em;
}

.project-history__item__message {
	position: relative;
	z-index: 2;
	font-weight: normal;
	background-color: rgba(0, 0, 0, 0.05);
	padding: 1em;
	border-radius: 0.75em;

	border: solid 1px transparent;
	flex: 1 1 auto;
}
.project-history__item__message.edition {
	border-color: currentColor;
	background-color: transparent;
}

.project-history__item:hover .project-history__item__actions,
.project-history__item:focus .project-history__item__actions,
.project-history__item__message.edition
	~ .project-history__item__infos
	.project-history__item__actions {
	opacity: 1;
	bottom: 0;
}

.project-history__item__infos {
	position: relative;
	z-index: 1;
	bottom: 0;
	opacity: 1;
	font-size: 0.75em;
	font-weight: normal;
	transition-property: opacity top;
	transition-duration: 500ms;
}
.project-history__item__date {
	font-style: italic;
	position: relative;
}

.project-history__item__actions {
	position: relative;
	z-index: 1;
	bottom: -1em;
	opacity: 0;
	transition-property: opacity bottom;
	transition-duration: 500ms;
}

.project-history__item__actions__edit {
	cursor: pointer;
	color: var(--color-secondary);
	padding: 0 0.5em;
}
.project-history__item__actions__remove {
	cursor: pointer;
	color: crimson;
	padding: 0 0.5em;
}

.project-history__item__actions__validate {
	cursor: pointer;
	color: darkgreen;

	font-size: 1.5em;
	padding: 0 0.5em;
}
.project-history__item__actions__cancel {
	cursor: pointer;
	color: crimson;
	font-size: 1.5em;
	padding: 0 0.5em;
}

.project-history__list-enter-active:nth-child(odd),
.project-history__list-enter-to:nth-child(odd),
.project-history__list-leave-active:nth-child(odd) {
	left: 0%;
	opacity: 1;
	transition: all 1.5s;
}
.project-history__list-enter-active:nth-child(even),
.project-history__list-enter-to:nth-child(even),
.project-history__list-leave-active:nth-child(even) {
	right: 0;
	opacity: 1;
	transition: all 1.5s;
}

.project-history__list-leave-to:nth-child(odd),
.project-history__list-enter:nth-child(odd) {
	left: -100%;
	opacity: 0;
}
.project-history__list-leave-to:nth-child(even),
.project-history__list-enter:nth-child(even) {
	right: -100%;
	opacity: 0;
}
</style>
