<script>
	import mark from "$lib/assets/weberescu-mark-purple.png";

	let { dark = false } = $props();
</script>

<div id="Logo" class="flex items-center gap-2">
	<img
		src={mark}
		alt=""
		class="h-6 md:h-7 w-auto object-contain select-none"
		draggable="false"
	/>
	<span
		class="font-display font-bold uppercase leading-none select-none text-base md:text-lg {dark
			? 'text-white'
			: 'text-[#0A0A0A]'}"
		style="letter-spacing: -0.01em;"
	>
		Weberescu
	</span>
</div>
