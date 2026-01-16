/**
 * Generates an image from the medication list using HTML5 Canvas
 */

export const ImageGenerator = {
    /**
     * Draws the list to a canvas
     * @param {Array} medicationList 
     * @param {HTMLCanvasElement} canvas 
     * @param {string} userName
     */
    generate(medicationList, canvas, userName) {
        const ctx = canvas.getContext('2d');
        const width = 800;
        const padding = 40;
        const headerHeight = 130;
        const itemHeight = 60;
        const footerHeight = 40;

        const totalHeight = headerHeight + (medicationList.length * itemHeight) + footerHeight + padding;

        canvas.width = width;
        canvas.height = totalHeight;

        // White Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, totalHeight);

        // Header
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(0, 0, width, headerHeight);

        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('Meus Medicamentos', width / 2, 50);

        // User Name
        ctx.font = '20px Inter, sans-serif';
        ctx.fillStyle = '#E0E7FF';
        ctx.fillText(`Paciente: ${userName || 'Não informado'}`, width / 2, 90);

        // List
        ctx.textAlign = 'left';
        let currentY = headerHeight + 50;

        medicationList.forEach((item, index) => {
            ctx.beginPath();
            ctx.arc(padding + 20, currentY - 10, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#2563EB';
            ctx.fill();

            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = '#1E293B';
            ctx.fillText(item.name, padding + 50, currentY);

            const nameWidth = ctx.measureText(item.name).width;
            ctx.font = '20px Inter, sans-serif';
            ctx.fillStyle = '#64748B';
            ctx.fillText(`(${item.dosage})`, padding + 60 + nameWidth, currentY);

            if (index < medicationList.length - 1) {
                ctx.beginPath();
                ctx.strokeStyle = '#E2E8F0';
                ctx.lineWidth = 1;
                ctx.moveTo(padding + 50, currentY + 20);
                ctx.lineTo(width - padding, currentY + 20);
                ctx.stroke();
            }

            currentY += itemHeight;
        });

        // Footer
        ctx.font = 'italic 14px Inter, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'center';
        const date = new Date().toLocaleDateString('pt-BR');
        ctx.fillText(`Gerado em ${date}`, width / 2, totalHeight - 15);
    },

    /**
     * Triggers download
     */
    download(canvas) {
        // Create a temporary link element
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        link.download = `medicamentos-${dateStr}.png`;

        // Convert canvas to data URL (PNG)
        // This is a standard base64 string "data:image/png;base64,..."
        // The browser handles this natively as a file download.
        link.href = canvas.toDataURL('image/png');

        // Trigger click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
