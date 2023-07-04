<template>
	<div id="dashboard">
		<Popups />
		<ButtonToTop :scroll="isScroll" />
		<transition name="overlay" mode="out-in" appear>
			<Overlay v-if="overlayIsVisible" />
		</transition>

		<Header v-if="!isMobile" />
		<transition name="header">
			<Header v-if="scroll" :class="{ scroll }" :scroll="scroll" />
		</transition>
		<Projects v-if="projects.length > 0" />
	</div>
</template>

<script>
	import Header from '@CommonComponents/Header.vue'
	import ButtonToTop from '@Components/ButtonToTop.vue'
	import { STORE } from '@Constants'
	import { mapActions, mapMutations, mapState } from '@Modules/vuex'

	const Overlay = () =>
		import(/* webpackChunkName: "overlay" */ '@CommonComponents/Overlay')

	const Projects = () =>
		import(/* webpackChunkName: "projects" */ '@Components/Projects')

	const Popups = () =>
		import(/* webpackChunkName: "popups" */ '@CommonComponents/Popups')

	export default {
		name: 'App',
		components: {
			Header,
			Overlay,
			Projects,
			Popups,
			ButtonToTop,
		},
		data() {
			return {
				update: this.$moment('2021-08-20', 'YYYY-MM-DD'),
			}
		},
		computed: {
			...mapState({
				projects: ({ projects }) => projects.list,
				sorted: ({ projects }) => projects.sorted,
				overlayIsVisible: ({ overlay }) => overlay.visible,
				isScroll: ({ isScroll }) => isScroll,
				isMobile: ({ isMobile }) => isMobile,
				user: ({ user }) => user,
				token: ({ token }) => token,
				sender: ({ sender }) => sender,
			}),
			scroll() {
				return this.isScroll || this.isMobile
			},
			sortedProjectsIds() {
				return this.sorted.map(project => project.id)
			},
		},
		methods: {
			...mapActions({
				load: STORE.ACTIONS.OVERLAY_LOAD,
				unload: STORE.ACTIONS.OVERLAY_UNLOAD,
				filter: STORE.ACTIONS.PROJECTS_FILTER,
			}),
			...mapMutations({
				closeEventSource: STORE.MUTATIONS.CLOSE_EVENT_SOURCE,
			}),
			async excel() {},
		},
		async beforeMount() {
			this.load()
			await this.$store.dispatch(STORE.ACTIONS.INIT)
			this.unload()
		},
		mounted() {
			const mediaQueryList = window.matchMedia('(max-width: 800px)')
			mediaQueryList.addEventListener('change', e => {
				const { matches: isMobile } = e
				this.$store.commit(STORE.MUTATIONS.SET_IS_MOBILE, { isMobile })
			})

			window.addEventListener('scroll', () => {
				const isScroll = window.pageYOffset >= 100
				if (isScroll !== this.isScroll) {
					this.$store.commit(STORE.MUTATIONS.SET_IS_SCROLL, { isScroll })
				}
			})
		},
		beforeDestroy() {
			this.closeEventSource()
		},
	}
</script>

<style src="@CommonAssets/css/variables.css"></style>
<style>
	#to-top {
		position: fixed;
		right: 0.75em;
		bottom: 0.75em;
		z-index: -100;
		opacity: 0;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: var(--color-primary);
		border: solid 3px currentColor;
		cursor: pointer;
		transition: opacity 500ms;
		width: 2em;
		height: 2em;
		font-size: 1.5em;
		display: grid;
		place-items: center;
		background-color: var(--bg-color);
	}

	#to-top.visible {
		z-index: 100;
		opacity: 0.75;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	input,
	textarea {
		font: inherit;
	}

	.project-footer section:nth-of-type(n + 2) + section {
		border-top: solid 1px currentColor;
		padding-top: 1em;
	}

	#dashboard > footer {
		padding: 3em 0;

		text-align: center;
	}

	@media screen and (max-width: 800px) {
		#dashboard {
			grid-template-columns: [content-start] 1fr [content-end];
			grid-template-rows: 1fr;
			padding-top: 15vh;
		}

		#dashboard > footer {
			padding: 2rem 0;
		}
	}
</style>
