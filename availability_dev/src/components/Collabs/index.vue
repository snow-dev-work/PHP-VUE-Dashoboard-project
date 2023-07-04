<template>
	<article class="collabs" @focusout="collab_selected = ''" tabindex="0">
		<header>
			<h3>Liste des projets par collaborateur</h3>
		</header>
		<div class="collabs__list">
			<template v-for="(collab, i) in list">
				<input
					type="radio"
					hidden
					v-model="collab_selected"
					:value="collab"
					name="collab"
					:key="`input-${i}`"
					:id="`collab-input-${i}`"
				/>
				<label
					class="collab"
					:class="[{ active: collab_selected === collab }]"
					:for="`collab-input-${i}`"
					:key="collab"
				>
					{{ collab }} ({{ collabs[collab].length }})
				</label>
			</template>
		</div>
		<div class="collabs__projects">
			<transition name="projects__list" mode="out-in">
				<ul :key="collab_selected">
					<li v-for="project in projects" :key="project">{{ project }}</li>
				</ul>
			</transition>
		</div>
	</article>
</template>

<script>
export default {
	name: "Collabs",
	props: {
		collabs: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		const collab_selected = ""

		return { collab_selected }
	},
	computed: {
		list() {
			return Object.keys(this.collabs).sort((a, b) => a.localeCompare(b))
		},
		projects() {
			return this.collabs?.[this.collab_selected] ?? []
		}
	},
	methods: {
		handler_focusout(e) {
			console.log(e)
		}
	}
}
</script>

<style scoped>
.collabs {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: repeat(2, min-content);
	font-size: 0.75em;
}
.collabs header {
	grid-column: span 2;
	padding: 2em 0;
}
.collabs h3 {
	font-size: 1.5em;
	padding-bottom: 0.5em;
	padding-left: 0.5em;
}
.collabs__list {
	display: grid;
	grid-auto-flow: row;
	align-content: start;
	overflow: auto;
	border: solid 1px hsla(0, 0%, 20%, 0.25);
}

.collab {
	--txt-color: hsl(0, 0%, 20%);
	--bg-color: hsl(0, 0%, 100%);
	--border-color: currentColor;

	color: var(--txt-color);
	background-color: var(--bg-color);
	padding: 1em 2em;
	text-transform: uppercase;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;

	transition: all 150ms;
}

.collab:hover {
	filter: brightness(0.9);
}
.collab.active:hover {
	filter: brightness(2);
}
.collab.active {
	--txt-color: hsl(0, 0%, 100%);
	--bg-color: hsla(0, 0%, 20%, 0.25);
	--border-color: currentColor;
}
.collabs__projects ul {
	list-style: none;
	padding: 1em 2em;
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.projects__list-enter-active,
.projects__list-leave-active {
	transition-property: transform, opacity;
	transition-duration: 200ms;
}
.projects__list-enter,
.projects__list-leave-to {
	transform: translateX(-2em);
	opacity: 0;
}
</style>
