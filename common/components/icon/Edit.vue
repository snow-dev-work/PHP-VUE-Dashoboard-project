<template>
	<svg viewBox="0 0 36 37" xmlns="http://www.w3.org/2000/svg">
		<g stroke="none" stroke-width="1" fill-rule="evenodd" :fill="color">
			<path
				d="M34.84,6.28 L29.84,1.28 C28.6687298,0.110186488 26.7712702,0.110186488 25.6,1.28 L1.6,25.28 C0.69,26.19 0.72,28.4 0.72,28.4 L0.72,36.4 L8.72,35.4 C9.79581428,35.3646371 10.8381308,35.0171982 11.72,34.4 L34.84,10.52 C36.0098135,9.34872981 36.0098135,7.45127019 34.84,6.28 Z M8.72,32.4 L3.72,27.4 L27.72,3.4 L32.72,8.4 L8.72,32.4 Z"
			></path>
		</g>
	</svg>
</template>

<script>
export default {
	name: "IconEdit",
	props: { color: String }
}
</script>
