/**
 * Recursively locates the <tbody> spec node within any rendered JSON spec tree.
 */
const findTbodySpec = (node) => {
    if (!node) return null;
    if (node.tagName === "tbody") return node;
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const found = findTbodySpec(child);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Surgically repaints only the <tbody> element using window.ks down-layer instructions.
 *
 * @param {object} params
 * @param {HTMLTableSectionElement} params.currentTbody - Existing <tbody> DOM element.
 * @param {Array<object>} params.filteredRecords - Matching data rows.
 * @param {Array<object>} params.columns - Table column schema.
 * @param {object} [params.options={ serial: true }] - Table rendering options.
 */
export const repaintBody = ({
    currentTbody,
    filteredRecords,
    columns,
    options = { serial: true }
} = {}) => {
    if (!currentTbody) return;

    const ks = globalThis.window?.ks || globalThis.ks;
    const renderFunc = ks?.jsonRenderers?.runInstructions?.render?.renderFunc;
    const buildSpecElement = ks?.jsonToTag?.buildSpecElement;

    if (typeof renderFunc === "function" && typeof buildSpecElement === "function") {
        // If row action options are requested (e.g. showButton, edit, delete),
        // run through simple subKey so action buttons are generated on each row.
        const hasRowOptions = options && options.options && typeof options.options === "object";
        const instructionSubKey = hasRowOptions ? "simple" : "bodyOnly";

        const spec = renderFunc({
            instructionMainKey: "table",
            instructionSubKey,
            data: {
                data: filteredRecords,
                columns
            },
            options
        });

        const tbodySpec = findTbodySpec(spec);
        if (tbodySpec) {
            const newTbody = buildSpecElement(tbodySpec);
            if (newTbody) {
                currentTbody.replaceWith(newTbody);
            }
        }
    }
};

export default repaintBody;
