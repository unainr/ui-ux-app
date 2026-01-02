"use client";
import React, { useEffect, useState, useRef } from "react";
import {
	generateUI,
	updateSiteCode,
} from "@/modules/project/server/app.server";
import WebsiteFrame from "@/modules/home/ui/components/iframer-code";
import { Spinner } from "@/components/ui/spinner";
import {
	ArrowLeft,
	Code,
	Download,
	Globe,
	Layout,
	MessageSquare,
	Send,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
	site: {
		id: string;
		name: string;
		code: string | null;
	};
}

interface Message {
	role: "user" | "assistant";
	content: string;
}

const SiteClient = ({ site: initialSite }: Props) => {
	const [site, setSite] = useState(initialSite);
	const [loading, setLoading] = useState(!initialSite.code);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleDownload = () => {
		if (!site.code) return;
		const blob = new Blob([site.code], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${site.name.replace(/\s+/g, "-").toLowerCase()}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handlePublish = () => {
		window.open(`/share/${site.id}`, "_blank");
	};

	// Initial Generation
	// Initial Generation
	const hasGenerated = useRef(false);

	useEffect(() => {
		const generate = async () => {
			if (site.code || hasGenerated.current) return;
			hasGenerated.current = true;

			setMessages([
				{ role: "assistant", content: "Generating your initial website..." },
			]);

			try {
				setLoading(true);
				const code = (await generateUI({ name: site.name })) as string;
				if (code) {
					await updateSiteCode(site.id, code);
					setSite((prev) => ({ ...prev, code }));
					setMessages((prev) => [
						...prev,
						{
							role: "assistant",
							content:
								"Website generated! You can now refine it by chatting below.",
						},
					]);
				}
			} catch (error: any) {
				console.error("Generation failed:", error);
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content:
							error.message || "Failed to generate website. Please try again.",
					},
				]);
				hasGenerated.current = false; // Allow retry
			} finally {
				setLoading(false);
			}
		};

		if (!site.code) {
			generate();
		}
	}, [site.id, site.name, site.code]);

	const handleSendMessage = async () => {
		if (!input.trim() || loading) return;

		const userMessage = input;
		setInput("");
		setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
		setLoading(true);

		try {
			const code = (await generateUI({
				name: userMessage,
				history: messages.map((m) => ({ role: m.role, content: m.content })),
				currentCode: site.code || undefined,
			})) as string;

			if (code) {
				await updateSiteCode(site.id, code);
				setSite((prev) => ({ ...prev, code }));
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: "Code updated successfully!" },
				]);
			}
		} catch (error) {
			console.error(error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Something went wrong. Please try again.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="flex h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
			{/* Left Sidebar - Chat */}
			<div className="w-[400px] flex flex-col border-r border-white/10 bg-[#0A0A0A] z-10 shrink-0">
				{/* Header */}
				<div className="p-4 border-b border-white/10 flex items-center gap-3">
					<Link
						href="/"
						className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white">
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div className="flex-1 min-w-0">
						<h1 className="font-semibold text-sm truncate" title={site.name}>
							{site.name}
						</h1>
						<span className="text-xs text-green-400 flex items-center gap-1">
							<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
							Active Session
						</span>
					</div>
				</div>

				{/* Messages Area */}
				<div
					className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
					ref={scrollRef}>
					{messages.length === 0 && !loading && (
						<div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500 space-y-4">
							<div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
								<Sparkles className="w-6 h-6 text-blue-400" />
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-white">
									Refine your design
								</p>
								<p className="text-xs text-gray-500 max-w-[200px] mx-auto">
									Chat with AI to make changes, switch themes, or add sections.
								</p>
							</div>
						</div>
					)}

					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex gap-3 ${
								msg.role === "user" ? "flex-row-reverse" : "flex-row"
							} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
							{/* Avatar */}
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${
									msg.role === "assistant"
										? "bg-blue-600/20 text-blue-400"
										: "bg-white/10 text-white"
								}`}>
								{msg.role === "assistant" ? (
									<Sparkles className="w-4 h-4" />
								) : (
									<span className="text-xs font-bold">You</span>
								)}
							</div>

							{/* Bubble */}
							<div
								className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed border ${
									msg.role === "user"
										? "bg-[#1A1A1A] border-white/10 text-gray-200" // Darker user bubble
										: "bg-transparent border-transparent text-gray-300 pl-0 pt-1" // Minimal assistant bubble
								}`}>
								{msg.content}
							</div>
						</div>
					))}

					{loading && (
						<div className="flex gap-3">
							<div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 animate-pulse border border-white/10">
								<Sparkles className="w-4 h-4" />
							</div>
							<div className="bg-[#1A1A1A] border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
								<Spinner className="w-3.5 h-3.5" />
								<span className="animate-pulse text-xs">Thinking...</span>
							</div>
						</div>
					)}
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-white/10 bg-[#0A0A0A]">
					<div className="relative group">
						<div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ask for changes..."
							className="pr-12 bg-[#151515] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 h-11 relative"
							disabled={loading}
						/>
						<Button
							size="icon"
							variant="ghost"
							className="absolute right-1.5 top-1.5 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
							onClick={handleSendMessage}
							disabled={loading || !input.trim()}>
							<Send className="w-3.5 h-3.5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Right Area - Preview */}
			<div className="flex-1 bg-[#121212] relative flex flex-col">
				{/* Preview Header / Toolbar */}
				<div className="h-14 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-4">
					<div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-white/5 text-xs text-gray-400">
						<Globe className="w-3.5 h-3.5" />
						<span>preview mode</span>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="text-gray-400 hover:text-white hover:bg-white/5 gap-2"
							onClick={() => window.open(`/share/${site.id}`, "_blank")}>
							<Code className="w-4 h-4" />
							<span className="hidden sm:inline">Source</span>
						</Button>
						<div className="w-px h-4 bg-white/10" />
						<Button
							variant="ghost"
							size="sm"
							className="text-gray-400 hover:text-white hover:bg-white/5 gap-2"
							onClick={handleDownload}>
							<Download className="w-4 h-4" />
							<span className="hidden sm:inline">Download</span>
						</Button>
						<Button
							size="sm"
							className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-900/20"
							onClick={handlePublish}>
							<Sparkles className="w-4 h-4" />
							<span className="hidden sm:inline">Publish</span>
						</Button>
					</div>
				</div>

				{/* Iframe Container */}
				<div className="flex-1 overflow-hidden relative p-4">
					{!site.code && !loading ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
							<Layout className="w-16 h-16 opacity-20" />
							<p>Your site preview will appear here</p>
						</div>
					) : (
						<div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-white/5 ring-4 ring-black/20">
							{/* Mock Browser Header */}
							<div className="h-8 bg-[#f0f0f0] border-b border-gray-200 flex items-center px-3 gap-2">
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black/5"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black/5"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black/5"></div>
								</div>
								<div className="flex-1 text-center px-20">
									<div className="bg-white border border-gray-200 rounded-md text-[10px] text-gray-500 py-0.5 px-2 w-full truncate text-center shadow-sm">
										appbuilder.ai/preview/{site.id}
									</div>
								</div>
							</div>

							{site.code ? (
								<WebsiteFrame code={site.code} />
							) : (
								<div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50">
									<Spinner className="w-8 h-8 text-blue-500" />
									<p className="text-gray-500 text-sm font-medium animate-pulse">
										Building your masterpiece...
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SiteClient;
