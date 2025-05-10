import type { Metadata } from "next";
import { FontProvider } from "@/components/FontProvider";
import VSCodeLayout from "@/components/layout/VSCodeLayout";
import "./globals.css";

export const metadata: Metadata = {
	title: "blog.joonhoe.com",
	description: "blog for joonhoe",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="font-inter min-h-screen min-w-screen">
				<FontProvider>
					<VSCodeLayout>{children}</VSCodeLayout>
				</FontProvider>
			</body>
		</html>
	);
}
