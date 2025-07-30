import React from "react";
import NGOsClient from "./ngos-client";

export default async function NGOPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  return <NGOsClient locale={locale} />;
}
