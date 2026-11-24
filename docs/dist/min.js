// src/v2/registerGlobal/meta.js
var e = {
	version: "1.2.1",
	description: "Pre-cooked table event workflows, container delegation, and action dispatchers"
}, t = (t) => {
	typeof globalThis < "u" && t && (globalThis.ks ??= {}, globalThis.ks.domTableEvents = {
		meta: e,
		bindTableEvents: t.bindTableEvents,
		actions: t.actions,
		state: t.state
	});
}, n = new class {
	constructor() {
		this.dataset = [], this.filteredData = [], this.columns = [], this.selectedIndex = -1, this.container = null, this.renderTable = null, this.onRowClick = null, this.onRowAction = null, this.onFooterSave = null, this.onSearch = null, this.setFeedback = null;
	}
	init({ container: e, dataset: t = [], columns: n = [], renderTable: r = null, onRowClick: i = null, onRowAction: a = null, onFooterSave: o = null, onSearch: s = null, setFeedback: c = null }) {
		this.container = typeof e == "string" ? document.getElementById(e) : e, this.dataset = t, this.filteredData = [...t], this.columns = n, this.selectedIndex = -1, this.renderTable = r, this.onRowClick = i, this.onRowAction = a, this.onFooterSave = o, this.onSearch = s, this.setFeedback = c;
	}
	notifyFeedback(e) {
		if (typeof this.setFeedback == "function") this.setFeedback(e);
		else {
			let t = this.container?.querySelector("#search-feedback, [data-role='feedback']");
			t && (t.textContent = e);
		}
	}
}(), r = {
	version: "1.2.0",
	description: "Standardized, zero-dependency DOM traversal utilities organized by semantic concerns"
}, i = (e) => {
	typeof globalThis < "u" && e && (globalThis.ks ??= {}, globalThis.ks.domTraversal ??= {}, globalThis.ks.domTraversal.table = {
		meta: r,
		header: e.header,
		body: e.body,
		footer: e.footer
	});
}, a = (e) => e ? ((e.target || e).value || "").trim().toLowerCase() : "", o = { getSearchQuery: a }, s = (e) => e ? e.tagName === "TR" ? e : e.closest("tr") || null : null, c = (e, t = "") => {
	let n = s(e);
	if (!n) return -1;
	if (t) return Array.from(document.querySelectorAll(t)).indexOf(n);
	let r = n.closest("tbody");
	if (r) return Array.from(r.querySelectorAll(":scope > tr")).indexOf(n);
	let i = n.parentElement;
	return i ? Array.from(i.children).filter((e) => e.tagName === "TR").indexOf(n) : -1;
}, l = (e, t = "table-primary", n = "") => {
	let r = s(e);
	if (!r) return null;
	let i = [];
	if (n) i = Array.from(document.querySelectorAll(n));
	else {
		let e = r.closest("tbody") || r.parentElement;
		e && (i = Array.from(e.querySelectorAll(":scope > tr")));
	}
	return i.forEach((e) => e.classList.remove(t)), r.classList.add(t), r;
};
// node_modules/dom-traversal-functions/src/v2/index.js
i({
	header: o,
	body: {
		getRowElement: s,
		getRowIndex: c,
		highlightRow: l,
		getRowData: (e, { columns: t = [], dataset: n = [], bodySelector: r = "" } = {}) => {
			let i = s(e);
			if (!i) return null;
			let a = c(i, r);
			if (n && Array.isArray(n) && a >= 0 && a < n.length) return n[a];
			let o = {}, l = Array.from(i.querySelectorAll(":scope > td, :scope > th"));
			if (t && t.length > 0) {
				let e = 0;
				l.forEach((n) => {
					let r = n.getAttribute("data-name") || n.getAttribute("data-column");
					if (r) o[r] = n.textContent.trim();
					else if (e < t.length) {
						let r = t[e].columnName;
						o[r] = n.textContent.trim(), e++;
					}
				});
			} else l.forEach((e, t) => {
				let n = e.getAttribute("data-name") || e.getAttribute("data-column") || `col_${t}`;
				o[n] = e.textContent.trim();
			});
			return o;
		}
	},
	footer: {
		getFooterData: (e, t = []) => {
			let n = s(e);
			if (!n) return {};
			let r = {};
			return t && t.length > 0 ? t.forEach((e) => {
				let t = n.querySelector(`input[name="${e.columnName}"]`) || n.querySelector(`input#${e.columnName}`);
				t && (r[e.columnName] = t.value.trim());
			}) : Array.from(n.querySelectorAll("input")).forEach((e) => {
				let t = e.getAttribute("name") || e.id;
				t && (r[t] = e.value.trim());
			}), r;
		},
		clearRowInputs: (e) => {
			let t = s(e);
			if (!t) return 0;
			let n = Array.from(t.querySelectorAll("input"));
			return n.forEach((e) => {
				e.value = "";
			}), n.length;
		}
	}
});
// src/v2/actions/onSearch.js
var u = (e, t) => {
	let r = a(t), i = r ? n.dataset.filter((e) => Object.values(e).some((e) => String(e ?? "").toLowerCase().includes(r))) : n.dataset;
	n.filteredData = i, typeof n.renderTable == "function" && n.renderTable(i);
	let o = r ? `Showing ${i.length} of ${n.dataset.length} records matching "${t?.value?.trim() || ""}".` : `Showing all ${n.dataset.length} records.`;
	n.notifyFeedback(o), typeof n.onSearch == "function" && n.onSearch(r, i);
}, d = (e, t) => {
	if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "INPUT") return;
	let r = c(t);
	if (r < 0 || r >= n.dataset.length) return;
	n.selectedIndex = r, l(t, "table-primary");
	let i = n.dataset[r];
	n.notifyFeedback(`Selected Row #${r + 1}: ${i.itemName || i.name || JSON.stringify(i)}`), typeof n.onRowClick == "function" && n.onRowClick(i, r, e);
}, f = ({ container: e, dataset: t = [], columns: r = [], renderTable: i = null } = {}) => {
	let a = typeof e == "string" ? document.getElementById(e) : e;
	return a ? (n.init({
		container: a,
		dataset: t,
		columns: r,
		renderTable: i,
		onRowClick: d,
		onRowAction,
		onFooterSave,
		onSearch: onSearchCallback,
		setFeedback
	}), a.addEventListener("input", (e) => {
		let t = e.target;
		t.matches("input[type='search'], input[name='search'], [data-role='table-search'], #tableSearch, .table-search-input") && u(e, t);
	}), n) : (console.warn("[dom-table-events] Container element not found:", e), null);
}, p = { bindTableEvents: f };
t(p);
export { f as bindTableEvents, p as default };
