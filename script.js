// Configuration Object
let gridConfig = {
    rows: 8,
    columns: 10,
    defaultRowSpacingCM: 2,
    defaultColumnSpacingCM: 2,
    rowSpacings: {},
    columnSpacings: {}
};

// Conversion: cm to pixels (1cm = 37.8px)
const CM_TO_PX = 37.8;

// Load configuration from localStorage
function loadConfig() {
    const saved = localStorage.getItem('gridConfig');
    if (saved) {
        gridConfig = JSON.parse(saved);
        updateInputs();
    }
}

// Save configuration to localStorage
function saveConfig() {
    localStorage.setItem('gridConfig', JSON.stringify(gridConfig));
}

// Update input fields from config
function updateInputs() {
    document.getElementById('rows').value = gridConfig.rows;
    document.getElementById('columns').value = gridConfig.columns;
    document.getElementById('defaultRowSpacing').value = gridConfig.defaultRowSpacingCM;
    document.getElementById('defaultColumnSpacing').value = gridConfig.defaultColumnSpacingCM;
}

// Initialize spacing inputs
function initializeSpacingInputs() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const defaultRowSpacing = parseFloat(document.getElementById('defaultRowSpacing').value);
    const defaultColumnSpacing = parseFloat(document.getElementById('defaultColumnSpacing').value);

    // Initialize row spacings
    const rowContainer = document.getElementById('rowSpacingContainer');
    rowContainer.innerHTML = '';
    for (let i = 1; i <= rows; i++) {
        const value = gridConfig.rowSpacings[i] || defaultRowSpacing;
        const div = document.createElement('div');
        div.className = 'spacing-input-group';
        div.innerHTML = `
            <label for="row-${i}">Row ${i}</label>
            <input type="number" id="row-${i}" min="0.1" max="50" step="0.1" value="${value}">
        `;
        rowContainer.appendChild(div);
    }

    // Initialize column spacings
    const colContainer = document.getElementById('columnSpacingContainer');
    colContainer.innerHTML = '';
    for (let i = 1; i <= columns; i++) {
        const value = gridConfig.columnSpacings[i] || defaultColumnSpacing;
        const div = document.createElement('div');
        div.className = 'spacing-input-group';
        div.innerHTML = `
            <label for="col-${i}">Col ${i}</label>
            <input type="number" id="col-${i}" min="0.1" max="50" step="0.1" value="${value}">
        `;
        colContainer.appendChild(div);
    }
}

// Generate Grid Preview
function generateGrid() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);

    // Save current spacings
    gridConfig.rows = rows;
    gridConfig.columns = columns;
    gridConfig.defaultRowSpacingCM = parseFloat(document.getElementById('defaultRowSpacing').value);
    gridConfig.defaultColumnSpacingCM = parseFloat(document.getElementById('defaultColumnSpacing').value);

    // Collect row and column spacings
    for (let i = 1; i <= rows; i++) {
        const input = document.getElementById(`row-${i}`);
        if (input) {
            gridConfig.rowSpacings[i] = parseFloat(input.value);
        }
    }

    for (let i = 1; i <= columns; i++) {
        const input = document.getElementById(`col-${i}`);
        if (input) {
            gridConfig.columnSpacings[i] = parseFloat(input.value);
        }
    }

    saveConfig();
    renderGrid();
}

// Render Grid
function renderGrid() {
    const gridPreview = document.getElementById('gridPreview');
    const gridInfo = document.getElementById('gridInfo');
    gridPreview.innerHTML = '';

    const rows = gridConfig.rows;
    const columns = gridConfig.columns;
    const canvas = document.createElement('div');
    canvas.className = 'grid-canvas';

    let totalHeight = 0;
    let totalWidth = 0;

    // Create grid
    for (let r = 1; r <= rows; r++) {
        const rowHeight = (gridConfig.rowSpacings[r] || gridConfig.defaultRowSpacingCM) * CM_TO_PX;
        totalHeight += rowHeight;

        for (let c = 1; c <= columns; c++) {
            const colWidth = (gridConfig.columnSpacings[c] || gridConfig.defaultColumnSpacingCM) * CM_TO_PX;
            if (r === 1) totalWidth += colWidth;

            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.width = colWidth + 'px';
            cell.style.height = rowHeight + 'px';
            cell.title = `Row ${r}, Col ${c}`;
            canvas.appendChild(cell);
        }
    }

    gridPreview.appendChild(canvas);

    // Update grid info
    gridInfo.innerHTML = `
        <p><strong>Grid Dimensions:</strong> ${rows} rows × ${columns} columns</p>
        <p><strong>Canvas Size:</strong> ${(totalWidth / CM_TO_PX).toFixed(2)}cm × ${(totalHeight / CM_TO_PX).toFixed(2)}cm</p>
        <p><strong>Canvas Size (pixels):</strong> ${Math.round(totalWidth)}px × ${Math.round(totalHeight)}px</p>
        <p><strong>Total Cells:</strong> ${rows * columns}</p>
    `;
}

// Reset to Default
function resetConfig() {
    gridConfig = {
        rows: 8,
        columns: 10,
        defaultRowSpacingCM: 2,
        defaultColumnSpacingCM: 2,
        rowSpacings: {},
        columnSpacings: {}
    };
    saveConfig();
    updateInputs();
    initializeSpacingInputs();
    generateGrid();
}

// Export Configuration
function exportConfig() {
    const json = JSON.stringify(gridConfig, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "grid-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Download Grid as Image
function downloadGridAsImage() {
    const canvas = document.querySelector('.grid-canvas');
    if (!canvas) {
        alert('Please generate grid first!');
        return;
    }

    // Use html2canvas if available, otherwise alert
    alert('To download as image, take a screenshot or use browser developer tools.');
}

// Event Listeners
document.getElementById('rows').addEventListener('change', initializeSpacingInputs);
document.getElementById('columns').addEventListener('change', initializeSpacingInputs);
document.getElementById('generateBtn').addEventListener('click', generateGrid);
document.getElementById('resetBtn').addEventListener('click', resetConfig);
document.getElementById('exportBtn').addEventListener('click', exportConfig);
document.getElementById('downloadBtn').addEventListener('click', downloadGridAsImage);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initializeSpacingInputs();
    generateGrid();
});