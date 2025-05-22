
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

// Sample representative mock data
const mockTableRows = [
  {
    Location: "Houston",
    "MasterID (Key)": "M10001",
    "Equipment Type": "Handheld Gen1",
    "Sample ID": "S-001",
    SampleDate: "2025-05-01",
    Time: "09:30",
    "Sample Type": "Water",
    "Collected by": "Jane Smith",
    ReportedBy: "Supervisor A",
    "Sample Volume (mL)": 50,
    Comments: "No issues",
    "Test type": "Pathogen A",
    "Test Value": 13.5,
    "Test Value Units": "CFU/mL",
  },
  {
    Location: "Dallas",
    "MasterID (Key)": "M10002",
    "Equipment Type": "Handheld Gen2",
    "Sample ID": "S-002",
    SampleDate: "2025-05-02",
    Time: "15:20",
    "Sample Type": "Soil",
    "Collected by": "Mark Jones",
    ReportedBy: "Supervisor B",
    "Sample Volume (mL)": 30,
    Comments: "Cloudy sample",
    "Test type": "Pathogen B",
    "Test Value": 2,
    "Test Value Units": "CFU/g",
  },
  {
    Location: "San Antonio",
    "MasterID (Key)": "M10003",
    "Equipment Type": "Handheld Gen1",
    "Sample ID": "S-003",
    SampleDate: "2025-05-03",
    Time: "12:15",
    "Sample Type": "Oil",
    "Collected by": "Alex Lee",
    ReportedBy: "Supervisor A",
    "Sample Volume (mL)": 60,
    Comments: "",
    "Test type": "Pathogen C",
    "Test Value": 0,
    "Test Value Units": "CFU/mL",
  },
];

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
