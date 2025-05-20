#!/usr/bin/env node

import { program } from 'commander';
import { importMarkdownFilesToDb, exportDbItemsToMarkdown } from '../lib/markdown';

// Configure the CLI
program
  .name('md-sync')
  .description('Sync markdown files with database')
  .version('1.0.0');

// Import command
program
  .command('import')
  .description('Import markdown files from /md directory into the database')
  .requiredOption('-w, --workspace <id>', 'Workspace ID to import into', parseInt)
  .requiredOption('-a, --author <id>', 'Author ID for the imported content', parseInt)
  .action(async (options) => {
    try {
      console.log('Importing markdown files to database...');
      const results = await importMarkdownFilesToDb(options.workspace, options.author);
      console.log(`Successfully imported ${results.length} items.`);
      
      // Log each imported item
      results.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (ID: ${item.id})`);
      });
    } catch (error) {
      console.error('Error importing markdown files:', error);
      process.exit(1);
    }
  });

// Export command
program
  .command('export')
  .description('Export database items to markdown files in /md directory')
  .action(async () => {
    try {
      console.log('Exporting database items to markdown files...');
      const results = await exportDbItemsToMarkdown();
      console.log(`Successfully exported ${results.length} items.`);
      
      // Log each exported item
      results.forEach((item, index) => {
        console.log(`${index + 1}. ${item.frontmatter.title} (ID: ${item.id})`);
      });
    } catch (error) {
      console.error('Error exporting to markdown files:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv); 