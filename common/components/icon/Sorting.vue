<template>
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<g stroke="none" stroke-width="1" fill-rule="evenodd" :fill="color">
			<path
				d="M7 0H4a4 4 0 00-4 4v3a4 4 0 004 4h3a4 4 0 004-4V4a4 4 0 00-4-4zm2 7a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h3a2 2 0 012 2zm-2 6H4a4 4 0 00-4 4v3a4 4 0 004 4h3a4 4 0 004-4v-3a4 4 0 00-4-4zm2 7a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 012-2h3a2 2 0 012 2zm13.293-.951L20 21.339V2.633l2.293 2.29a1 1 0 101.414-1.415L21.12.925a3 3 0 00-4.24 0l-2.587 2.583a1 1 0 101.414 1.415L18 2.633v18.706l-2.293-2.29a1 1 0 10-1.414 1.415l2.587 2.583a3 3 0 004.24 0l2.587-2.583a1 1 0 10-1.414-1.415z"
			/>
		</g>
	</svg>
</template>

<script>
export default {
	name: "IconSorting",
	props: { color: String }
}
</script>
