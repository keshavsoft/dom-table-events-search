import { table } from "dom-traversal-functions";
import state from "../state.js";

/**
 * Delegated body row click handler. Highlights selected row and emits record object.
 *
 * @param {Event} event - Click event.
 * @param {HTMLElement} matchElement - Clicked <tr> element.
 */
export const onRowClick = (event, matchElement) => {
    // If the click occurred directly on an interactive button or input, let the button handler process it
    if (event.target.tagName === "BUTTON" || event.target.closest("button") || event.target.tagName === "INPUT") {
        return;
    }

    const rowIndex = table.body.getRowIndex(matchElement);
    if (rowIndex < 0 || rowIndex >= state.dataset.length) return;

    state.selectedIndex = rowIndex;
    table.body.highlightRow(matchElement, "table-primary");

    const record = state.dataset[rowIndex];
    state.notifyFeedback(`Selected Row #${rowIndex + 1}: ${record.itemName || record.name || JSON.stringify(record)}`);

    if (typeof state.onRowClick === "function") {
        state.onRowClick(record, rowIndex, event);
    }
};

export default onRowClick;
