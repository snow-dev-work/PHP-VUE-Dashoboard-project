<template>
	<component
		:is="currentIcon"
		:color="color"
		:style="{ width: '1.25em', color }"
	/>
</template>

<script>
	import ArrowUp from './ArrowUp.vue'
	import Charts from './Charts.vue'
	import Comment from './Comment.vue'
	import Delete from './Delete.vue'
	import Download from './Download.vue'
	import Edit from './Edit.vue'
	import Exclamation from './Exclamation.vue'
	import Filters from './Filters.vue'
	import Info from './Info.vue'
	import Interrogation from './Interrogation.vue'
	import Link from './Link.vue'
	import Loader from './Loader.vue'
	import Magnifier from './Magnifier.vue'
	import More from './More.vue'
	import PercentageArrow from './PercentageArrow.vue'
	import SideViewBoth from './SideViewBoth.vue'
	import SideViewLeft from './SideViewLeft.vue'
	import SideViewRight from './SideViewRight.vue'
	import Smartphone from './Smartphone.vue'
	import Sorting from './Sorting.vue'
	import Table from './Table.vue'
	import Timeline from './Timeline.vue'
	import Times from './Times.vue'
	import View from './View.vue'

	const icons = new Map()
	icons.set('arrow-up', ArrowUp)
	icons.set('times', Times)
	icons.set('comment', Comment)
	icons.set('sorting', Sorting)
	icons.set('filters', Filters)
	icons.set('more', More)
	icons.set('view', View)
	icons.set('edit', Edit)
	icons.set('delete', Delete)
	icons.set('magnifier', Magnifier)
	icons.set('info', Info)
	icons.set('interrogation', Interrogation)
	icons.set('exclamation', Exclamation)
	icons.set('timeline', Timeline)
	icons.set('smartphone', Smartphone)
	icons.set('table', Table)
	icons.set('percentage-arrow', PercentageArrow)
	icons.set('loader', Loader)
	icons.set('download', Download)
	icons.set('charts', Charts)
	icons.set('side-view-right', SideViewRight)
	icons.set('side-view-left', SideViewLeft)
	icons.set('side-view-both', SideViewBoth)
	icons.set('link', Link)

	export default {
		name: 'Icon',
		props: {
			icon: {
				type: String,
				validation: icon =>
					[...icons.keys()].includes(icon.toLocaleLowerCase()),
			},
			color: {
				type: String,
				default: () => 'currentColor',
				validator: value =>
					value === 'currentColor' || /^#[0-9a-f]{6}$/i.test(value),
			},
		},
		computed: {
			currentIcon() {
				return icons.get(this.icon)
			},
		},
	}
</script>
