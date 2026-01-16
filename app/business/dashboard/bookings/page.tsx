import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

// Mock Data for MVP - In real app, fetch from `bookings` table
const BOOKINGS = [
  //   { id: 1, customer: "Alice Perera", service: "Hair Cut & Style", time: "10:00 AM", date: "Today", status: "confirmed" },
  //   { id: 2, customer: "Bob Silva", service: "Beard Trim", time: "11:30 AM", date: "Today", status: "pending" },
];

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">
          Manage your upcoming appointments.
        </p>
      </div>

      {BOOKINGS.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-lg bg-muted/10">
          <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium">No bookings yet</h3>
          <p className="text-muted-foreground max-w-sm text-center mt-2">
            Your upcoming appointments will appear here once customers start
            booking via WhatsApp.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* List would go here */}
          <div className="p-4 border rounded-lg">
            Mock List Implementation Pending
          </div>
        </div>
      )}
    </div>
  );
}
