<script>
	// TEMPORARY DIAGNOSTIC OVERLAY — only ever active with ?debug=1 in the
	// URL, so normal visitors never load or see any of this.
	//
	// Purpose: a real mobile URL bar / bottom toolbar cannot be reproduced in
	// a headless browser (resizing a desktop window also changes svh/vh,
	// which a real toolbar does not), so this reports the same numbers from
	// the actual phone instead of guessing.
	//
	// It watches for `window.innerHeight` changing — i.e. the exact instant
	// the toolbar appears or disappears — and freezes a BEFORE/AFTER
	// comparison of the tracked image and every one of its ancestors, so the
	// element whose geometry actually moved is named on screen.

	import { onMount } from "svelte";

	let active = $state(false);
	let live = $state(null);
	let report = $state(null);

	const num = (n) => (n === null || n === undefined ? "-" : Math.round(n));

	function snapshot() {
		const img = document.querySelector("#work img");
		if (!img) return null;

		const chain = [];
		let node = img;
		while (node && node.tagName) {
			const r = node.getBoundingClientRect();
			chain.push({
				name:
					node.tagName.toLowerCase() +
					(node.id ? "#" + node.id : "") +
					(typeof node.className === "string" && node.className
						? "." + node.className.trim().split(/\s+/)[0]
						: ""),
				top: r.top,
				height: r.height,
			});
			node = node.parentElement;
		}

		return {
			scrollY: window.scrollY,
			docScrollTop: document.documentElement.scrollTop,
			innerHeight: window.innerHeight,
			innerWidth: window.innerWidth,
			clientHeight: document.documentElement.clientHeight,
			vvHeight: window.visualViewport ? window.visualViewport.height : null,
			vvOffsetTop: window.visualViewport ? window.visualViewport.offsetTop : null,
			vvPageTop: window.visualViewport ? window.visualViewport.pageTop : null,
			vvScale: window.visualViewport ? window.visualViewport.scale : null,
			docHeight: document.documentElement.scrollHeight,
			// Resolve the viewport units directly, so we can see on the real
			// device whether svh/lvh/dvh actually stay put when the toolbar
			// moves — this is the assumption every previous fix rested on.
			unit_svh: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--probe-svh")) || null,
			unit_lvh: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--probe-lvh")) || null,
			unit_dvh: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--probe-dvh")) || null,
			chain,
		};
	}

	onMount(() => {
		if (typeof location === "undefined" || !location.search.includes("debug=1")) return;
		active = true;

		// Probe elements: 100svh/100lvh/100dvh measured for real, on device.
		const probe = document.createElement("div");
		probe.style.cssText = "position:absolute;top:0;left:0;width:0;pointer-events:none;visibility:hidden;";
		probe.innerHTML =
			'<div id="__p_svh" style="height:100svh"></div>' +
			'<div id="__p_lvh" style="height:100lvh"></div>' +
			'<div id="__p_dvh" style="height:100dvh"></div>';
		document.body.appendChild(probe);

		const readUnits = () => {
			const s = document.getElementById("__p_svh");
			const l = document.getElementById("__p_lvh");
			const d = document.getElementById("__p_dvh");
			document.documentElement.style.setProperty("--probe-svh", s ? s.getBoundingClientRect().height : 0);
			document.documentElement.style.setProperty("--probe-lvh", l ? l.getBoundingClientRect().height : 0);
			document.documentElement.style.setProperty("--probe-dvh", d ? d.getBoundingClientRect().height : 0);
		};

		let lastHeight = window.innerHeight;
		let lastSnap = null;

		const tick = () => {
			readUnits();
			const snap = snapshot();
			if (!snap) return;
			live = snap;

			// The toolbar moved: innerHeight changed while width did not.
			if (snap.innerHeight !== lastHeight && lastSnap && snap.innerWidth === lastSnap.innerWidth) {
				const before = lastSnap;
				const after = snap;
				const rows = [];
				for (let i = 0; i < Math.min(before.chain.length, after.chain.length); i++) {
					const a = before.chain[i];
					const z = after.chain[i];
					rows.push({
						name: a.name,
						dTop: z.top - a.top,
						dHeight: z.height - a.height,
						aTop: a.top,
						zTop: z.top,
						aH: a.height,
						zH: z.height,
					});
				}
				report = {
					dir: after.innerHeight < before.innerHeight ? "TOOLBAR APARE" : "TOOLBAR DISPARE",
					before,
					after,
					rows,
					dScrollY: after.scrollY - before.scrollY,
					dDocHeight: after.docHeight - before.docHeight,
				};
			}

			lastHeight = snap.innerHeight;
			lastSnap = snap;
		};

		const id = setInterval(tick, 100);
		tick();

		return () => {
			clearInterval(id);
			probe.remove();
		};
	});
</script>

{#if active}
	<div
		style="position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(0,0,0,.9);color:#0f0;font:10px/1.35 monospace;padding:6px;max-height:62vh;overflow:auto;pointer-events:auto;white-space:pre;"
	>
		{#if live}
scrollY={num(live.scrollY)} docTop={num(live.docScrollTop)}
innerH={num(live.innerHeight)} clientH={num(live.clientHeight)} innerW={num(live.innerWidth)}
vvH={num(live.vvHeight)} vvOffTop={num(live.vvOffsetTop)} vvPageTop={num(live.vvPageTop)} vvScale={live.vvScale}
docHeight={num(live.docHeight)}
UNITS: 100svh={num(live.unit_svh)} 100lvh={num(live.unit_lvh)} 100dvh={num(live.unit_dvh)}
		{/if}
		{#if report}
<span style="color:#ff0">━━━ {report.dir} ━━━</span>
<span style="color:#ff0">innerH {num(report.before.innerHeight)} → {num(report.after.innerHeight)}   scrollY {num(report.before.scrollY)} → {num(report.after.scrollY)} (Δ{num(report.dScrollY)})</span>
<span style="color:#ff0">svh {num(report.before.unit_svh)} → {num(report.after.unit_svh)}   lvh {num(report.before.unit_lvh)} → {num(report.after.unit_lvh)}   dvh {num(report.before.unit_dvh)} → {num(report.after.unit_dvh)}</span>
<span style="color:#ff0">docHeight {num(report.before.docHeight)} → {num(report.after.docHeight)} (Δ{num(report.dDocHeight)})</span>
{#each report.rows as r}<span style="color:{r.dHeight !== 0 ? '#f44' : r.dTop !== 0 ? '#fa0' : '#888'}">{r.name}  top {num(r.aTop)}→{num(r.zTop)} (Δ{num(r.dTop)})  h {num(r.aH)}→{num(r.zH)} (Δ{num(r.dHeight)})</span>
{/each}
		{:else}
<span style="color:#888">…derulează până apare/dispare bara browserului…</span>
		{/if}
	</div>
{/if}
