import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export async function generateTicketPDF(ticket) {
    const qrDataUrl = await QRCode.toDataURL(VIDEO_URL, {
        width: 200,
        margin: 1,
        color: { dark: '#1a1a2e', light: '#ffffff' }
    });

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const hasReturn = !!ticket.return_date;

    // ── Helper: draw a full ticket page ───────────────────────────────────
    const drawTicketPage = (
        origin,
        destination,
        departureDate,
        departureTime,
        passengerName,
        seatNumber,
        priceDisplay,
        transportType,
        label
    ) => {
        const transportLabel = transportType
            ? transportType.charAt(0).toUpperCase() + transportType.slice(1)
            : 'Unknown';

        // Background
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Header band
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('TravelLink', 20, 20);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('BOARDING PASS', 20, 30);

        // Ticket label top right (OUTBOUND / RETURN)
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label, pageWidth - 20, 20, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`#${String(ticket.id).padStart(6, '0')}`, pageWidth - 20, 28, { align: 'right' });

        // Route display
        const routeY = 62;

        doc.setFontSize(30);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(origin, 20, routeY);

        doc.setFontSize(20);
        doc.setTextColor(100, 116, 139);
        doc.text('>>', pageWidth / 2, routeY, { align: 'center' });

        doc.setFontSize(30);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(destination, pageWidth - 20, routeY, { align: 'right' });

        // Transport badge
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(pageWidth / 2 - 16, routeY + 5, 32, 8, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(transportLabel.toUpperCase(), pageWidth / 2, routeY + 10.5, { align: 'center' });

        // Dashed separator
        doc.setDrawColor(51, 65, 85);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(20, routeY + 20, pageWidth - 20, routeY + 20);
        doc.setLineDashPattern([], 0);

        // Detail fields
        const detailY = routeY + 34;
        const col1 = 20;
        const col2 = pageWidth / 2 + 10;

        const drawDetail = (lbl, val, x, y) => {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            doc.text(lbl.toUpperCase(), x, y);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(String(val), x, y + 7);
        };

        drawDetail('Passenger', passengerName,             col1, detailY);
        drawDetail('Seat',      seatNumber,                col2, detailY);
        drawDetail('Date',
            new Date(departureDate).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric'
            }),                                            col1, detailY + 20);
        drawDetail('Departure',
            departureTime ? departureTime.slice(0, 5) : '--:--',
                                                           col2, detailY + 20);
        drawDetail('Price paid', `${parseFloat(priceDisplay).toFixed(2)} SEK`,
                                                           col1, detailY + 40);
        drawDetail('Transport', transportLabel,            col2, detailY + 40);

        // Second dashed separator
        doc.setDrawColor(51, 65, 85);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(20, detailY + 54, pageWidth - 20, detailY + 54);
        doc.setLineDashPattern([], 0);

        // QR code — same on both pages
        const qrSize = 44;
        const qrX = pageWidth / 2 - qrSize / 2;
        const qrY = detailY + 64;

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 3, 3, 'F');
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Scan upon boarding or show as proof of payment.', pageWidth / 2, qrY + qrSize + 8, { align: 'center' });

        // Footer band
        doc.setFillColor(30, 41, 59);
        doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text(
            'Please present at boarding.',
            pageWidth / 2, pageHeight - 7, { align: 'center' }
        );
    };

    // ── Page 1: Outbound ──────────────────────────────────────────────────
    // Price for outbound: if return, show half of total (each leg = half)
    // if one way, show full final_price
    const outboundPrice = hasReturn
        ? parseFloat(ticket.final_price) / 2
        : parseFloat(ticket.final_price);

    drawTicketPage(
        ticket.origin,
        ticket.destination,
        ticket.departure_date,
        ticket.departure_time,
        ticket.passenger_full_name,
        ticket.seat_number,
        outboundPrice,
        ticket.transport_type,
        'OUTBOUND'
    );

    // ── Page 2: Return (if applicable) ───────────────────────────────────
    if (hasReturn) {
        doc.addPage();

        drawTicketPage(
            ticket.destination,    // inverted
            ticket.origin,         // inverted
            ticket.return_date,
            ticket.return_time || '--:--',
            ticket.passenger_full_name,
            ticket.seat_number,    // same seat
            parseFloat(ticket.final_price) / 2,
            ticket.transport_type,
            'RETURN'
        );
    }

    // ── Save ──────────────────────────────────────────────────────────────
    const filename = `TravelLink_${ticket.origin}_${ticket.destination}_${ticket.seat_number}.pdf`;
    doc.save(filename);
}