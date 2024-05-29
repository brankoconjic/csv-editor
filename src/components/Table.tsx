import { useEffect, useRef, useState } from "react";
import { Button, Input, Kbd, Label, Textarea, Tooltip } from "@lemonsqueezy/wedges";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CopyIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCSVDownloader } from "react-papaparse";

import { getCurrentDateFormatted } from "@/lib/utils";
import { Data } from "@/app/page";

import { Section } from "./Section";
import { PageSheet, Sheet } from "./Sheet";

export function Table({ initialData }: { initialData: Data[] | null }) {
  const [tableData, setTableData] = useState<Data[]>(initialData ?? []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [isNewRow, setIsNewRow] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const { CSVDownloader, Type } = useCSVDownloader();
  useHotkeys("mod+f", (e) => {
    e.preventDefault();
    searchRef.current?.focus();
  });

  useHotkeys("shift+n", (e) => {
    e.preventDefault();
    handleNewRow();
  });

  useHotkeys("shift+e", (e) => {
    e.preventDefault();
    document.getElementById("csv-download")?.click();
  });

  const formattedDate = getCurrentDateFormatted();

  const openDialog = (rowData: Data) => {
    setDialogOpen(true);
    setSelectedRow(rowData);
  };

  const handleNewRow = () => {
    setDialogOpen(true);
    setIsNewRow(true);
    setSelectedRow({
      ...Object.fromEntries(
        Object.keys(tableData[0]).map((key) => {
          return [key, ""];
        })
      ),
      selfId: totalRows.toString(),
    });
  };

  const handleDuplicate = (rowData: Data) => {
    setDialogOpen(true);
    setIsNewRow(true);
    setSelectedRow({
      ...rowData,
      selfId: totalRows.toString(),
    });
  };

  const columns = [
    {
      accessorKey: "edit",
      header: "",
      size: 100,
      cell: ({ row }: { row: Row<Data> }) => (
        <div className="flex gap-0">
          <Tooltip content="Edit" side="top">
            <Button
              size="sm"
              className="size-8 hover:bg-background"
              shape="pill"
              variant="transparent"
              onClick={() => openDialog(row.original)}
              before={<Edit2Icon className="size-3" />}
            />
          </Tooltip>

          <Tooltip content="Duplicate" side="top">
            <Button
              size="sm"
              shape="pill"
              className="size-8 hover:bg-background"
              variant="transparent"
              onClick={() => handleDuplicate(row.original)}
              before={<CopyIcon className="size-3" />}
            />
          </Tooltip>
        </div>
      ),
    },
    ...Object.keys(tableData[0]).map((key) => ({
      accessorKey: key,
      header: key,
      filterFn: "includesString",
      enableGlobalFilter: true,
      size: key === "translatable" || key === "customizable" ? 100 : undefined,
      cell: ({ getValue }: { getValue: () => void }) => {
        const initialValue = getValue();
        return <>{initialValue}</>;
      },
    })),
  ] as ColumnDef<Data>[];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter: filterValue,
    },
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSaveChanges = () => {
    if (!selectedRow) return;

    if (isNewRow) {
      setTableData((prev) => [...prev, selectedRow]);
    } else {
      // this means it's an existing row
      setTableData((prev) =>
        prev.map((row) => {
          if (row.selfId === selectedRow.selfId) {
            return selectedRow;
          }
          return row;
        })
      );
    }

    setDialogOpen(false);
    setIsNewRow(false);
  };

  // Show a warning when the user tries to leave the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 90, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  useEffect(() => {
    setRowCount(table.getFilteredRowModel().rows.length);
    setTotalRows(table.getCoreRowModel().rows.length);
  }, [table, filterValue, setRowCount, tableData]);

  if (!initialData) return null;

  return (
    <>
      <header className="flex items-center justify-between gap-2 pb-4 text-sm">
        <div className="flex items-center gap-4">
          <Input
            ref={searchRef}
            placeholder="Search (CMD+F)"
            value={filterValue}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setFilterValue(target.value);
            }}
            className="h-8"
          />
          <span>
            {rowCount} of {totalRows} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            after={
              <Kbd className="w-auto border-0" keys={["shift"]}>
                N
              </Kbd>
            }
            onClick={handleNewRow}
            variant="outline"
            size="sm"
          >
            Add new row
          </Button>

          <Button
            asChild
            after={
              <Kbd className="w-auto border-0 opacity-50" keys={["shift"]}>
                E
              </Kbd>
            }
            variant="secondary"
            size="sm"
            className="px-3"
          >
            <CSVDownloader
              type={Type.Button}
              filename={`pattern-context-${formattedDate}`}
              bom={false}
              data={tableData}
            >
              <a id="csv-download" tabIndex={-1} ref={downloadRef}>
                Export CSV
              </a>
            </CSVDownloader>
          </Button>
        </div>
      </header>

      <div
        ref={tableContainerRef}
        className="relative h-[calc(100dvh-80px)] overflow-auto rounded-lg border border-surface-100 text-xs shadow-wg-xs"
      >
        <table className="grid">
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="flex w-full" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="flex border-b border-surface-100 bg-surface-50 py-4 pr-4 first:pl-4 last:pr-6 dark:bg-neutral-800"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: "relative", //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Data>;
              return (
                <tr
                  className="group absolute flex w-full"
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className="flex text-balance break-words border-b border-surface-100 bg-background py-3 pr-4 first:pl-4 last:pr-6 group-last:border-b-0 group-hover:bg-surface-50"
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Sheet
        open={dialogOpen}
        onOpenChange={() => {
          setDialogOpen(false);
          setSelectedRow(null);
          setIsNewRow(false);
        }}
      >
        <PageSheet title={isNewRow ? `Create new row (#${rowCount})` : "Edit row"}>
          {selectedRow && (
            <>
              <Section transparent className="mb-10 items-stretch">
                {Object.entries(selectedRow).map(([key, value]) => (
                  <Section.Item hover key={key} className="flex-col items-stretch">
                    <Label htmlFor={`id-${key}`}>{key}</Label>

                    {key === "example" ||
                      (key === "description" && (
                        <Textarea
                          onChange={(e) => {
                            const target = e.target as HTMLTextAreaElement;

                            setSelectedRow((prev) => ({
                              ...prev,
                              [key]: target.value,
                            }));
                          }}
                          id={`id-${key}`}
                          value={value}
                        />
                      ))}

                    {key !== "example" && key !== "description" && (
                      <>
                        <Input
                          id={`id-${key}`}
                          disabled={key === "selfId"}
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement;

                            setSelectedRow((prev) => ({
                              ...prev,
                              [key]: target.value,
                            }));
                          }}
                          value={value}
                        />

                        {key === "value" && selectedRow.type === "image" && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={value ?? ""}
                            alt={"Image preview"}
                            width={160}
                            height={160}
                            className="aspect-square size-40 rounded-lg bg-surface-100 object-cover"
                          />
                        )}
                      </>
                    )}
                  </Section.Item>
                ))}
              </Section>

              <div className="before:mask-image-fade-to-t absolute inset-x-0 bottom-0 isolate px-8 pb-4 pt-7 before:absolute before:inset-0 before:-z-10 before:bg-background before:content-['']">
                <Button className="w-full" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </PageSheet>
      </Sheet>
    </>
  );
}
