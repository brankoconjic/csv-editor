"use client";

import React from "react";
import { Button } from "@lemonsqueezy/wedges";
import { useDropzone } from "react-dropzone";
import { usePapaParse } from "react-papaparse";

import { cn } from "@/lib/utils";
import { Data } from "@/app/page";

interface UploadProps {
  onUpload?: (data: Data[]) => void;
  onError?: (error: Error) => void;
}

export const Upload: React.FC<UploadProps> = ({
  onUpload,
  // eslint-disable-next-line no-console
  onError = (error) => console.warn(error),
}) => {
  const { readString } = usePapaParse();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (target?.result && typeof target.result === "string") {
        readString(target.result, {
          header: true,
          complete: (results) => {
            // Filter out empty rows
            const filteredData = results.data.filter((row: any) =>
              Object.values(row).some((value) => value !== "")
            );

            // add unique id to each row
            filteredData.forEach((row: any, index) => {
              row.selfId = index;
            });

            if (onUpload) {
              onUpload(filteredData as Data[]);
            }
          },
          error: (error) => {
            if (onError) {
              onError(error);
            }
          },
        });
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDrop,
    onError,
    onDropRejected: () => {
      onError(new Error("Please upload a valid CSV file"));
    },
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative mx-auto flex w-[500px] max-w-[calc(100%-40px)] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-10 py-20 text-surface-500",
          isDragActive && "border-primary-500"
        ),
      })}
    >
      <Button variant="outline" className="mt-6" size="sm" onClick={open}>
        Upload CSV
      </Button>

      <input {...getInputProps()} className="hidden" />

      <span className="bottom-0 text-sm">Or drag and drop a CSV file here</span>
    </div>
  );
};
