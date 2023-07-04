export default () => ({
	token: undefined,
	user: null,
	admin: false,
	isMobile: window.matchMedia("(max-width: 800px)").matches,
	isScroll: false,
	sender: false,
	eventSource: null,
})
