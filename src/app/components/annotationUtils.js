import { saveAs } from 'file-saver';
import { renderPDF } from 'pdfjs-dist';

export function renderPDFToCanvas(pdfData, canvasElement) {
    const loadingTask = renderPDF.getDocument(pdfData);
    loadingTask.promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = canvasElement;
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
        });
    });
}

export const annotationCategories = {
    defect: { color: '#FF4444', label: 'Defect' },
    nonConformance: { color: '#FF8C00', label: 'Non-Conformance' },
    safety: { color: '#FFFF00', label: 'Safety' },
    observation: { color: '#4169E1', label: 'Observation' },
    other: { color: '#800080', label: 'Other' },
};

export function addPinToCanvas(canvas, x, y, category) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = annotationCategories[category].color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

export function exportAnnotationsToWord(annotations) {
    const docContent = annotations.map((annotation) => `
        <p>Category: ${annotation.category}</p>
        <p>Comment: ${annotation.comment}</p>
        <p>Coordinates: (${annotation.x}, ${annotation.y})</p>
    `).join('');
    const blob = new Blob([docContent], { type: 'application/msword' });
    saveAs(blob, 'annotations.doc');
}
