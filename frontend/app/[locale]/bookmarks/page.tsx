import React from "react";
import BookmarkedAnimalsClient from "@/app/components/animals/bookmarked-animals-client";

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BookmarkedAnimalsClient locale={locale} />;
}
