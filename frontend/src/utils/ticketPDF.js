import jsPDF from 'jspdf';
import QRCode from 'qrcode';


const DEFAULT_VIDEO = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export async function generateTicketPDF(ticket) {
    // reading this comment, can you guess what the link leads to?
    const videoUrl = DEFAULT_VIDEO;

    // Generate QR code as a base64 data URL
    const qrDataUrl = await QRCode.toDataURL(videoUrl, {
        width: 200,
        margin: 1,
        color: {
            dark: '#1a1a2e',
            light: '#ffffff'
        }
    });

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ── Background ──────────────────────────────────────────────────────────
    doc.setFillColor(15, 23, 42); // dark navy
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // ── Header band ─────────────────────────────────────────────────────────
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Brand name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('TravelLink', 20, 22);

    // Ticket label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('BOARDING PASS', 20, 32);

    // Ticket ID top right
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`#${String(ticket.id).padStart(6, '0')}`, pageWidth - 20, 22, { align: 'right' });
    doc.text(new Date(ticket.purchased_at).toLocaleDateString('en-GB'), pageWidth - 20, 30, { align: 'right' });

    // ── Route section ────────────────────────────────────────────────────────
    const routeY = 65;

    // Origin city
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(ticket.origin, 20, routeY);

    // Arrow
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139);
    doc.text('>>', pageWidth / 2, routeY, { align: 'center' });

    // Destination city
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(ticket.destination, pageWidth - 20, routeY, { align: 'right' });

    // Transport type badge
    const transportLabel = ticket.transport_type.charAt(0).toUpperCase() + ticket.transport_type.slice(1);
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth / 2 - 15, routeY + 6, 30, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(transportLabel.toUpperCase(), pageWidth / 2, routeY + 11.5, { align: 'center' });

    // ── Dashed separator ─────────────────────────────────────────────────────
    doc.setDrawColor(51, 65, 85);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(20, routeY + 22, pageWidth - 20, routeY + 22);
    doc.setLineDashPattern([], 0);

    // ── Detail fields ────────────────────────────────────────────────────────
    const detailY = routeY + 36;
    const col1 = 20;
    const col2 = pageWidth / 2 + 10;

    const drawDetail = (label, value, x, y) => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), x, y);

        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(value, x, y + 7);
    };

    drawDetail('Passenger', ticket.passenger_full_name, col1, detailY);
    drawDetail('Seat', ticket.seat_number, col2, detailY);

    drawDetail(
        'Date',
        new Date(ticket.departure_date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        }),
        col1,
        detailY + 22
    );

    drawDetail(
        'Departure',
        ticket.departure_time
            ? ticket.departure_time.slice(0, 5)
            : 'See operator',
        col2,
        detailY + 22
    );

    drawDetail('Price paid', `${parseFloat(ticket.final_price).toFixed(2)} SEK`, col1, detailY + 44);
    drawDetail('Transport', transportLabel, col2, detailY + 44);

    // ── Second dashed separator ───────────────────────────────────────────────
    doc.setDrawColor(51, 65, 85);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(20, detailY + 58, pageWidth - 20, detailY + 58);
    doc.setLineDashPattern([], 0);

    // ── QR code section ───────────────────────────────────────────────────────
    const qrY = detailY + 68;
    const qrSize = 45;
    const qrX = pageWidth / 2 - qrSize / 2;

    // QR background card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 3, 3, 'F');

    // QR image
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // QR label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Scan for destination guide', pageWidth / 2, qrY + qrSize + 14, { align: 'center' });

    // ── Footer ────────────────────────────────────────────────────────────────
    doc.setFillColor(30, 41, 59);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('This ticket is valid for one journey. Please present at boarding.', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // ── Save ──────────────────────────────────────────────────────────────────
    const filename = `TravelLink_${ticket.origin}_${ticket.destination}_${ticket.seat_number}.pdf`;
    doc.save(filename);
}