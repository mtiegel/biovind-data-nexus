
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, User } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// Table columns for Test Result Records
const tableColumns = [
  "Location",
  "MasterID (Key)",
  "Equipment Type",
  "Sample ID",
  "SampleDate",
  "Time",
  "Sample Type",
  "Collected by",
  "ReportedBy",
  "Sample Volume (mL)",
  "Comments",
  "Test type",
  "Test Value",
  "Test Value Units",
];

// Single sample table row as requested
const mockTableRows = [
  {
    "Location": "1",
    "MasterID (Key)": "94",
    "Equipment Type": "Vessel",
    "Sample ID": "01AP4",
    "SampleDate": "8/14/2024",
    "Time": "8:00AM PST",
    "Sample Type": "Planktonic",
    "Collected by": "Tom P.,  Mitchell R.",
    "ReportedBy": "EnhanceCo",
    "Sample Volume (mL)": "250",
    "Comments": "Dark Black Water",
    "Test type": "ATP (Free)",
    "Test Value": "2",
    "Test Value Units": "RLUs"
  }
];

import { newGraphHeaders, newGraphData } from "@/data/chartData";

// Map the newGraphData arrays to objects with keys from newGraphHeaders
const lineChartData = newGraphData.map(row => {
  const obj: Record<string, number> = {};
  newGraphHeaders.forEach((header, i) => {
    obj[header] = row[i];
  });
  return obj;
});

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [location, setLocation] = useState<string>("");

  // Get unique locations for the filter dropdown
  const uniqueLocations = [...new Set(mockTableRows.map(row => row.Location))];

  // Updated filter logic to include location
  const filteredRows = mockTableRows.filter((row) =>
    (!search ||
      row.Location.toLowerCase().includes(search.toLowerCase()) ||
      row["Sample ID"].toLowerCase().includes(search.toLowerCase()) ||
      row["Collected by"].toLowerCase().includes(search.toLowerCase()) ||
      row.ReportedBy.toLowerCase().includes(search.toLowerCase())) &&
    (!date || row.SampleDate === format(date, "yyyy-MM-dd")) &&
    (!location || row.Location === location)
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="inline w-6 h-6" /> Test Results Dashboard
      </h1>

      {/* --- Timeseries Chart --- */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chevron 3/2/25 - Sample 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 16, right: 32, left: 16, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Time" label={{ value: "Time", position: "insideBottomRight", offset: -8 }} />
                <YAxis 
                  label={{ value: "Value", angle: -90, position: "insideLeft", offset: 10 }}
                  tickCount={5}
                  interval="preserveStartEnd"
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine x={136} stroke="red" strokeWidth={2} />
                <Line type="monotone" dataKey="Ba1" stroke="#e11d48" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Ba2" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Ba3" stroke="#059669" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Yp1" stroke="#dc2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Yp2" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Yp3" stroke="#ea580c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Yp4" stroke="#0891b2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Ft" stroke="#ca8a04" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="CbA" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="CbB" stroke="#c2410c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Bru" stroke="#9333ea" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Ric" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Pox" stroke="#dc2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Bt" stroke="#7c2d12" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sa" stroke="#065f46" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Ba" stroke="#991b1b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Yp" stroke="#1e40af" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="IPC" stroke="#be185d" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="NTC" stroke="#374151" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Filters and Table --- */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by location, ID, or user"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    Location {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button
              variant="ghost"
              onClick={() => {
                setDate(undefined);
                setSearch("");
                setLocation("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Test Result Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <TableRow key={idx}>
                      {tableColumns.map((col) => (
                        <TableCell key={col}>{row[col] || ""}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} className="text-center text-sm text-muted-foreground">
                      No results found for the selected filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
