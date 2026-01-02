import { HomeView } from "@/modules/home/ui/view/home-view";
import { getAllSites } from "@/modules/project/server/app.server";

const Home = async () => {
	const sites = await getAllSites();
	const formattedSites = sites.map((s) => ({
		...s,
		created_at: s.created_at.toISOString(),
		updated_at: s.updated_at.toISOString(),
	}));
	return (
		<>
			<HomeView sites={formattedSites} />
		</>
	);
};

export default Home;
export const revalidate = 10;