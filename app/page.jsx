"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/Index";

export default function Page() {
  const navigate = useRouter();
  useEffect(() => {
    navigate.push("ClientServices");
  }, [navigate]);

  return <Loader />;
}
