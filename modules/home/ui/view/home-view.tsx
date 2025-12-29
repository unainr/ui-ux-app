"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { generateUI } from "@/modules/project/server/app.server";
import { useState } from "react";

export const HomeView = () => {
	const [name, setName] = useState<string>("");
	const [result, setResult] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async () => {
		try {
			setLoading(true);
			const res = (await generateUI({ name })) as string;
			setResult(res);
      console.log(res)
		} catch (error: any) {
			console.log(error.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<Input
				placeholder="enter you prompt"
				onChange={(e) => setName(e.target.value)}
			/>
			<Button type="submit" onClick={handleSubmit}>
				{loading ? <Spinner /> : "Submit"}
			</Button>
      {result}
		</div>
	);
};
