export const bindTableEvents = ({
    container,
    data = [],
    columns = [],
    options = {}
} = {}) => {
    const root = typeof container === "string" ? document.getElementById(container) : container;
    if (!root) return;

    root.addEventListener("input", (event) => {
        const input = event.target;
        if (!input.matches("input[type='search'], input[name='search'], [data-role='table-search'], #tableSearch, .table-search-input")) {
            return;
        }

        const query = (input.value || "").trim().toLowerCase();
        const filtered = query
            ? data.filter(item =>
                Object.values(item).some(val =>
                    String(val ?? "").toLowerCase().includes(query)
                )
            )
            : data;

        const table = input.closest("table") || root.querySelector("table");
        const tbody = table?.querySelector("tbody");
        if (!tbody) return;

        const ks = globalThis.window?.ks || globalThis.ks;
        const renderFunc = ks?.jsonRenderers?.runInstructions?.render?.renderFunc;
        const buildSpecElement = ks?.jsonToTag?.buildSpecElement;

        if (typeof renderFunc === "function" && typeof buildSpecElement === "function") {
            const spec = renderFunc({
                instructionMainKey: "table",
                instructionSubKey: "bodyOnly",
                data: { data: filtered, columns },
                options
            });

            const tbodySpec = spec.tagName === "tbody" ? spec : (spec.children?.[0] || spec);
            const rowElements = (tbodySpec.children || []).map(rowSpec => buildSpecElement(rowSpec));
            tbody.replaceChildren(...rowElements);
        };
    });
};

export default bindTableEvents;
