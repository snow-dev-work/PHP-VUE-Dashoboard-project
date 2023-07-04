<template>
	<transition-group tag="main" name="project-list" class="project-list">
		<template v-for="project in projects">
			<Project
				:key="project.id"
				v-bind="project"
				:closed-menu="openedMenu !== project.id"
				@opened-menu="openedMenu = project.id"
			/>
		</template>
	</transition-group>
</template>

<script>
import { mapState } from "@Modules/vuex"

const Project = () =>
	import(
		/* webpackChunkName = "project" */ "@Components/Projects/Project/index.vue"
	)

export default {
	name: "Projects",
	components: { Project },
	data() {
		const openedMenu = null

		return { openedMenu }
	},
	computed: {
		...mapState({
			projects: ({ projects }) => projects.searched
		})
	}
}
</script>
