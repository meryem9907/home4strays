import React from "react";
import AnimalsClient from "@/app/components/animals/animals-client";

export default async function AnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AnimalsClient locale={locale} />;
}
