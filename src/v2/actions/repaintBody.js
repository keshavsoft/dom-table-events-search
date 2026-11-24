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
        const spec = renderFunc({
            instructionMainKey: "table",
            instructionSubKey: "bodyOnly",
            data: {
                data: filteredRecords,
                columns
            },
            options
        });

        const tbodySpec = spec?.children?.find(child => child.tagName === "tbody") || spec;
        const newTbody = buildSpecElement(tbodySpec);

        if (newTbody) {
            currentTbody.replaceWith(newTbody);
        }
    }
};

export default repaintBody;
