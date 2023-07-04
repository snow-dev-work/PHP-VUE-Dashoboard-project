<template>
	<section class="project-actions">
		<input
			hidden
			type="checkbox"
			class="project-actions__radio"
			name="project-actions__radio"
			:id="'project-actions__radio__' + id"
			v-model="show"
		/>

		<label
			class="project-actions__toggle-btn"
			:for="'project-actions__radio__' + id"
		>
			<Icon :icon="icon" />
		</label>

		<div class="project-actions__menu">
			<button
				class="project-actions__edit"
				title="Editer le projet"
				@click="handlerClick_edit"
			>
				<Icon icon="edit" color="#ffffff" />
			</button>
			<button
				class="project-actions__remove"
				title="Supprimer le projet"
				@click="handlerClick_remove"
			>
				<Icon icon="delete" color="#ffffff" />
			</button>
		</div>
	</section>
</template>

<script>
import { mapActions, mapState } from "@Modules/vuex"
import { STORE, OVERLAY } from "@Constants"

export default {
	name: "Actions",
	props: {
		closedMenu: {
			type: Boolean,
			default: () => false
		},
		id: {
			type: Number,
			required: true
		}
	},
	data() {
		const opened = false

		return { opened }
	},
	computed: {
		...mapState({
			isMobile: ({ isMobile }) => isMobile
		}),
		icon() {
			if (this.opened) return "times"
			return "view"
		},
		show: {
			get() {
				return this.opened
			},
			set(shown) {
				this.opened = shown
				if (shown) this.$emit("opened-menu")
			}
		}
	},
	watch: {
		closedMenu(value) {
			this.opened = !value
		}
	},
	methods: {
		...mapActions({
			edit: STORE.ACTIONS.OVERLAY_SHOW_PROJECT_FORM,
			confirm: STORE.ACTIONS.CONFIRM_SHOW
		}),
		handlerClick_edit() {
			this.edit({ id: this.id })
			this.show = false
		},
		handlerClick_remove() {
			this.confirm({
				header: "Suppression d'un projet",
				text: "Êtes-vous sur de vouloir supprimer ce projet ?",
				action: OVERLAY.ACTIONS.REMOVE_PROJECT,
				details: { project_id: this.id }
			})
			this.show = false
		}
	}
}
</script>

<style scoped>
.project-actions {
	position: absolute;
	width: 50px;
	height: 50px;
	top: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
}

.project-actions__toggle-btn {
	cursor: pointer;
	position: relative;
	padding: 0.5em;
	z-index: 15;
	background: none;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 300ms;
}

.project-actions__menu {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	width: 150px;
	height: 150px;
	border-radius: 50%;
	background-color: var(--color-primary);
	transform: translate(25%, -25%) scale(0);
	transform-origin: top right;
	transition: transform 650ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.project-actions__menu button {
	--contrasting-color: transparent;
	padding: 0;
	background: none;
	border: none;
	position: absolute;
	cursor: pointer;
	font-size: 1.25em;
}

.project-actions__radio:checked ~ * {
	color: #fff;
}

.project-actions__radio:checked ~ .project-actions__menu {
	transform: translate(25%, -25%) scale(1);
}

.project-actions__edit {
	bottom: 20%;
	left: 40%;
	transition-delay: 0s;
}
.project-actions__remove {
	bottom: 40%;
	left: 20%;
	transition-delay: 0s;
}
</style>
