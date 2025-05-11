export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
  tags: string[];
}

export const posts: Post[] = [
  {
    id: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build powerful web applications with Next.js",
    category: "web-development",
    date: "2023-08-15",
    content: "This is a detailed guide about getting started with Next.js...",
    tags: ["nextjs", "react", "javascript"]
  },
  {
    id: "understanding-typescript",
    title: "Understanding TypeScript",
    excerpt: "A comprehensive guide to TypeScript for JavaScript developers",
    category: "programming",
    date: "2023-07-20",
    content: "TypeScript is a statically typed superset of JavaScript...",
    tags: ["typescript", "javascript", "programming"]
  },
  {
    id: "introduction-to-machine-learning",
    title: "Introduction to Machine Learning",
    excerpt: "A beginner's guide to machine learning concepts",
    category: "ai",
    date: "2023-09-05",
    content: "Machine learning is a subset of artificial intelligence...",
    tags: ["machine-learning", "ai", "data-science"]
  },
  {
    id: "building-restful-apis",
    title: "Building RESTful APIs",
    excerpt: "Learn how to design and implement RESTful APIs",
    category: "web-development",
    date: "2023-06-10",
    content: "RESTful APIs are an essential part of modern web development...",
    tags: ["api", "rest", "backend"]
  },
  {
    id: "deploying-with-docker",
    title: "Deploying Applications with Docker",
    excerpt: "A guide to containerizing your applications with Docker",
    category: "technology",
    date: "2023-08-30",
    content: "Docker is a platform for developing, shipping, and running applications...",
    tags: ["docker", "devops", "deployment"]
  },
  {
    id: "portfolio-website-nextjs",
    title: "Creating a Portfolio Website with Next.js",
    excerpt: "Step-by-step guide to build your personal portfolio",
    category: "projects",
    date: "2023-07-05",
    content: "A portfolio website is essential for showcasing your work...",
    tags: ["portfolio", "nextjs", "web-development"]
  }
];

export function getPostsByCategory(category: string): Post[] {
  if (category === "all") {
    return posts;
  }
  return posts.filter(post => post.category === category);
}

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getAllCategories(): string[] {
  const categories = new Set(posts.map(post => post.category));
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const tags = new Set(posts.flatMap(post => post.tags));
  return Array.from(tags);
} 