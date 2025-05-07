import localFont from "next/font/local";

export const geistSans = localFont({
	src: [
		{
			path: "../../public/fonts/GeistSans-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/GeistSans-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/GeistSans-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-geist-sans",
});

export const geistMono = localFont({
	src: [
		{
			path: "../../public/fonts/GeistMono-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/GeistMono-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/GeistMono-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-geist-mono",
});

interface FontProviderProps {
	children: React.ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
	return (
		<div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
			{children}
		</div>
	);
}
