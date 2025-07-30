import React from "react";
import MyAnimalsClient from "@/app/components/animals/my-animals-client";

export default async function MyAnimalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <MyAnimalsClient locale={locale} />;
}
