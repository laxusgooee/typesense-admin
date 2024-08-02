import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextuiProvider } from "@/providers/nextuiProvider";
import { ToastProvider } from "@/providers/toastProvider";
import { TypesenseProvider } from "@/providers/typesenseProvider";
import { AuthenticatedLayout } from "@/components/_common/authenticatedLayout";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	auth: React.ReactNode;
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} text-black dark:text-white bg-zinc-100 dark:bg-[#0F172A] min-h-screen`}
			>
				<TypesenseProvider>
					<ToastProvider>
						<NextuiProvider>
							<AuthenticatedLayout>{children}</AuthenticatedLayout>
						</NextuiProvider>
					</ToastProvider>
				</TypesenseProvider>
			</body>
		</html>
	);
}
