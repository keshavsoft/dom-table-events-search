import { onSearch } from "./actions/onSearch.js";

/**
 * Binds search event delegation to the table container.
 * Completely stateless: keeps data and columns in the event closure,
 * drills down to the table's <tbody> on input, and swaps only the rows.
 *
 * @param {object} config
 * @param {string|HTMLElement} config.container - Root container ID or element.
 * @param {Array<object>} [config.data] - Data rows.
 * @param {Array<object>} [config.dataset] - Data rows (alias for data).
 * @param {Array<object>} [config.columns=[]] - Column definitions.
 * @param {object} [config.options={ serial: true }] - Rendering options.
 */
export const bindTableEvents = ({
    container,
    data,
    columns = [],
    options = { serial: true }
} = {}) => {
    const rootElement = typeof container === "string" ? document.getElementById(container) : container;

    if (!rootElement) {
        console.warn("[dom-table-events-search] Container element not found:", container);
        return;
    }

    const rows = data;

    // Delegated input listener for table search
    rootElement.addEventListener("input", (event) => {
        const input = event.target;
        if (input.matches("input[type='search'], input[name='search'], [data-role='table-search'], #tableSearch, .table-search-input")) {
            onSearch({
                input,
                rootElement,
                data: rows,
                columns,
                options
            });
        }
    });
};

export default bindTableEvents;
