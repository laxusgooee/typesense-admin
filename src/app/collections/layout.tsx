import React from "react";
import { AuthenticatedLayout } from "@/components/_common/authenticatedLayout";

export default function Layout({
  collection,
  children,
}: {
  collection: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout>
      {collection}
      {children}
    </AuthenticatedLayout>
  );
}
