<script>
	import mark from "$lib/assets/weberescu-mark-purple.png";

	let { dark = false } = $props();
</script>

<div id="Logo" class="flex items-center gap-2.5">
	<img
		src={mark}
		alt="Weberescu"
		class="h-7 w-auto object-contain select-none"
		draggable="false"
	/>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 0 165 30"
		fill="none"
		id="logotype"
	>
		<text
			x="0"
			y="24"
			font-family="'Space Grotesk', sans-serif"
			font-weight="600"
			font-size="23"
			fill={dark ? "#ffffff" : "#0a0a0a"}>Weberescu</text
		>
	</svg>
</div>
