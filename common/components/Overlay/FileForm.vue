<template>
	<form @submit.prevent="submit" @reset.prevent="hide" class="custom-form">
		<header class="custom-form__header large">
			<h2>Ajouter un document</h2>
			<button type="reset" class="custom-form__exit">
				<Icon icon="times" />
			</button>
		</header>

		<input type="hidden" name="project_id" :value="selected.id" />
		<input type="file" name="file" required class="large" />
		<CustomTextarea
			v-model="description"
			name="description"
			label="Description"
			class="large"
			:required="true"
			:max="255"
		/>

		<div class="custom-form__buttons large">
			<button type="submit">Enregistrer</button>
			<button type="reset">Annuler</button>
		</div>
	</form>
</template>

<script>
import { mapState, mapActions } from "@Modules/vuex"
import { STORE } from "@Constants"

export default {
	name: "FileForm",
	data() {
		const description = ""
		return {
			description,
		}
	},
	computed: {
		...mapState({
			selected: ({ projects }) => projects.selected,
		}),
	},
	methods: {
		...mapActions({
			add: STORE.ACTIONS.FILES_POST,
			hide: STORE.ACTIONS.OVERLAY_HIDE,
			load: STORE.ACTIONS.OVERLAY_LOAD,
			unload: STORE.ACTIONS.OVERLAY_UNLOAD,
		}),
		async submit(e) {
			const data = new FormData(e.target)
			this.load()
			await this.add({ data })
			this.unload()
		},
	},
}
</script>

<style src="@CommonAssets/css/custom-form.css"></style>
