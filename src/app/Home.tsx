"use client";

import { useState } from "react";

import { Table } from "@/components/Table";
import { Upload } from "@/components/Upload";

import { Data } from "./page";

export default function Home() {
  const [data, setData] = useState<Data[] | null>(null);

  return (
    <main className="container grid h-dvh place-content-center">
      <Upload
        onUpload={(data) => {
          setData(data);
        }}
        onError={(error) => {
          console.warn("error", error);
        }}
      />
      <Table />
    </main>
  );
}
