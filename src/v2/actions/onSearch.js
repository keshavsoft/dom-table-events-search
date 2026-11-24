import { repaintBody } from "./repaintBody.js";

/**
 * Handles table search input event.
 * Filters data, drills down to the table's <tbody>, repaints in-place, and updates feedback badge.
 *
 * @param {object} params
 * @param {HTMLInputElement} params.input - Search input element.
 * @param {HTMLElement} params.rootElement - Table container element.
 * @param {Array<object>} params.data - Original dataset.
 * @param {Array<object>} params.columns - Table columns schema.
 * @param {object} [params.options] - Table options.
 */
export const onSearch = ({
    input,
    rootElement,
    data = [],
    columns = [],
    options = { serial: true }
} = {}) => {
    if (!input || !rootElement) return;

    const query = (input.value || "").trim().toLowerCase();

    // 1. Filter supplied data
    const filtered = query
        ? data.filter(item =>
            Object.values(item).some(val =>
                String(val ?? "").toLowerCase().includes(query)
            )
        )
        : data;

    // 2. Discover table and drill down to tbody
    const tableEl = input.closest("table") || rootElement.querySelector("table");
    const currentTbody = tableEl?.querySelector("tbody");

    // 3. Surgically repaint tbody
    if (currentTbody) {
        repaintBody({
            currentTbody,
            filteredRecords: filtered,
            columns,
            options
        });
    };
};

export default onSearch;
