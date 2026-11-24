import state from "./state.js";
import { onSearch } from "./actions/onSearch.js";
import { onRowClick } from "./actions/onRowClick.js";
import { onButtonClick } from "./actions/onButtonClick.js";

/**
 * Binds delegated table events to the main container.
 * Completely eliminates brittle ID dependencies by using semantic HTML delegation.
 *
 * @param {object} options
 * @param {string|HTMLElement} options.container - Root container ID or element.
 * @param {Array<object>} options.dataset - The backing table dataset.
 * @param {Array<object>} [options.columns=[]] - Column schema definitions.
 * @param {Function} [options.renderTable] - Callback to re-render the table with updated data.
 * @param {Function} [options.onRowClick] - Callback invoked when a body row is clicked.
 * @param {Function} [options.onRowAction] - Callback invoked when an action button is clicked (e.g. "show", "delete").
 * @param {Function} [options.onFooterSave] - Callback invoked when a footer save button is clicked.
 * @param {Function} [options.onSearch] - Callback invoked on search query input.
 * @param {Function} [options.setFeedback] - Custom feedback message handler.
 * @returns {object} - Active state manager instance.
 */
export const bindTableEvents = ({
    container,
    dataset = [],
    columns = [],
    renderTable = null,
} = {}) => {
    const rootElement = typeof container === "string" ? document.getElementById(container) : container;

    if (!rootElement) {
        console.warn("[dom-table-events] Container element not found:", container);
        return null;
    }

    // Initialize reactive state
    state.init({
        container: rootElement,
        dataset,
        columns,
        renderTable,
        onRowClick,
        onRowAction,
        onFooterSave,
        onSearch: onSearchCallback,
        setFeedback
    });
    // Delegated input listener for table search
    rootElement.addEventListener("input", (event) => {
        const input = event.target;
        if (input.matches("input[type='search'], input[name='search'], [data-role='table-search'], #tableSearch, .table-search-input")) {
            onSearch(event, input);
        }
    });

    return state;
};

export default bindTableEvents;
