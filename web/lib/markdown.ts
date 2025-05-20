import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { db } from '@/db';
import { items } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Path to the markdown files directory
const MD_DIRECTORY = path.join(process.cwd(), 'md');

/**
 * Reads a markdown file and returns its content and frontmatter
 */
export async function readMarkdownFile(filename: string) {
  const filePath = path.join(MD_DIRECTORY, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter and content
  const { data, content } = matter(fileContents);
  
  // Convert markdown content to HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);
  
  const htmlContent = processedContent.toString();
  
  return {
    id: path.basename(filename, '.md'),
    frontmatter: data,
    markdown: content,
    html: htmlContent,
  };
}

/**
 * Reads all markdown files in the MD_DIRECTORY
 */
export async function getAllMarkdownFiles() {
  // Ensure the directory exists
  if (!fs.existsSync(MD_DIRECTORY)) {
    fs.mkdirSync(MD_DIRECTORY, { recursive: true });
    return [];
  }

  const filenames = fs.readdirSync(MD_DIRECTORY);
  const markdownFiles = filenames.filter(file => file.endsWith('.md'));
  
  const files = await Promise.all(
    markdownFiles.map(async (filename) => {
      const file = await readMarkdownFile(filename);
      return file;
    })
  );
  
  return files;
}

/**
 * Creates a new markdown file from content
 */
export function createMarkdownFile(id: string, title: string, content: string, metadata: Record<string, any> = {}) {
  // Create frontmatter
  const frontmatter = {
    title,
    date: new Date().toISOString(),
    ...metadata,
  };
  
  // Create the file content with frontmatter
  const fileContent = matter.stringify(content, frontmatter);
  
  // Ensure MD_DIRECTORY exists
  if (!fs.existsSync(MD_DIRECTORY)) {
    fs.mkdirSync(MD_DIRECTORY, { recursive: true });
  }
  
  // Write the file
  const filePath = path.join(MD_DIRECTORY, `${id}.md`);
  fs.writeFileSync(filePath, fileContent);
  
  return {
    id,
    frontmatter,
    markdown: content,
  };
}

/**
 * Updates an existing markdown file
 */
export function updateMarkdownFile(id: string, title: string, content: string, metadata: Record<string, any> = {}) {
  const filePath = path.join(MD_DIRECTORY, `${id}.md`);
  
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return createMarkdownFile(id, title, content, metadata);
  }
  
  // Read existing file
  const { data: existingFrontmatter } = matter(fs.readFileSync(filePath, 'utf8'));
  
  // Merge frontmatter data, prioritizing new metadata
  const frontmatter = {
    ...existingFrontmatter,
    title,
    ...metadata,
    // Always update the "updated" date
    updated: new Date().toISOString(),
  };
  
  // Create the file content with frontmatter
  const fileContent = matter.stringify(content, frontmatter);
  
  // Write the file
  fs.writeFileSync(filePath, fileContent);
  
  return {
    id,
    frontmatter,
    markdown: content,
  };
}

/**
 * Deletes a markdown file
 */
export function deleteMarkdownFile(id: string) {
  const filePath = path.join(MD_DIRECTORY, `${id}.md`);
  
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  // Delete the file
  fs.unlinkSync(filePath);
  return true;
}

/**
 * Imports all markdown files into the database
 */
export async function importMarkdownFilesToDb(workspaceId: number, authorId: number) {
  const markdownFiles = await getAllMarkdownFiles();
  const results = [];
  
  for (const file of markdownFiles) {
    const { id, frontmatter, markdown, html } = file;
    
    // Prepare item data
    const itemData = {
      title: frontmatter.title || `Untitled-${id}`,
      content: html,
      workspaceId,
      authorId,
      isPublished: frontmatter.published || false,
      metadata: {
        ...frontmatter,
        markdown,  // Store original markdown in metadata
        source: 'markdown-import',
      },
      tags: frontmatter.tags || [],
      publishedAt: frontmatter.published ? new Date(frontmatter.date || new Date()) : null,
    };
    
    // Insert or update in database
    const result = await db.insert(items).values(itemData)
      .onConflictDoUpdate({
        target: items.id,
        set: itemData,
      }).returning();
    
    results.push(result[0]);
  }
  
  return results;
}

/**
 * Exports database items to markdown files
 */
export async function exportDbItemsToMarkdown() {
  // Get all items from database
  const dbItems = await db.select().from(items);
  const results = [];
  
  for (const item of dbItems) {
    // Generate an ID based on title or item ID if no title
    const id = (item.title || `post-${item.id}`).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Extract markdown content if available, otherwise use HTML content
    const content = item.metadata?.markdown || item.content || '';
    
    // Prepare frontmatter
    const metadata = {
      title: item.title,
      date: item.createdAt?.toISOString(),
      updated: item.updatedAt?.toISOString(),
      published: item.isPublished,
      tags: item.tags || [],
      id: item.id,
      ...item.metadata,
    };
    
    // Create or update markdown file
    const result = updateMarkdownFile(id, item.title || '', content, metadata);
    results.push(result);
  }
  
  return results;
} 