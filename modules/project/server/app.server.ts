"use server";
import { GENERATE_UI_SYSTEM_PROMPT } from "@/constants";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { db } from "@/drizzle/db";
import { siteTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

interface GenerateProps {
	name: string;
	history?: { role: "user" | "assistant"; content: string }[];
	currentCode?: string;
}

export const generateUI = async ({
	name,
	history = [],
	currentCode,
}: GenerateProps) => {
	try {
		let prompt = `Generate a website for: ${name}`;

		if (history.length > 0) {
			prompt += `\n\nConversation History:\n${history
				.map((m) => `${m.role}: ${m.content}`)
				.join("\n")}`;
		}

		if (currentCode) {
			prompt = `
You are an expert web developer. The user wants to update an EXISTING website.
Here is the current code of the website:

\`\`\`html
${currentCode}
\`\`\`

User Request: "${name}"

${
	history.length > 0
		? `Conversation History:\n${history
				.map((m) => `${m.role}: ${m.content}`)
				.join("\n")}`
		: ""
}

Instructions:
1. Analyze the current code and the user's request.
2. Apply the requested changes to the code.
3. Maintain the existing style and structure unless explicitly asked to change it.
4. Output the FULL, COMPLETE code (HTML + Tailwind). Do not output partial snippets.
5. Do not include markdown ticks (\`\`\`) in the output, just the raw code.
`;
		}

		const { text } = await generateText({
			model: groq("llama-3.3-70b-versatile"),
			system: GENERATE_UI_SYSTEM_PROMPT,
			prompt: prompt,
		});

		return text;
	} catch (error: any) {
		console.log(error);
		throw new Error(error.message || "Failed to generate website");
	}
};

export const createSite = async (name: string) => {
	const [site] = await db.insert(siteTable).values({ name }).returning();
	return site.id;
};

export const getSite = async (id: string) => {
	const [site] = await db.select().from(siteTable).where(eq(siteTable.id, id));
	return site;
};

export const updateSiteCode = async (id: string, code: string) => {
	await db.update(siteTable).set({ code }).where(eq(siteTable.id, id));
};

export const getAllSites = async () => {
	return await db.select().from(siteTable).orderBy(desc(siteTable.created_at));
};
