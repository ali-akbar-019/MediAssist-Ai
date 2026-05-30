import api from "./api";
import type { APIResponse, Report } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, getSeverityInfo, getProbabilityInfo } from "../lib/utils";

interface ReportListResponse {
    reports: Report[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// Generate report from symptom
export const generateReport = async (symptomId: string): Promise<Report> => {
    const response = await api.post<APIResponse<Report>>(
        `/api/reports/generate/${symptomId}`
    );
    return response.data.data;
};

// Get all reports
export const getReports = async (
    page: number = 1,
    limit: number = 10
): Promise<ReportListResponse> => {
    const response = await api.get<APIResponse<ReportListResponse>>(
        "/api/reports",
        { params: { page, limit } }
    );
    return response.data.data;
};

// Get single report by reportId
export const getReportById = async (reportId: string): Promise<Report> => {
    const response = await api.get<APIResponse<Report>>(
        `/api/reports/${reportId}`
    );
    return response.data.data;
};

// Delete report
export const deleteReport = async (reportId: string): Promise<void> => {
    await api.delete(`/api/reports/${reportId}`);
};

// Download report as PDF
export const downloadReportAsPDF = (report: Report): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, pageWidth, 40, "F");

    // App name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("MediAssist AI", 14, 18);

    // Report title
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Medical Analysis Report", 14, 28);

    // Report ID and date
    doc.setFontSize(9);
    doc.text(`Report ID: ${report.reportId}`, 14, 36);
    doc.text(
        `Generated: ${formatDate(report.generatedAt)}`,
        pageWidth - 14,
        36,
        { align: "right" }
    );

    let yPos = 52;

    // Patient Information Section
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", 14, yPos);
    yPos += 8;

    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 6;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const patientData = [
        ["Name", report.patientInfo.name],
        ["Age", report.patientInfo.age?.toString() ?? "Not provided"],
        ["Gender", report.patientInfo.gender ?? "Not provided"],
        ["Blood Group", report.patientInfo.bloodGroup ?? "Not provided"],
    ];

    autoTable(doc, {
        startY: yPos,
        body: patientData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 50, textColor: [30, 58, 95] },
            1: { textColor: [60, 60, 60] },
        },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Symptom Details Section
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Symptom Details", 14, yPos);
    yPos += 8;

    doc.setDrawColor(16, 185, 129);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 4;

    const symptomData = [
        ["Body Part", report.symptomDetails.bodyPart],
        ["Pain Type", report.symptomDetails.painType],
        ["Severity", `${report.symptomDetails.severity}/10`],
        ["Duration", report.symptomDetails.duration],
        ["Worse At", report.symptomDetails.worseAt],
        [
            "Additional Notes",
            report.symptomDetails.additionalNotes ?? "None",
        ],
    ];

    autoTable(doc, {
        startY: yPos,
        body: symptomData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 50, textColor: [30, 58, 95] },
            1: { textColor: [60, 60, 60] },
        },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // AI Analysis Section
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("AI Analysis", 14, yPos);
    yPos += 8;

    doc.setDrawColor(16, 185, 129);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 6;

    // Severity Badge
    const severityInfo = getSeverityInfo(report.aiAnalysis.severity);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("Overall Severity:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(severityInfo.label, 60, yPos);
    yPos += 8;

    // Possible Conditions
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("Possible Conditions:", 14, yPos);
    yPos += 6;

    const conditionsData = report.aiAnalysis.possibleConditions.map((c) => [
        c.name,
        getProbabilityInfo(c.probability).label,
        c.description,
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["Condition", "Probability", "Description"]],
        body: conditionsData,
        theme: "striped",
        headStyles: {
            fillColor: [30, 58, 95],
            textColor: [255, 255, 255],
            fontSize: 10,
        },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: "auto" },
        },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

    // Recommendation
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(11);
    doc.text("Recommendation:", 14, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const recommendationLines = doc.splitTextToSize(
        report.aiAnalysis.recommendation,
        pageWidth - 28
    );
    doc.text(recommendationLines, 14, yPos);
    yPos += recommendationLines.length * 5 + 8;

    // Home Remedies
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(11);
    doc.text("Home Remedies:", 14, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    report.aiAnalysis.homeRemedies.forEach((remedy) => {
        doc.text(`• ${remedy}`, 18, yPos);
        yPos += 6;
    });
    yPos += 4;
    // Medicines to Consider
    if (report.aiAnalysis.medicinesToConsider && report.aiAnalysis.medicinesToConsider.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 95);
        doc.setFontSize(11);
        doc.text("Medicines to Consider:", 14, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        report.aiAnalysis.medicinesToConsider.forEach((medicine) => {
            doc.text(`• ${medicine.name} (${medicine.type})`, 18, yPos);
            yPos += 6;
        });
        yPos += 4;
    }

    // When to See Doctor
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(11);
    doc.text("When to See a Doctor:", 14, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const doctorLines = doc.splitTextToSize(
        report.aiAnalysis.whenToSeeDoctor,
        pageWidth - 28
    );
    doc.text(doctorLines, 14, yPos);
    yPos += doctorLines.length * 5 + 10;

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, "F");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text(
            "This report is generated by MediAssist AI and is not a substitute for professional medical advice.",
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 12,
            { align: "center" }
        );
        doc.text(
            `Developed by Ali Akbar, Laiba & Zainab | Page ${i} of ${totalPages}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 6,
            { align: "center" }
        );
    }

    // Save PDF
    doc.save(`MediAssist-Report-${report.reportId}.pdf`);
};