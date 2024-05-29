"use client";

import { useState } from "react";

import { Table } from "@/components/Table";
import { Upload } from "@/components/Upload";

export type Data = Record<string, string>;

export default function Home() {
  const [initialData, setInitialData] = useState<Data[] | null>(null);

  return (
    <main className="grid min-h-dvh w-full place-content-center p-4">
      {initialData ? (
        <Table initialData={initialData} />
      ) : (
        <Upload
          onUpload={(data) => {
            setInitialData(data);
          }}
          onError={(error) => {
            // eslint-disable-next-line no-console
            console.warn("error", error);
          }}
        />
      )}
    </main>
  );
}
