import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const CHART_COLORS = [
  "#3E97FF", // primary blue
  "#50CD89", // success green
  "#F1416C", // danger red
  "#FFC700", // warning yellow
  "#7239EA", // purple
  "#009EF7", // info cyan
  "#E4E6EF", // light gray
  "#181C32", // dark
  "#F5F8FA", // lighter
  "#A1A5B7", // muted
];

export const SEVERITY_COLORS: Record<string, string> = {
  low: "#50CD89",
  medium: "#FFC700",
  high: "#F1416C",
  maximum: "#181C32",
  critical: "#7239EA",
};

export function formatNumber(n: number | undefined | null): string {
  if (n == null) return "0";
  return n.toLocaleString("es-GT");
}

export function formatPercentage(n: number | undefined | null): string {
  if (n == null) return "0%";
  return `${n.toFixed(1)}%`;
}

export function exportToPDF(
  title: string,
  columns: string[],
  rows: (string | number)[][],
  landscape = false,
) {
  const doc = new jsPDF({
    orientation: landscape ? "landscape" : "portrait",
    unit: "mm",
    format: "letter",
  });

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleString("es-GT")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [columns],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [62, 151, 255], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
  });

  doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportToExcel(
  title: string,
  sheets: { name: string; columns: string[]; rows: (string | number)[][] }[],
) {
  const wb = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const data = [sheet.columns, ...sheet.rows];
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Auto-size columns
    const colWidths = sheet.columns.map((col, i) => {
      const maxLen = Math.max(
        col.length,
        ...sheet.rows.map((r) => String(r[i] ?? "").length),
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }

  XLSX.writeFile(
    wb,
    `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

export function objectToRows(
  obj: Record<string, number | string> | undefined | null,
): [string, number | string][] {
  if (!obj) return [];
  return Object.entries(obj).map(([k, v]) => [k, v]);
}

export function arrayToRows(
  arr: { name: string; total: number }[] | undefined | null,
): [string, number][] {
  if (!arr) return [];
  return arr.map((item) => [item.name ?? "N/A", item.total]);
}
