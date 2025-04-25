"use client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Tooltip,
  Icon,
  HStack,
  Link,
  IconButton,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { FiInfo, FiExternalLink, FiLinkedin, FiX } from "react-icons/fi";
import "./styles.css";
import CopyButton from "./CopyButton";
import { useState } from "react";

type AccountRow = {
  Name: string;
  Domain?: string;
  "LinkedIn URL"?: string;
  "Signal Link"?: string;
  Employees: number;
  "Signal Description": string;
  Status?: string;
  "Funding Stage"?: string;
  [key: string]: any;
};

interface Props {
  data: AccountRow[];
  magicColumns: { question: string; answerKey: string; reasonKey: string }[];
  theme?: "default" | "white";
  stickyFirstColumns?: boolean;
  onRowClick?: () => void;
  onDeleteColumn?: (columnKey: string) => void;
}

export const MagicTable: React.FC<Props> = ({
  data,
  magicColumns,
  theme = "default",
  stickyFirstColumns = true,
  onRowClick,
  onDeleteColumn,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log("MagicTable received data:", data);

  const staticColumns: ColumnDef<AccountRow>[] = [
    {
      header: "Name",
      accessorKey: "Name",
      cell: (info: CellContext<AccountRow, any>) => {
        const row = info.row.original;
        return (
          <HStack spacing={2} className="name-cell">
            <div className="name-domain-container">
              <span className="highlight-text-black">
                {info.getValue() as string}
              </span>
              {row.Domain && (
                <Link
                  href={row.Domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="domain-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    try {
                      return new URL(row.Domain!).hostname.replace("www.", "");
                    } catch {
                      return row.Domain;
                    }
                  })()}
                </Link>
              )}
            </div>
            {row["LinkedIn URL"] && (
              <Tooltip label="Open LinkedIn" placement="top">
                <IconButton
                  as="a"
                  href={row["LinkedIn URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LinkedIn"
                  icon={<FiLinkedin />}
                  size="sm"
                  variant="ghost"
                  className="linkedin-button"
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            )}
          </HStack>
        );
      },
    },
    {
      header: "Employees",
      accessorKey: "Employees",
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      header: "Funding Stage",
      accessorKey: "Funding Stage",
      cell: (info: CellContext<AccountRow, any>) => {
        const value = info.getValue() as string;
        if (!value || value.trim() === "") {
          return <span className="text-gray-400">Not Available</span>;
        }
        return <span>{value}</span>;
      },
    },
    {
      header: "Signal",
      accessorKey: "Signal Description",
      cell: (info: CellContext<AccountRow, any>) => {
        const row = info.row.original;
        const signalText = info.getValue() as string;
        return (
          <HStack spacing={2} className="signal-cell">
            <span>{signalText}</span>
            {row["Signal Link"] && (
              <HStack spacing={1}>
                <CopyButton
                  value={row["Signal Link"]!}
                  label="Copy signal link"
                />
                <Tooltip label="Open signal" placement="top">
                  <IconButton
                    as="a"
                    href={row["Signal Link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open signal"
                    icon={<FiExternalLink />}
                    size="sm"
                    variant="ghost"
                    className="signal-button"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              </HStack>
            )}
          </HStack>
        );
      },
    },
  ];

  if (data.length > 0 && data[0].Status !== undefined) {
    staticColumns.push({
      header: "Status",
      accessorKey: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        if (!status) return null;
        let className = "";
        if (status.toLowerCase() === "rejected")
          className = "status-pill rejected";
        else if (status.toLowerCase() === "approved")
          className = "status-pill approved";
        else if (status.toLowerCase() === "pending")
          className = "status-pill pending";
        return status ? <span className={className}>{status}</span> : null;
      },
    });
  }

  const dynamicColumns: ColumnDef<AccountRow>[] = magicColumns.map((col) => ({
    header: () => (
      <HStack justify="space-between" w="100%" align="center">
        <span>{col.question}</span>
        <IconButton
          aria-label="Delete column"
          icon={<FiX />}
          size="xs"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteColumn?.(col.answerKey);
          }}
        />
      </HStack>
    ),
    accessorKey: col.answerKey,
    cell: (info: CellContext<AccountRow, any>) => (
      <HStack
        w="100%"
        justify="flex-end"
        align="center"
        className="answer-cell"
      >
        <span className="answer-text" style={{ textAlign: "right" }}>
          {info.getValue() as string}
        </span>
        <Tooltip
          label={info.row.original[col.reasonKey]}
          placement="top"
          hasArrow
        >
          <span className="info-icon">
            <Icon as={FiInfo} color="gray.500" />
          </span>
        </Tooltip>
      </HStack>
    ),
  }));

  const table = useReactTable({
    data: data || [],
    columns: [...staticColumns, ...dynamicColumns],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  console.log("Table row model:", table.getRowModel().rows);

  return (
    <Box
      h="500px"
      w="full"
      position="relative"
      overflowX="auto"
      overflowY="auto"
      bg={theme === "white" ? "#FDFDFC" : "#FFFFFF"}
      border="1px solid rgba(29, 27, 24, 0.08)"
      borderRadius="8px"
      className="table-container"
      data-theme={theme}
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      }}
    >
      <Table
        variant="simple"
        colorScheme="gray"
        size="sm"
        style={{ width: "max-content", minWidth: "100%" }}
      >
        <Thead className="sticky-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  className="sticky-cell"
                  data-theme={theme}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr
              key={row.id}
              className="table-row"
              onClick={onRowClick}
              data-theme={theme}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {row.getVisibleCells().map((cell, index) => (
                <Td
                  key={cell.id}
                  className={
                    stickyFirstColumns && index === 0 ? "sticky-cell" : ""
                  }
                  data-theme={theme}
                  data-status={
                    cell.column.id === "Status" ? cell.getValue() : null
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
