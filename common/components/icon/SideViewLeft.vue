<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<g stroke="none" stroke-width="1" fill-rule="evenodd" :fill="color">
			<path
				xmlns="http://www.w3.org/2000/svg"
				d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
			/>
		</g>
	</svg>
</template>

<script>
export default {
	name: "IconSideViewLeft",
	props: { color: String },
}
</script>

<style scoped>
path {
	transform-origin: center;
	transform: rotate(-90deg);
}
</style>
