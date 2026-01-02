"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sparkles,
	ArrowRight,
	Layout,
	Search,
	Paperclip,
	Command,
	Send,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createSite } from "@/modules/project/server/app.server";
import { useRouter } from "next/navigation";
import { GradientBars } from "@/components/ui/bar";
import { ThumbnailFrame } from "@/modules/home/ui/components/thumbnail-frame";

interface Props {
	sites: {
		id: string;
		name: string;
		created_at: string;
		updated_at: string;
		code: string | null;
	}[];
}

export const HomeView = ({ sites }: Props) => {
	const [input, setInput] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleCreate = async () => {
		if (!input.trim()) return;
		setIsCreating(true);
		try {
			const id = await createSite(input);
			router.push(`/site/${id}`);
		} catch (error) {
			console.error(error);
			setIsCreating(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleCreate();
		}
	};

	// Auto-scroll effect
	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer || isHovered) return;

		let scrollInterval: NodeJS.Timeout;

		const startAutoScroll = () => {
			scrollInterval = setInterval(() => {
				if (
					scrollContainer.scrollLeft + scrollContainer.clientWidth >=
					scrollContainer.scrollWidth
				) {
					// Reset to start smoothly or instantly? Instantly for loop feel if content is duped, but here just scroll back
					scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
				} else {
					scrollContainer.scrollBy({ left: 320, behavior: "smooth" }); // Card width + gap
				}
			}, 3000);
		};

		startAutoScroll();

		return () => clearInterval(scrollInterval);
	}, [isHovered]);

	return (
		<div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500/30 relative overflow-x-hidden font-sans">
			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
			{/* Background Effect */}
			<div className="fixed inset-0 z-0 text-blue-500/10 pointer-events-none mix-blend-screen">
				<GradientBars
					colors={["#3b82f6", "#8b5cf6", "transparent"]}
					bars={50}
				/>
			</div>

			{/* Gradient Overlay */}
			<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/80 to-[#0A0A0A] pointer-events-none" />

			{/* Navbar */}
			<nav className="border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="bg-white/5 p-2 rounded-lg border border-white/10">
							<Layout className="w-5 h-5 text-blue-400" />
						</div>
						<span className="font-semibold text-lg tracking-tight">
							AppBuilder
						</span>
					</div>
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							className="text-gray-400 hover:text-white hover:bg-white/5">
							Log In
						</Button>
						<Button className="bg-white text-black hover:bg-gray-200 font-medium rounded-full px-6">
							Sign Up
						</Button>
					</div>
				</div>
			</nav>

			<div className="relative z-10 flex flex-col items-center py-20 px-6 max-w-5xl mx-auto min-h-[calc(100vh-64px)] justify-center -mt-16">
				{/* Hero Section */}
				<div className="w-full flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
						What do you want to <br />
						<span className="text-blue-500">build?</span>
					</h1>

					<p className="text-xl text-gray-400 max-w-2xl mb-12">
						Prompt, refine, and ship. Turn your ideas into production-ready web
						apps in seconds.
					</p>

					{/* Search Input Container */}
					<div className="w-full max-w-2xl relative group mb-12">
						{/* Glow Effect */}
						<div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

						{/* Input Box */}
						<div className="relative flex flex-col bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-[#202020]">
							<Input
								placeholder="Ask mvp.ai a question..."
								className="border-none bg-transparent text-lg h-12 focus-visible:ring-0 placeholder:text-gray-500 text-white shadow-none px-2"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={isCreating}
								autoFocus
							/>

							<div className="flex items-center justify-between mt-2 px-2">
								<div className="flex items-center gap-2 text-gray-500">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-white hover:bg-white/10 rounded-lg">
										<Paperclip className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-white hover:bg-white/10 rounded-lg">
										<Command className="w-4 h-4" />
									</Button>
								</div>

								<Button
									size="icon"
									className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
									onClick={handleCreate}
									disabled={isCreating || !input.trim()}>
									{isCreating ? (
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									) : (
										<ArrowRight className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Suggested Prompts Carousel */}
					<div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 overflow-visible mt-8">
						<div className="flex items-center justify-between px-4 mb-4">
							<h3 className="text-gray-400 text-sm font-medium flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-blue-400" />
								Start with a Blueprint
							</h3>
							<div className="flex gap-1">
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="w-1 h-1 rounded-full bg-white/10" />
								))}
							</div>
						</div>

						<div
							ref={scrollContainerRef}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							className="flex gap-4 overflow-x-auto pb-8 pt-2 px-4 snap-x snap-mandatory no-scrollbar -mx-4 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] scroll-smooth">
							{[
								{
									icon: <Layout className="w-5 h-5 text-blue-400" />,
									label: "SaaS Landing",
									description:
										"Modern startup landing page with dark mode, hero, and pricing.",
									prompt:
										"A modern landing page for a SaaS startup with dark mode, hero section, features grid, pricing section, and testimonials.",
									gradient: "from-blue-500/10 to-indigo-500/10",
								},
								{
									icon: <Sparkles className="w-5 h-5 text-purple-400" />,
									label: "Portfolio",
									description:
										"Minimalist showcase for creatives with masonry gallery.",
									prompt:
										"A minimalist portfolio for a photographer with a masonry gallery, about section, contact form, and social links.",
									gradient: "from-purple-500/10 to-pink-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-cyan-400" />,
									label: "Dashboard",
									description:
										"Admin panel with sidebar, charts, and data tables.",
									prompt:
										"A modern admin dashboard layout with a collapsible sidebar, summary stats cards, sales chart, and a user data table.",
									gradient: "from-cyan-500/10 to-teal-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-orange-400" />,
									label: "Store",
									description: "E-commerce product page with gallery and cart.",
									prompt:
										"A high-end e-commerce product page for a luxury watch brand with image carousel, reviews section, and add to cart flow.",
									gradient: "from-orange-500/10 to-amber-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-green-400" />,
									label: "Blog",
									description:
										"Clean blog layout with featured posts and categories.",
									prompt:
										"A clean, typography-focused blog layout with a featured post hero, category filters, and a grid of recent articles.",
									gradient: "from-green-500/10 to-emerald-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-red-400" />,
									label: "Task App",
									description: "Kanban board with drag-and-drop columns.",
									prompt:
										"A project management tool with a Kanban board layout, drag-and-drop columns, task details modal, and team member avatars.",
									gradient: "from-red-500/10 to-rose-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-pink-400" />,
									label: "Chat UI",
									description: "Messaging interface with sidebar and bubbles.",
									prompt:
										"A modern chat application interface with a contact sidebar, message thread view, typing indicator, and file attachment preview.",
									gradient: "from-pink-500/10 to-fuchsia-500/10",
								},
								{
									icon: <Layout className="w-5 h-5 text-yellow-400" />,
									label: "Crypto",
									description: "Cryptocurrency tracker with prices and trends.",
									prompt:
										"A real-time cryptocurrency dashboard showing price tickers, market cap trends, and a trading volume chart.",
									gradient: "from-yellow-500/10 to-amber-500/10",
								},
							].map((item, i) => (
								<button
									key={i}
									onClick={() => setInput(item.prompt)}
									className={`group relative flex-shrink-0 w-64 p-4 rounded-2xl border border-white/10 text-left transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl overflow-hidden bg-[#1A1A1A]/80 backdrop-blur-sm hover:bg-[#202020] snap-center ring-1 ring-white/0 hover:ring-white/10`}>
									{/* Gradient Background */}
									<div
										className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
									/>

									<div className="relative z-10 flex flex-col gap-3">
										<div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center shrink-0 shadow-inner">
											{item.icon}
										</div>
										<div className="min-w-0">
											<h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors truncate text-[15px]">
												{item.label}
											</h3>
											<p className="text-xs text-gray-500 leading-relaxed line-clamp-2 h-8">
												{item.description}
											</p>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Recent Sites Grid */}
				{sites.length > 0 && (
					<div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mt-12">
						<div className="flex items-center justify-between mb-6 px-2">
							<h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
								<Layout className="w-4 h-4 text-gray-500" />
								Your Projects
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{sites.map((site) => (
								<Link
									href={`/site/${site.id}`}
									key={site.id}
									className="group relative flex flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 ring-1 ring-white/0 hover:ring-white/5">
									{/* Thumbnail / Visual */}
									<div className="h-48 w-full bg-[#050505] relative overflow-hidden">
										{site.code ? (
											<ThumbnailFrame code={site.code} />
										) : (
											<div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center">
												<Layout className="w-8 h-8 text-white/10" />
											</div>
										)}

										{/* Hover Overlay */}
										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
											<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-medium text-white flex items-center gap-2">
												Edit Site <ArrowRight className="w-3 h-3" />
											</div>
										</div>
									</div>

									<div className="p-4 bg-[#111] border-t border-white/5 group-hover:bg-[#151515] transition-colors">
										<h3
											className="font-medium text-sm text-gray-200 group-hover:text-blue-400 transition-colors truncate"
											title={site.name}>
											{site.name}
										</h3>
										<p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1.5">
											<span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
											Updated {new Date(site.updated_at).toLocaleDateString()}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
