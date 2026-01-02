import { getSite } from "@/modules/project/server/app.server";
import WebsiteFrame from "@/modules/home/ui/components/iframer-code";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

const SharePage = async ({ params }: Props) => {
	const { id } = await params;
	const site = await getSite(id);

	if (!site || !site.code) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-white flex-col gap-4">
				<h1 className="text-xl font-semibold">Site not found</h1>
				<p className="text-gray-400">
					The website you are looking for does not exist.
				</p>
				<Link href="/" className="text-blue-400 hover:underline">
					Go Home
				</Link>
			</div>
		);
	}

	return (
		<div className="h-screen w-full relative">
			<WebsiteFrame code={site.code} />
			<div className="absolute bottom-4 right-4 z-50">
				<Link
					href="/"
					className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-full text-xs font-medium border border-white/10 hover:bg-black transition shadow-lg">
					<Sparkles className="w-3 h-3 text-blue-400" />
					Built with AppBuilder
				</Link>
			</div>
		</div>
	);
};

export default SharePage;
