import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Main dashboard mock data with all new columns
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

// Rep sample table rows remain unchanged
const mockTableRows = [
  // ... keep existing code (mockTableRows) the same ...
];

// ---------------------------------
// Sample timeseries mock data
// ---------------------------------
const mockSeriesHeaders = [
  "No DNA 1",
  "No DNA 2",
  "No DNA 3",
  "No DNA 4",
  "PA 1",
  "PA 2",
  "PA 3",
  "PA 4"
];
const mockSeriesData = [
  [3655.566, -3156.875, 112.265, -4689.5, 8424.333, 7082.866, 7994.614, -4370.156],
  [1907.034, -2205.656, -564.576, -3043.188, 5529.884, 4215.032, 5384.364, -2725.094],
  [542.362, 0, -207.261, 0, 3469.185, 2657.792, 3553.208, 0],
  [-216.514, 1654.781, -912.853, 2332.344, 1417.673, 1044.458, 2017.176, 2444.313],
  [-423.514, 3694.531, -1374.413, 4488.781, -246.995, -502.595, 415.238, 4692.313],
  [-239.546, 5678.281, -1040.067, 7388.719, -2470.725, -1649.178, -817.200, 7324.75],
  [287.141, 9098.438, 92.404, 10984.5, -2400.111, -2909.544, -1509.856, 10282.156],
  [-36.688, 12257.906, 991.031, 14649.5, -1374.967, -1532.596, -1106.263, 14918.594],
  [8.827, 15031.094, 1320.096, 17435.469, -236.978, 3.039, 62.643, 18995.938],
  [-149.048, 17268.281, 1452.035, 19863.188, 577.885, 492.83, -162.545, 22696.438],
  [235.389, 19009.969, 1024.381, 22785.375, 622.436, 731.183, -20.202, 26329.719],
  [-8.409, 21866.469, 810.884, 24831.813, 195.237, 1063.662, -746.546, 30069.563],
  [-111.034, 23943.969, 778.136, 27168.031, -54.587, -285.172, -609.702, 33738.438],
  [116.59, 26639.938, 157.232, 29577.281, -288.629, -225.412, -1117.453, 37960.25],
  [54.73, 28475.563, -397.735, 32189.125, -38.422, 349.035, -1234.672, 42196.156],
  [314.276, 31087.875, -855.357, 34736.094, -63.496, 131.202, -96.953, 45602.469],
  [1135.198, 32711.219, -1838.511, 36762.781, -290.07, -188.976, -525.922, 49928.125],
  [1682.119, 35018.563, -2587.978, 39343.188, 310.137, 387.565, -326.11, 55034.969],
  [2706.697, 37637.125, -1813.507, 41773.781, 406.407, 117.2, -36.111, 58813.125],
  [3248.868, 40016.688, -813.567, 43999.375, -246.573, -462.228, -461.486, 62413.125],
  [3596.789, 42114.0, -442.128, 46815.5, -370.335, 331.407, -1127.143, 67230.719],
  [3639.992, 44133.844, 273.531, 49845.656, 505.56, 231.917, -375.268, 71979.969],
  [4384.788, 46882.406, 558.283, 52458.563, 299.705, 1011.333, -76.612, 74897.156],
  [5033.928, 50272.563, 1420.129, 55911.188, -567.338, 568.156, 620.294, 78794.188],
  [5832.35, 53517.156, 1417.006, 58535.688, 143.525, 306.165, 1038.95, 83382.5],
  [6076.802, 55556.25, 1509.602, 61038.656, 895.233, -590.512, 380.106, 88150.188],
  [6241.723, 58842.188, 2766.073, 64757.938, 214.315, -340.065, 793.262, 91919.938],
  [6825.395, 62221.75, 2833.076, 67835.156, -408.072, -155.711, 136.167, 94734.219],
  [7358.222, 64866.625, 4047.89, 70949.375, -308.396, 264.392, 359.105, 98416.344],
  [8103.394, 67723.875, 4666.549, 73864.813, -83.657, -849.348, 762.635, 103689.063],
  [9330.783, 69759.719, 5508.551, 76997.094, 26.769, -820.432, 211.26, 106906.188],
  [9772.143, 73210.125, 5816.209, 79745.844, 177.195, 688.703, 359.854, 110905.625],
  [9835.782, 76666.781, 6856.181, 82491.781, 1182.121, 1455.62, 1017.728, 115490.813],
  [10266.704, 79788.313, 7926.464, 86365.813, 4153.672, 2564.254, 2711.353, 119194.813],
  [11089.188, 82501.063, 8010.06, 89426.406, 10380.504, 5622.327, 8399.29, 122987.313],
  [11966.39, 85513.094, 9291.031, 91905.5, 24980.586, 13854.212, 26150.602, 127347.563],
  [12193.218, 88148.0, 10366.221, 95743.531, 60966.355, 33899.129, 70441.539, 131287.5],
  [12395.139, 91049.75, 10490.379, 99062.5, 142005.781, 77462.891, 170470.125, 135391.938],
  [12733.436, 93293.438, 11454.101, 102140.594, 295109.063, 167260.266, 362830.781, 139595.938],
  [13434.513, 95815.969, 11618.478, 105666.656, 485970.188, 290918.906, 605999.75, 144607.5],
];

// Convert series data to array of objects for Recharts
const lineChartData = mockSeriesData.map((row, idx) => {
  const obj: Record<string, number | string> = { Time: idx + 1 };
  mockSeriesHeaders.forEach((header, i) => {
    obj[header] = row[i];
  });
  return obj;
});

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  // Simple filter for table rows demo (location, sample id, or collected/Reported by)
  const filteredRows = mockTableRows.filter((row) =>
    (!search ||
      row.Location.toLowerCase().includes(search.toLowerCase()) ||
      row["Sample ID"].toLowerCase().includes(search.toLowerCase()) ||
      row["Collected by"].toLowerCase().includes(search.toLowerCase()) ||
      row.ReportedBy.toLowerCase().includes(search.toLowerCase())) &&
    (!date || row.SampleDate === format(date, "yyyy-MM-dd"))
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
                <YAxis label={{ value: "Value", angle: -90, position: "insideLeft", offset: 10 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="No DNA 1" stroke="#2563eb" dot={false} />
                <Line type="monotone" dataKey="No DNA 2" stroke="#10b981" dot={false} />
                <Line type="monotone" dataKey="No DNA 3" stroke="#d97706" dot={false} />
                <Line type="monotone" dataKey="No DNA 4" stroke="#ef4444" dot={false} />
                <Line type="monotone" dataKey="PA 1" stroke="#a21caf" dot={false} />
                <Line type="monotone" dataKey="PA 2" stroke="#6366f1" dot={false} />
                <Line type="monotone" dataKey="PA 3" stroke="#f59e42" dot={false} />
                <Line type="monotone" dataKey="PA 4" stroke="#14b8a6" dot={false} />
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
