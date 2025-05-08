import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Post",
	description: "Post",
};

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
