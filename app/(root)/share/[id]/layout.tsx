import { Viewport } from "next";

export const viewport: Viewport = {
	themeColor: "#0A0A0A",
};

export default function ShareLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen bg-[#0A0A0A]">{children}</div>;
}
