"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const REPORTS = [
  {
    id: 1,
    name: "Monthly Revenue Report",
    description: "Detailed breakdown of subscription revenue by store.",
    type: "Financial",
    lastGenerated: "2024-05-01",
    format: "CSV",
  },
  {
    id: 2,
    name: "User Acquisition",
    description: "New user signups, sources, and conversion rates.",
    type: "Growth",
    lastGenerated: "2024-05-01",
    format: "PDF",
  },
  {
    id: 3,
    name: "Store Performance",
    description: "Active stores, top selling categories, and churn.",
    type: "Operational",
    lastGenerated: "2024-04-28",
    format: "CSV",
  },
  {
    id: 4,
    name: "Application Logistics",
    description: "Average approval times and rejection reasons.",
    type: "Operational",
    lastGenerated: "2024-04-30",
    format: "PDF",
  },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<number | null>(null);

  const handleDownload = (id: number) => {
    setGenerating(id);
    // Simulate generation delay
    setTimeout(() => {
      alert(
        "Report generation is a simulated feature for this MVP. In production, this would trigger a server-side file generation."
      );
      setGenerating(null);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and download usage, financial, and operational reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} /> Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Generated</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REPORTS.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {report.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {report.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {report.type}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {report.lastGenerated}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono">
                  {report.format}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleDownload(report.id)}
                    disabled={generating === report.id}
                  >
                    {generating === report.id ? (
                      "Generating..."
                    ) : (
                      <>
                        <Download size={14} /> Download
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
