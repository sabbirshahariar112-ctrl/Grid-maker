// Configuration
let gridConfig = {
    rows: 8,
    columns: 10,
    defaultRowSpacing: 2,
    defaultColumnSpacing: 2,
    cellValues: {},
    lineColor: '#000000',
    lineWidth: 1,
    bgColor: '#ffffff',
    showLabels: true
};

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
    document.getElementById('defaultRowSpacing').value = gridConfig.defaultRowSpacing;
    document.getElementById('defaultColumnSpacing').value = gridConfig.defaultColumnSpacing;
    document.getElementById('lineColor').value = gridConfig.lineColor;
    document.getElementById('lineWidth').value = gridConfig.lineWidth;
    document.getElementById('bgColor').value = gridConfig.bgColor;
    document.getElementById('showLabels').checked = gridConfig.showLabels;
}

// Generate Grid
function generateGrid() {
    // Get values
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const rowHeight = parseFloat(document.getElementById('defaultRowSpacing').value) * CM_TO_PX;
    const colWidth = parseFloat(document.getElementById('defaultColumnSpacing').value) * CM_TO_PX;
    const lineColor = document.getElementById('lineColor').value;
    const lineWidth = parseFloat(document.getElementById('lineWidth').value);
    const bgColor = document.getElementById('bgColor').value;
    const showLabels = document.getElementById('showLabels').checked;

    // Save config
    gridConfig.rows = rows;
    gridConfig.columns = columns;
    gridConfig.defaultRowSpacing = parseFloat(document.getElementById('defaultRowSpacing').value);
    gridConfig.defaultColumnSpacing = parseFloat(document.getElementById('defaultColumnSpacing').value);
    gridConfig.lineColor = lineColor;
    gridConfig.lineWidth = lineWidth;
    gridConfig.bgColor = bgColor;
    gridConfig.showLabels = showLabels;
    saveConfig();

    // Generate HTML
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    gridContainer.style.backgroundColor = bgColor;

    let html = '';
    for (let r = 1; r <= rows; r++) {
        html += '<div class="grid-row">';
        for (let c = 1; c <= columns; c++) {
            const label = String.fromCharCode(64 + c) + r; // A1, B1, etc.
            const cellValue = gridConfig.cellValues[label] || '';
            html += `<div class="grid-cell" style="width: ${colWidth}px; height: ${rowHeight}px; border-right: ${lineWidth}px solid ${lineColor}; border-bottom: ${lineWidth}px solid ${lineColor};" data-cell="${label}">`;
            if (showLabels) {
                html += `<span class="cell-label">${label}</span>`;
            }
            if (cellValue) {
                html += `<span class="cell-value">${cellValue}</span>`;
            }
            html += '</div>';
        }
        html += '</div>';
    }
    gridContainer.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const label = cell.dataset.cell;
            const currentValue = gridConfig.cellValues[label] || '';
            const newValue = prompt(`Enter value for ${label}:`, currentValue);
            if (newValue !== null) {
                if (newValue === '') {
                    delete gridConfig.cellValues[label];
                } else {
                    gridConfig.cellValues[label] = newValue;
                }
                saveConfig();
                generateGrid();
                updateCellValuesDisplay();
            }
        });
    });

    // Update info
    const totalWidth = (colWidth * columns) / CM_TO_PX;
    const totalHeight = (rowHeight * rows) / CM_TO_PX;
    document.getElementById('gridDimensions').textContent = `${rows} × ${columns}`;
    document.getElementById('gridStats').innerHTML = `
        <strong>Grid:</strong> ${rows}R × ${columns}C | 
        <strong>Size:</strong> ${totalWidth.toFixed(1)}cm × ${totalHeight.toFixed(1)}cm | 
        <strong>Cells:</strong> ${rows * columns}
    `;

    updateCellValuesDisplay();
}

// Update cell values display
function updateCellValuesDisplay() {
    const container = document.getElementById('cellValuesContainer');
    const values = Object.entries(gridConfig.cellValues);
    
    if (values.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 0.85em;">Click on grid cells to add values</p>';
        return;
    }

    container.innerHTML = values.map(([cell, value]) => `
        <div style="padding: 8px; background: white; border-radius: 4px; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #667eea;">${cell}:</span>
            <span style="color: #333;">${value}</span>
            <button onclick="deleteCellValue('${cell}')" style="background: #ff6b6b; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer; font-size: 0.75em;">✕</button>
        </div>
    `).join('');
}

// Delete cell value
window.deleteCellValue = function(cell) {
    delete gridConfig.cellValues[cell];
    saveConfig();
    generateGrid();
    updateCellValuesDisplay();
};

// Print Grid
function printGrid() {
    window.print();
}

// Download as PDF
function downloadPDF() {
    const element = document.getElementById('gridContainer');
    const opt = {
        margin: 10,
        filename: 'grid-maker-pro.pdf',
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
}

// Reset Grid
function resetGrid() {
    if (confirm('Are you sure you want to reset all settings?')) {
        gridConfig = {
            rows: 8,
            columns: 10,
            defaultRowSpacing: 2,
            defaultColumnSpacing: 2,
            cellValues: {},
            lineColor: '#000000',
            lineWidth: 1,
            bgColor: '#ffffff',
            showLabels: true
        };
        saveConfig();
        updateInputs();
        generateGrid();
    }
}

// Image Upload
function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');

    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(102, 126, 234, 0.2)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
        handleImageUpload(e.dataTransfer.files[0]);
    });

    imageInput.addEventListener('change', (e) => {
        handleImageUpload(e.target.files[0]);
    });
}

function handleImageUpload(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('gridContainer');
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; height: auto; opacity: 0.3; position: absolute; top: 0; left: 0;">`;
            preview.style.position = 'relative';
            generateGrid();
        };
        reader.readAsDataURL(file);
    }
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', generateGrid);
    document.getElementById('printBtn').addEventListener('click', printGrid);
    document.getElementById('pdfBtn').addEventListener('click', downloadPDF);
    document.getElementById('resetBtn').addEventListener('click', resetGrid);

    document.getElementById('rows').addEventListener('change', generateGrid);
    document.getElementById('columns').addEventListener('change', generateGrid);
    document.getElementById('defaultRowSpacing').addEventListener('change', generateGrid);
    document.getElementById('defaultColumnSpacing').addEventListener('change', generateGrid);
    document.getElementById('lineColor').addEventListener('change', generateGrid);
    document.getElementById('lineWidth').addEventListener('change', generateGrid);
    document.getElementById('bgColor').addEventListener('change', generateGrid);
    document.getElementById('showLabels').addEventListener('change', generateGrid);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    setupEventListeners();
    setupImageUpload();
    generateGrid();
});