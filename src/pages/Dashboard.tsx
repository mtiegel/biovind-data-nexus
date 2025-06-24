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
  ResponsiveContainer
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

// Convert the new data to chart format with headers
const newGraphHeaders = ["Time","Ba1","Ba2","Ba3","Yp1","Yp2","Yp3","Yp4","Ft","CbA","CbB","Bru","Ric","Pox","Bt","Sa","Ba","Yp","CbA","IPC","NTC"];

// Updated time series data with all 20 columns
const newGraphData = [
  [7,90,42,18,37,46,21,29,53,70,30,101,41,20,26,37,65,44,55,184,58],
  [14,87,42,18,37,46,21,29,53,66,30,97,41,20,26,37,66,46,56,180,60],
  [21,86,43,18,37,46,21,29,53,64,30,96,41,20,26,37,67,46,56,178,61],
  [28,86,43,18,36,47,21,29,53,64,30,95,41,20,26,37,67,47,56,177,61],
  [35,85,43,18,36,47,20,29,53,63,30,95,41,20,26,38,67,46,57,177,62],
  [42,84,43,19,36,47,21,29,53,62,30,94,41,20,26,38,67,47,57,175,62],
  [49,84,43,19,37,47,21,29,53,62,30,93,41,20,26,38,68,48,58,174,63],
  [56,83,44,19,36,47,21,29,53,62,30,92,41,20,26,38,68,49,57,173,63],
  [63,83,44,19,36,47,21,29,53,61,30,92,41,20,26,38,68,48,58,172,64],
  [70,83,44,19,36,47,21,29,53,61,30,91,41,20,26,38,68,49,58,171,64],
  [77,82,44,19,36,47,21,29,53,60,30,91,41,20,26,38,68,49,59,170,65],
  [84,82,44,19,36,47,20,29,53,60,30,91,41,20,26,38,68,50,59,168,65],
  [91,82,44,19,36,47,21,29,53,60,30,90,41,20,26,38,68,49,58,167,65],
  [98,81,44,19,36,47,21,29,53,59,30,90,41,20,26,38,69,50,58,167,65],
  [105,81,44,19,36,47,21,29,53,59,30,90,41,20,26,38,69,50,58,167,65],
  [112,81,44,19,36,47,21,29,53,58,30,90,41,20,26,38,69,50,59,167,65],
  [119,81,44,19,36,48,21,29,53,58,30,90,41,20,26,38,69,50,59,167,66],
  [126,81,44,19,36,48,21,29,53,58,31,90,41,20,26,38,69,50,59,167,66],
  [133,82,44,19,36,48,21,29,53,58,30,90,41,20,26,38,69,50,59,167,66],
  [140,82,44,19,36,48,21,29,53,59,30,89,41,20,26,38,69,50,59,167,66],
  [147,82,44,19,36,48,21,29,53,58,30,89,42,20,26,38,69,50,59,167,66],
  [154,82,44,19,36,48,21,29,53,58,30,89,41,20,26,38,69,50,59,167,66],
  [161,82,44,19,36,48,21,29,53,59,30,89,41,20,26,38,69,50,59,167,66],
  [168,82,44,19,36,48,21,29,53,58,30,88,41,20,26,38,70,50,59,167,66],
  [175,82,44,19,36,48,21,29,53,59,30,88,42,20,26,38,69,50,59,167,66],
  [182,81,44,19,36,47,21,29,53,58,30,88,42,19,26,38,69,50,59,167,66],
  [189,81,44,19,36,47,21,29,53,58,30,88,41,20,25,38,69,50,59,167,67],
  [196,81,44,19,36,48,21,29,53,58,30,89,41,19,26,38,70,50,59,167,67],
  [203,81,44,19,36,47,21,29,53,58,30,89,41,19,26,38,69,51,59,168,66],
  [210,81,44,19,36,47,21,29,53,58,30,89,41,20,26,38,70,50,59,168,66],
  [217,81,44,19,36,47,21,29,53,58,30,89,41,20,26,38,70,50,59,168,66],
  [224,81,44,19,36,47,21,29,53,58,30,89,41,19,26,38,69,50,59,169,66],
  [231,81,44,19,36,47,21,29,53,58,30,89,41,20,26,38,69,50,59,168,66],
  [238,81,44,19,36,47,21,29,53,58,30,89,41,20,26,39,69,50,60,168,66],
  [245,82,44,19,37,47,21,29,53,58,31,89,41,20,26,39,69,50,59,169,66],
  [252,81,44,19,36,47,21,29,53,58,31,89,41,19,26,39,69,50,59,169,66],
  [259,81,44,19,36,47,21,29,53,58,30,89,41,19,26,39,69,50,59,169,66],
  [266,81,44,19,36,47,21,29,53,58,31,89,41,19,26,39,69,50,60,169,66],
  [273,81,44,19,36,47,21,28,53,58,31,89,41,19,26,39,69,50,60,170,66],
  [280,81,44,19,36,47,21,29,53,58,31,89,41,19,26,39,69,50,60,170,67],
  [287,81,44,19,36,47,21,28,53,58,31,89,41,19,26,39,69,50,60,170,65],
  [294,81,44,19,36,47,21,28,53,58,31,89,41,19,26,39,69,50,60,170,66],
  [301,81,44,19,37,47,21,29,53,58,30,88,41,19,26,39,69,50,58,170,66],
  [308,81,44,19,36,47,21,29,53,58,30,88,41,19,26,39,69,50,60,170,66],
  [315,81,44,19,36,47,21,29,53,58,30,88,41,19,26,39,69,50,59,170,66],
  [322,81,44,19,37,47,21,28,53,58,30,88,41,19,26,39,69,50,60,170,67],
  [329,81,44,19,37,46,21,28,53,58,30,88,41,19,26,38,69,50,60,171,66],
  [336,81,44,19,37,46,21,28,53,58,30,88,41,19,26,38,69,50,60,170,66],
  [343,81,44,19,37,46,21,28,53,58,30,88,41,19,26,38,69,50,59,170,66],
  [350,81,44,19,37,46,21,29,53,57,30,88,41,19,26,38,69,50,59,170,66],
  [357,81,44,19,37,46,21,28,53,58,30,88,41,19,26,38,69,50,59,170,66],
  [364,81,44,19,37,46,20,29,53,58,30,88,41,19,26,38,69,50,60,170,66],
  [371,81,44,19,37,46,20,29,53,58,30,88,41,19,26,38,68,50,59,170,65],
  [378,81,44,19,37,46,20,29,52,58,30,88,41,19,26,38,68,50,59,170,65],
  [385,81,44,19,37,46,20,28,53,58,30,89,41,19,25,38,68,50,59,170,63],
  [392,81,44,19,37,46,20,29,53,59,30,88,41,19,25,38,68,49,59,169,63],
  [399,81,44,19,37,46,20,29,52,58,30,89,41,19,26,38,68,49,59,170,63],
  [406,80,44,19,37,46,20,29,52,58,30,89,41,19,25,38,68,49,59,170,63],
  [413,80,44,19,37,46,20,28,53,58,30,89,41,19,25,38,68,49,59,170,64],
  [420,80,43,19,37,46,20,28,52,58,30,89,41,19,25,38,68,49,59,171,64],
  [427,80,44,19,37,45,20,28,53,58,30,89,40,19,25,38,68,49,59,170,63],
  [434,80,44,19,37,45,20,28,52,58,30,89,40,19,25,38,68,49,59,171,63],
  [441,80,44,19,37,45,20,28,53,58,30,90,40,19,25,38,68,49,59,171,64],
  [448,80,44,19,37,45,20,28,52,58,30,90,40,19,25,38,68,49,59,171,63],
  [455,80,44,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,59,171,64],
  [462,80,43,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,59,171,64],
  [469,81,43,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,59,171,64],
  [476,80,43,19,37,45,20,28,53,59,30,90,40,19,25,37,68,49,59,171,64],
  [483,80,43,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,59,170,64],
  [490,80,43,19,37,45,20,28,52,59,30,90,40,19,25,38,68,49,59,170,64],
  [497,80,43,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,58,170,63],
  [504,80,43,19,37,45,20,28,53,59,30,90,40,19,25,38,68,49,59,170,63],
  [511,80,43,19,37,45,20,28,53,60,30,90,40,19,25,38,68,49,59,170,63],
  [518,80,43,19,37,44,20,28,53,60,30,90,40,19,25,38,68,49,58,170,63],
  [525,80,43,19,37,44,20,28,53,60,30,90,40,19,25,37,67,49,58,170,63],
  [532,81,43,19,37,44,20,28,53,59,30,90,40,19,25,37,67,50,58,170,63],
  [539,81,43,19,37,45,20,28,53,60,30,90,40,19,25,37,67,49,58,170,63],
  [546,81,43,19,37,44,20,28,52,59,30,90,40,19,25,37,67,49,58,170,63],
  [553,81,43,19,37,44,19,28,52,60,30,90,40,19,25,37,67,48,58,170,62],
  [560,80,43,19,37,44,20,28,53,59,30,90,40,19,25,37,67,48,58,170,62],
  [567,80,43,18,37,44,20,28,52,60,30,90,41,19,25,38,67,48,58,170,63],
  [574,80,43,19,37,44,20,28,53,60,30,90,41,19,25,38,67,48,58,170,63],
  [581,80,43,19,37,44,20,28,52,60,30,91,41,19,25,38,67,49,58,171,63],
  [588,80,43,19,37,44,21,28,53,60,30,90,40,19,25,37,67,48,58,171,63],
  [595,80,43,19,37,44,20,28,52,59,30,91,41,19,25,37,67,49,58,171,63],
  [602,80,43,19,37,44,19,28,52,59,30,90,41,19,25,37,67,48,58,171,63],
  [609,80,43,19,36,44,21,28,53,59,30,90,41,19,25,37,67,49,58,171,63],
  [616,80,43,19,37,44,20,28,53,59,30,91,41,19,25,37,67,48,58,171,63],
  [623,80,43,19,36,44,19,28,52,59,30,90,41,19,25,38,67,49,57,171,63],
  [630,80,43,19,37,44,20,28,52,59,30,90,41,19,25,37,67,49,57,171,62],
  [637,80,43,19,37,44,21,28,52,59,30,91,41,19,25,38,67,48,57,171,62],
  [644,80,43,19,37,44,20,28,52,59,30,91,41,19,25,37,67,48,57,171,61],
  [651,79,43,19,36,44,20,28,52,59,30,90,40,19,25,37,67,49,57,171,61],
  [658,80,43,19,36,44,20,28,52,59,30,91,41,19,25,38,66,48,58,171,61],
  [665,79,43,18,36,44,20,28,52,59,30,91,41,19,25,37,66,49,57,171,61],
  [672,80,43,18,36,44,20,28,52,59,30,91,41,19,25,37,66,49,57,171,61],
  [679,79,43,18,36,44,21,28,52,59,30,90,40,19,25,38,66,49,57,171,61],
  [686,79,43,18,36,43,20,28,52,59,30,91,41,19,25,38,66,48,57,171,61],
  [693,79,43,18,36,43,20,28,52,59,30,91,40,19,25,37,66,48,57,171,61],
  [700,79,43,18,36,43,21,28,52,59,30,90,40,19,25,37,66,48,57,171,61],
  [707,79,43,18,36,43,20,28,52,59,30,90,41,19,25,38,66,48,57,171,62],
  [714,79,43,18,36,43,20,28,52,59,30,89,41,19,25,38,66,48,57,172,61],
  [721,79,43,18,36,43,20,28,52,59,30,89,41,19,25,37,67,48,57,171,61],
  [728,79,43,18,36,43,20,29,52,59,30,89,41,19,25,38,66,48,56,171,61],
  [735,79,43,18,36,43,20,27,52,59,30,89,41,19,25,37,66,48,56,172,62],
  [742,79,43,18,37,43,20,28,52,59,30,89,40,19,25,37,66,48,56,171,61],
  [749,79,43,18,37,43,20,28,52,59,30,89,40,19,25,37,66,48,56,171,61],
  [756,79,43,18,37,43,20,29,52,59,30,89,40,19,25,37,66,47,57,172,61],
  [763,79,43,18,36,43,20,28,52,59,30,89,40,19,25,37,66,48,56,172,61],
  [770,79,43,18,36,43,20,28,52,59,30,89,40,19,25,37,66,47,58,172,60],
  [777,79,42,18,36,43,20,29,52,58,30,89,40,19,25,37,66,47,56,172,60],
  [784,79,42,18,36,43,20,29,52,58,30,89,40,19,25,37,66,47,56,172,60],
  [791,79,43,18,36,43,20,28,52,59,30,89,40,19,25,37,66,47,56,172,61],
  [798,79,43,18,36,43,20,29,52,59,30,89,40,19,25,37,66,47,57,172,60],
];

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
          <CardTitle>Time Series Sample Values</CardTitle>
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
