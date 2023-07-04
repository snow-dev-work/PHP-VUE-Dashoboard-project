<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<g stroke="none" stroke-width="1" fill-rule="evenodd" :fill="color">
			<path
				d="M19 0h-5a1 1 0 000 2h5a2.951 2.951 0 011.285.3L.293 22.293a1 1 0 101.414 1.414L21.7 3.715A2.951 2.951 0 0122 5v5a1 1 0 002 0V5a5.006 5.006 0 00-5-5z"
			/>
			<path
				d="M6 10a4 4 0 10-4-4 4 4 0 004 4zm0-6a2 2 0 11-2 2 2 2 0 012-2zm12 10a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z"
			/>
		</g>
	</svg>
</template>

<script>
export default {
	name: "IconPercentageArrow",
	props: { color: String }
}
</script>
