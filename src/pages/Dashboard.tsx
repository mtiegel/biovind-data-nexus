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

// ---- Time Series Graph Data - FROM USER ----
const graphHeaders = [
  "Time", "No DNA 1", "No DNA 2", "No DNA 3", "No DNA 4", "PA 1", "PA 2", "PA 3", "PA 4"
];

const graphDataRaw = [
  [1,3655.566,-3156.875,112.265,-4689.5,8424.333,7082.866,7994.614,-4370.156],
  [2,1907.034,-2205.656,-564.576,-3043.188,5529.884,4215.032,5384.364,-2725.094],
  [3,542.362,0.000,-207.261,0.000,3469.185,2657.792,3553.208,0.000],
  [4,-216.514,1654.781,-912.853,2332.344,1417.673,1044.458,2017.176,2444.313],
  [5,-423.514,3694.531,-1374.413,4488.781,-246.995,-502.595,415.238,4692.313],
  [6,-239.546,5678.281,-1040.067,7388.719,-2470.725,-1649.178,-817.200,7324.750],
  [7,287.141,9098.438,92.404,10984.500,-2400.111,-2909.544,-1509.856,10282.156],
  [8,-36.688,12257.906,991.031,14649.500,-1374.967,-1532.596,-1106.263,14918.594],
  [9,8.827,15031.094,1320.096,17435.469,-236.978,3.039,62.643,18995.938],
  [10,-149.048,17268.281,1452.035,19863.188,577.885,492.830,-162.545,22696.438],
  [11,235.389,19009.969,1024.381,22785.375,622.436,731.183,-20.202,26329.719],
  [12,-8.409,21866.469,810.884,24831.813,195.237,1063.662,-746.546,30069.563],
  [13,-111.034,23943.969,778.136,27168.031,-54.587,-285.172,-609.702,33738.438],
  [14,116.590,26639.938,157.232,29577.281,-288.629,-225.412,-1117.453,37960.250],
  [15,54.730,28475.563,-397.735,32189.125,-38.422,349.035,-1234.672,42196.156],
  [16,314.276,31087.875,-855.357,34736.094,-63.496,131.202,-96.953,45602.469],
  [17,1135.198,32711.219,-1838.511,36762.781,-290.070,-188.976,-525.922,49928.125],
  [18,1682.119,35018.563,-2587.978,39343.188,310.137,387.565,-326.110,55034.969],
  [19,2706.697,37637.125,-1813.507,41773.781,406.407,117.200,-36.111,58813.125],
  [20,3248.868,40016.688,-813.567,43999.375,-246.573,-462.228,-461.486,62413.125],
  [21,3596.789,42114.000,-442.128,46815.500,-370.335,331.407,-1127.143,67230.719],
  [22,3639.992,44133.844,273.531,49845.656,505.560,231.917,-375.268,71979.969],
  [23,4384.788,46882.406,558.283,52458.563,299.705,1011.333,-76.612,74897.156],
  [24,5033.928,50272.563,1420.129,55911.188,-567.338,568.156,620.294,78794.188],
  [25,5832.350,53517.156,1417.006,58535.688,143.525,306.165,1038.950,83382.500],
  [26,6076.802,55556.250,1509.602,61038.656,895.233,-590.512,380.106,88150.188],
  [27,6241.723,58842.188,2766.073,64757.938,214.315,-340.065,793.262,91919.938],
  [28,6825.395,62221.750,2833.076,67835.156,-408.072,-155.711,136.167,94734.219],
  [29,7358.222,64866.625,4047.890,70949.375,-308.396,264.392,359.105,98416.344],
  [30,8103.394,67723.875,4666.549,73864.813,-83.657,-849.348,762.635,103689.063],
  [31,9330.783,69759.719,5508.551,76997.094,26.769,-820.432,211.260,106906.188],
  [32,9772.143,73210.125,5816.209,79745.844,177.195,688.703,359.854,110905.625],
  [33,9835.782,76666.781,6856.181,82491.781,1182.121,1455.620,1017.728,115490.813],
  [34,10266.704,79788.313,7926.464,86365.813,4153.672,2564.254,2711.353,119194.813],
  [35,11089.188,82501.063,8010.060,89426.406,10380.504,5622.327,8399.290,122987.313],
  [36,11966.390,85513.094,9291.031,91905.500,24980.586,13854.212,26150.602,127347.563],
  [37,12193.218,88148.000,10366.221,95743.531,60966.355,33899.129,70441.539,131287.500],
  [38,12395.139,91049.750,10490.379,99062.500,142005.781,77462.891,170470.125,135391.938],
  [39,12733.436,93293.438,11454.101,102140.594,295109.063,167260.266,362830.781,139595.938],
  [40,13434.513,95815.969,11618.478,105666.656,485970.188,290918.906,605999.750,144607.500],
];

const lineChartData = graphDataRaw.map(row => {
  const obj: Record<string, number> = {};
  graphHeaders.forEach((header, i) => {
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
                <YAxis label={{ value: "Value", angle: -90, position: "insideLeft", offset: 10 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="No DNA 1" stroke="#0066ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="No DNA 2" stroke="#00cc66" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="No DNA 3" stroke="#ff9900" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="No DNA 4" stroke="#ff3366" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PA 1" stroke="#cc00ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PA 2" stroke="#3366ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PA 3" stroke="#ff6600" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PA 4" stroke="#00cccc" strokeWidth={2} dot={false} />
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
