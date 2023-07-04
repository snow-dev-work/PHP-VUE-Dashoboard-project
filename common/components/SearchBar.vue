<template>
	<span
		class="search-bar btn"
		:class="[{ focus }, { searched: search.length !== 0 }]"
	>
		<label :for="uuid" class="search-bar__label">
			<Icon icon="magnifier" />
		</label>

		<input
			:id="uuid"
			class="search-bar__input"
			type="text"
			v-model="search"
			v-focus="focus"
			@focus="focus = true"
			@blur="focus = false"
			placeholder="Nom du projet, référent, demandeur, etc..."
		/>

		<a class="search-bar__reset" @click="reset">
			<Icon icon="times" color="#888888" />
		</a>
	</span>
</template>

<script>
import { STORE } from "@Constants"

export default {
	name: "SearchBar",
	data() {
		const focus = false

		return { focus }
	},
	computed: {
		search: {
			get() {
				return this.$store.state.projects.search
			},
			set(search) {
				this.$store.commit(STORE.MUTATIONS.PROJECTS_SET_SEARCH, { search })
				this.$store.dispatch(STORE.ACTIONS.PROJECTS_SEARCH)
			},
		},
		uuid() {
			return `search-bar__input__${this._uid}`
		},
	},
	methods: {
		reset() {
			this.search = ""
			this.focus = true
		},
	},
}
</script>

<style scoped>
.search-bar {
	transition: color 300ms;
	display: flex;
	align-items: center;
	margin: auto 0;
	gap: 0.5em;
}

.search-bar__label {
	cursor: pointer;
}

.search-bar__input {
	outline: none;
	border: none;
	transition-property: width, margin-left;
	transition-duration: 300ms;
	color: var(--txt-color);
	background-color: var(--bg-color);
	flex: 1;
}

.search-bar__input::placeholder {
	font-size: 0.75em;
	color: var(--txt-color);
}

.search-bar.focus {
	--btn-color: var(--color-secondary);
	--btn-border-color: var(--btn-color);
}

.search-bar__reset {
	cursor: pointer;
	display: none;
	font-size: 0.8em;
	align-items: center;
}

.search-bar.searched .search-bar__reset {
	display: inline-flex;
}
</style>
