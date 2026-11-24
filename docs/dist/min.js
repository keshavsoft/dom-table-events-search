// src/v2/registerGlobal/meta.js
var e = {
	version: "1.2.1",
	description: "Pre-cooked table event workflows, container delegation, and action dispatchers"
}, t = (t) => {
	typeof globalThis < "u" && t && (globalThis.ks ??= {}, globalThis.ks.domEvents ??= {}, globalThis.ks.domEvents.table ??= {}, globalThis.ks.domEvents.table = {
		meta: e,
		bindTableEvents: t
	});
}, n = ({ currentTbody: e, filteredRecords: t, columns: n, options: r = { serial: !0 } } = {}) => {
	if (!e) return;
	let i = globalThis.window?.ks || globalThis.ks, a = i?.jsonRenderers?.runInstructions?.render?.renderFunc, o = i?.jsonToTag?.buildSpecElement;
	if (typeof a == "function" && typeof o == "function") {
		let i = a({
			instructionMainKey: "table",
			instructionSubKey: "bodyOnly",
			data: {
				data: t,
				columns: n
			},
			options: r
		}), s = o(i?.children?.find((e) => e.tagName === "tbody") || i);
		s && e.replaceWith(s);
	}
}, r = ({ input: e, rootElement: t, data: r = [], columns: i = [], options: a = { serial: !0 } } = {}) => {
	if (!e || !t) return;
	let o = (e.value || "").trim().toLowerCase(), s = o ? r.filter((e) => Object.values(e).some((e) => String(e ?? "").toLowerCase().includes(o))) : r, c = (e.closest("table") || t.querySelector("table"))?.querySelector("tbody");
	c && n({
		currentTbody: c,
		filteredRecords: s,
		columns: i,
		options: a
	});
}, i = ({ container: e, data: t, columns: n = [], options: i = { serial: !0 } } = {}) => {
	let a = typeof e == "string" ? document.getElementById(e) : e;
	if (!a) {
		console.warn("[dom-table-events-search] Container element not found:", e);
		return;
	}
	let o = t;
	a.addEventListener("input", (e) => {
		let t = e.target;
		t.matches("input[type='search'], input[name='search'], [data-role='table-search'], #tableSearch, .table-search-input") && r({
			input: t,
			rootElement: a,
			data: o,
			columns: n,
			options: i
		});
	});
}, a = i;
t(i);
export { i as bindTableEvents, a as default };
