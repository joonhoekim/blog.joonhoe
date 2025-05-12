import type { Metadata } from "next";
import { FontProvider } from "@/components/FontProvider";
import VSCodeLayout from "@/components/layout/VSCodeLayout";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
		<html lang="en" suppressHydrationWarning>
			<body className="font-inter min-h-screen min-w-screen">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					// disableTransitionOnChange
				>
					<FontProvider>
						<VSCodeLayout>{children}</VSCodeLayout>
					</FontProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
