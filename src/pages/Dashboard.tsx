
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, User } from "lucide-react";
import { format } from "date-fns";
import {
  ChartContainer,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const mockResults = [
  {
    id: 1,
    device: "Device A",
    user: "Jane Smith",
    date: new Date("2025-05-01"),
    location: "Houston",
    sampleId: "S-001",
    summary: "Positive",
    signal: [10, 15, 22, 35, 45, 40, 38],
    time: ["0", "5", "10", "15", "20", "25", "30"],
  },
  {
    id: 2,
    device: "Device B",
    user: "Mark Jones",
    date: new Date("2025-05-02"),
    location: "Dallas",
    sampleId: "S-002",
    summary: "Negative",
    signal: [9, 10, 10, 11, 11, 10, 10],
    time: ["0", "5", "10", "15", "20", "25", "30"],
  },
];

// Prepare mock chart data
function prepareChartData(result: (typeof mockResults)[0]) {
  return result.time.map((t, i) => ({
    time: t,
    signal: result.signal[i],
  }));
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [selectedResult, setSelectedResult] = useState(mockResults[0]);

  // Filtered results
  const filtered = mockResults.filter(r =>
    (!search || r.user.toLowerCase().includes(search.toLowerCase()) || r.device.toLowerCase().includes(search.toLowerCase())) &&
    (!date || format(r.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="inline w-6 h-6" /> Test Results Dashboard
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by user or device"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {date ? format(date, "PPP") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={() => { setDate(undefined); setSearch(""); }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={filtered[0]?.id.toString() || ""} onValueChange={v => {
        const found = mockResults.find(r => r.id.toString() === v);
        if (found) setSelectedResult(found);
      }}>
        <TabsList>
          {filtered.map(result => (
            <TabsTrigger key={result.id} value={result.id.toString()}>
              {result.device} - {result.user}
            </TabsTrigger>
          ))}
        </TabsList>
        {filtered.map(result => (
          <TabsContent key={result.id} value={result.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>
                  Sample {result.sampleId} &mdash; {format(result.date, "PPP")}
                </CardTitle>
                <div className="text-muted-foreground text-sm">
                  Device: {result.device} | User: {result.user} | Location: {result.location}
                </div>
                <div className="mt-2 font-semibold">
                  <span className={`px-2 py-1 rounded ${result.summary === "Positive" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                    {result.summary}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">Signal (Line Graph)</h3>
                <div className="w-full" style={{ minHeight: 220 }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={prepareChartData(result)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="signal"
                        stroke={result.summary === "Positive" ? "#dc2626" : "#059669"}
                        dot
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        {filtered.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            No results found for the selected filter.
          </div>
        )}
      </Tabs>
    </div>
  );
}
