import Editor from "@/lexical-editor/Editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Playground() {
	return (
		<>
			<Card className="w-3xl h-3xl mx-auto">
				<div className="flex justify-center items-center">
					<Button>
						<Link href="/test">Editor Test</Link>
					</Button>
				</div>
			</Card>
		</>
	);
}
