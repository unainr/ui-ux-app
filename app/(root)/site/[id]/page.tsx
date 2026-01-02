import React from "react";
import { getSite } from "@/modules/project/server/app.server";
import SiteClient from "./site-client";
import { redirect } from "next/navigation";

interface Props {
	params: Promise<{ id: string }>;
}
const SitePage = async ({ params }: Props) => {
	const { id } = await params;
	const site = await getSite(id);

	if (!site) {
		redirect("/");
	}

	return <SiteClient site={site} />;
};

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const site = await getSite(id);

	return {
		title: site ? `${site.name} | AppBuilder` : "AppBuilder",
		description: site ? `Edit and refine ${site.name}` : "Build your web app",
	};
}

export default SitePage;
