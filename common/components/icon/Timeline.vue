<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		style="transform: scaleX(-1) rotate(-90deg)"
	>
		<g stroke="none" stroke-width="1" fill-rule="evenodd" :fill="color">
			<path
				d="M23 22H3a1 1 0 01-1-1V1a1 1 0 00-2 0v20a3 3 0 003 3h20a1 1 0 000-2z"
			/>
			<path
				d="M15 20a1 1 0 001-1v-7a1 1 0 00-2 0v7a1 1 0 001 1zm-8 0a1 1 0 001-1v-7a1 1 0 00-2 0v7a1 1 0 001 1zm12 0a1 1 0 001-1V7a1 1 0 00-2 0v12a1 1 0 001 1zm-8 0a1 1 0 001-1V7a1 1 0 00-2 0v12a1 1 0 001 1z"
			/>
		</g>
	</svg>
</template>

<script>
export default {
	name: "IconTimeline",
	props: { color: String }
}
</script>
