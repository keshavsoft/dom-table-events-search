import { table } from "dom-traversal-functions";
import state from "../state.js";

/**
 * Delegated button action dispatcher with switch-case mechanics.
 * Handles row action buttons ("show", "delete") and footer action buttons ("save")
 * cleanly through a unified container-level dispatcher.
 *
 * @param {Event} event - Click event.
 * @param {HTMLButtonElement} button - Clicked button element.
 */
export const onButtonClick = (event, button) => {
    event.stopPropagation();

    const action = (button.textContent || "").trim().toLowerCase() ||
                   button.dataset.action ||
                   "click";

    switch (action) {
        case "show":
        case "view": {
            const rowIndex = table.body.getRowIndex(button);
            if (rowIndex < 0 || rowIndex >= state.dataset.length) return;

            state.selectedIndex = rowIndex;
            table.body.highlightRow(button, "table-primary");

            const record = state.dataset[rowIndex];
            state.notifyFeedback(`Action [Show] on Row #${rowIndex + 1}: ${record.itemName || record.name || ""}`);

            if (typeof state.onRowAction === "function") {
                state.onRowAction("show", record, rowIndex, event);
            }
            break;
        }

        case "save": {
            const newRecord = table.footer.getFooterData(button, state.columns);

            if (Object.values(newRecord).some(v => v.length > 0)) {
                table.footer.clearRowInputs(button);
                state.dataset.push(newRecord);

                if (typeof state.renderTable === "function") {
                    state.renderTable(state.dataset);
                }

                state.notifyFeedback(`Added new record: "${newRecord.itemName || newRecord.name || ""}"! Total: ${state.dataset.length}.`);

                if (typeof state.onFooterSave === "function") {
                    state.onFooterSave(newRecord, event);
                }
            } else {
                state.notifyFeedback("Please enter values into footer row inputs before saving.");
            }
            break;
        }

        case "delete":
        case "remove": {
            const rowIndex = table.body.getRowIndex(button);
            if (rowIndex >= 0 && rowIndex < state.dataset.length) {
                const deletedRecord = state.dataset.splice(rowIndex, 1)[0];

                if (typeof state.renderTable === "function") {
                    state.renderTable(state.dataset);
                }

                state.notifyFeedback(`Deleted record at row #${rowIndex + 1}.`);

                if (typeof state.onRowAction === "function") {
                    state.onRowAction("delete", deletedRecord, rowIndex, event);
                }
            }
            break;
        }

        default: {
            const rowIndex = table.body.getRowIndex(button);
            const record = (rowIndex >= 0 && rowIndex < state.dataset.length) ? state.dataset[rowIndex] : null;

            if (typeof state.onRowAction === "function") {
                state.onRowAction(action, record, rowIndex, event);
            }
            break;
        }
    }
};

export default onButtonClick;
