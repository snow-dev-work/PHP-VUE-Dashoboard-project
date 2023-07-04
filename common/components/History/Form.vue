<template>
	<form
		class="project-history__form"
		@submit.prevent="submit"
		@reset.prevent="$emit('hide')"
	>
		<label>
			Date:
			<input type="date" v-model="date" />
		</label>
		<label>
			Heure:
			<input type="time" v-model="time" />
		</label>
		<label :for="`project-history__form__textarea__${id}`">Message:</label>
		<textarea
			:id="`project-history__form__textarea__${id}`"
			v-model="message"
			rows="5"
		></textarea>

		<div class="project-history__form__btns">
			<button type="submit" :disabled="pending">Envoyer</button>
			<button type="reset">Annuler</button>
		</div>
	</form>
</template>

<script>
	import { STORE } from '@Constants'
	import { mapActions } from '@Modules/vuex'

	export default {
		name: 'HistoryForm',
		props: {
			id: Number,
			container: null,
		},
		data() {
			const date = this.$moment().format('YYYY-MM-DD')
			const time = this.$moment().format('HH:mm')
			const message = ''
			const pending = false

			return { date, time, message, pending }
		},
		methods: {
			...mapActions({
				add: STORE.ACTIONS.HISTORY_POST,
			}),
			async submit() {
				if (this.pending) return

				const date = this.$moment()

				if (!date.isValid()) return
				if (this.message.length === 0) return

				this.pending = true

				await this.add({
					project_id: this.id,
					data: {
						message: this.message,
						date: date.format('DD/MM/YYYY HH:mm'),
					},
				})
				this.pending = false
				this.$emit('hide')
				this.container.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
			},
		},
	}
</script>

<style scoped>
	.project-history__form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		align-items: stretch;
		border: solid 1px hsla(0, 0%, 0%, 0.2);
		padding: 1em;
		border-radius: 0.75em;
	}

	textarea {
		resize: none;
	}

	input {
		outline: none;
		padding: 0;
		padding-left: 0.5rem;
		border: 0;
		font: inherit;
		background-color: transparent;
	}

	.project-history__form__btns {
		margin-left: auto;
		display: flex;
		gap: 0.5em;
		align-items: center;
	}
</style>
