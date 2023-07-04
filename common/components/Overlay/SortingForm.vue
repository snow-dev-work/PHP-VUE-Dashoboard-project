<template>
	<form @submit.prevent @reset.prevent="reset" class="custom-form sorting-form">
		<header class="large">
			<h2>Tri</h2>
			<button type="button" class="custom-form__exit" @click="cancel">
				<Icon icon="times" />
			</button>
		</header>

		<h4>Nom du projet :</h4>
		<div class="sorting-form__options">
			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="title"
				:value="0"
				id="title__null"
				name="title"
			/>
			<label class="sorting-form__option" for="title__null">Aucun</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="title"
				:value="ORDER.ASC"
				id="title__asc"
				name="title"
			/>
			<label class="sorting-form__option" for="title__asc">Croissant</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="title"
				:value="ORDER.DESC"
				id="title__desc"
				name="title"
			/>
			<label class="sorting-form__option" for="title__desc">Décroissant</label>
		</div>

		<h4>Progression :</h4>
		<div class="sorting-form__options">
			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="progression"
				:value="0"
				id="progression__null"
				name="progression"
			/>
			<label class="sorting-form__option" for="progression__null">Aucun</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="progression"
				:value="ORDER.ASC"
				id="progression__asc"
				name="progression"
			/>
			<label class="sorting-form__option" for="progression__asc"
				>Croissant</label
			>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="progression"
				:value="ORDER.DESC"
				id="progression__desc"
				name="progression"
			/>
			<label class="sorting-form__option" for="progression__desc">
				Décroissant
			</label>
		</div>

		<h4>Statut :</h4>
		<div class="sorting-form__options">
			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="status"
				:value="0"
				id="status__null"
				name="status"
			/>
			<label class="sorting-form__option" for="status__null">Aucun</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="status"
				:value="ORDER.ASC"
				id="status__asc"
				name="status"
			/>
			<label class="sorting-form__option" for="status__asc">Croissant</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="status"
				:value="ORDER.DESC"
				id="status__desc"
				name="status"
			/>
			<label class="sorting-form__option" for="status__desc">Décroissant</label>
		</div>

		<h4>Date :</h4>
		<div class="sorting-form__options">
			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="date"
				:value="0"
				id="date__null"
				name="date"
			/>
			<label class="sorting-form__option" for="date__null">Aucun</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="date"
				:value="ORDER.ASC"
				id="date__asc"
				name="date"
			/>
			<label class="sorting-form__option" for="date__asc">Croissant</label>

			<input
				hidden
				type="radio"
				class="sorting-form__option__input"
				v-model="date"
				:value="ORDER.DESC"
				id="date__desc"
				name="date"
			/>
			<label class="sorting-form__option" for="date__desc">Décroissant</label>
		</div>

		<button type="reset" class="sorting-form__reset">Réinitialiser</button>
	</form>
</template>

<script>
import { mapActions, mapState } from "@Modules/vuex"
import { ORDER, STORE } from "@Constants"

export default {
	name: "SortingForm",
	computed: {
		...mapState({
			yardsticks: ({ projects }) => projects.yardsticks,
		}),
		ORDER() {
			return ORDER
		},
		title: {
			get() {
				return this.yardsticks.get("title") ?? 0
			},
			set(value) {
				if (value == 0) this.yardsticks.delete("title")
				else this.yardsticks.set("title", value)
				this.sort()
			},
		},
		status: {
			get() {
				return this.yardsticks.get("status") ?? 0
			},
			set(value) {
				if (value == 0) this.yardsticks.delete("status")
				else this.yardsticks.set("status", value)
				this.sort()
			},
		},
		date: {
			get() {
				return this.yardsticks.get("date") ?? 0
			},
			set(value) {
				if (value == 0) this.yardsticks.delete("date")
				else this.yardsticks.set("date", value)
				this.sort()
			},
		},
		progression: {
			get() {
				return this.yardsticks.get("progression") ?? 0
			},
			set(value) {
				if (value == 0) this.yardsticks.delete("progression")
				else this.yardsticks.set("progression", value)
				this.sort()
			},
		},
	},
	methods: {
		...mapActions({
			sort: STORE.ACTIONS.PROJECTS_SORT,
			hide: STORE.ACTIONS.OVERLAY_HIDE,
		}),
		reset() {
			this.yardsticks.clear()
			this.yardsticks.set("status", ORDER.DESC)
			this.yardsticks.set("date", ORDER.ASC)
			this.sort()
			this.hide()
		},
		cancel() {
			this.$store.dispatch(STORE.ACTIONS.OVERLAY_HIDE)
			this.hide()
		},
	},
}
</script>

<style src="@CommonAssets/css/custom-form.css"></style>
<style scoped>
.sorting-form__options {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 1em;
}

.sorting-form__option {
	cursor: pointer;
	display: block;
	font-size: 0.75em;
	font-weight: 500;
	text-transform: uppercase;
	padding: 0.4em 1em;
	border-radius: 1em;
	border: solid 1px currentColor;
	background-color: #fff;
	color: var(--txt-color);
}

.sorting-form__option__input:checked + .sorting-form__option {
	background-color: var(--txt-color);
	color: #fff;
}

.sorting-form__close {
	border: none;
	padding: 0;
	color: var(--color-primary);
}
.sorting-form__reset {
	--contrasting-color: transparent !important;
	grid-column: 1 / -1;
	justify-self: end;
	color: var(--color-danger) !important;
	border: none;
	padding: 0;
}
</style>
