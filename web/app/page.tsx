"use client";

import { Separator } from "@/components/ui/separator";
import { posts } from "@/data/posts";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="p-4 bg-background text-foreground h-full overflow-auto">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-2xl font-semibold mb-4">All Posts</h1>
					<Separator className="mb-6" />

					<div className="space-y-6">
						{posts.map((post) => (
							<Link href={`/${post.id}`} key={post.id}>
								<div className="p-4 bg-muted/80 rounded border border-border hover:border-border/60 transition-colors cursor-pointer">
									<h2 className="text-xl mb-2">{post.title}</h2>
									<p className="text-muted-foreground mb-2">{post.excerpt}</p>
									<div className="flex justify-between items-center">
										<div className="flex space-x-2">
											{post.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="bg-muted text-xs px-2 py-1 rounded"
												>
													{tag}
												</span>
											))}
										</div>
										<div className="flex items-center space-x-2">
											<span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
												{post.category
													.split("-")
													.map(
														(word) =>
															word.charAt(0).toUpperCase() + word.slice(1),
													)
													.join(" ")}
											</span>
											<span className="text-xs text-muted-foreground">
												{post.date}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>

				<div className="mt-12">
					<h2 className="text-xl font-semibold mb-4">
						Welcome to blog.joonhoe.com
					</h2>
					<Separator className="mb-6" />

					<div className="p-4 bg-muted/80 rounded border border-border">
						<p className="mb-4">
							This blog features a VSCode-inspired UI, showcasing a clean
							developer experience with modern web technologies.
						</p>

						<h3 className="text-lg font-medium mt-6 mb-2">Technologies Used</h3>
						<ul className="list-disc list-inside mb-4 ml-2 space-y-1">
							<li>Next.js</li>
							<li>React</li>
							<li>TypeScript</li>
							<li>Tailwind CSS</li>
							<li>Shadcn UI</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
