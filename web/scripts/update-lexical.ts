import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const SOURCE_DIR = path.resolve(process.cwd(), 'lexical');
const TARGET_DIR = path.resolve(process.cwd(), 'lexical-use-client');
const USE_CLIENT_DIRECTIVE = "'use client';\n\n";

// Check if a file is binary
function isBinaryFile(filePath: string): boolean {
  // Read the first 4KB of the file
  const buffer = Buffer.alloc(4096);
  const fd = fs.openSync(filePath, 'r');
  const bytesRead = fs.readSync(fd, buffer, 0, 4096, 0);
  fs.closeSync(fd);
  
  // Only check the bytes that were actually read
  const bytes = buffer.slice(0, bytesRead);
  
  // Check for null bytes (a good indicator of binary content)
  if (bytes.includes(0)) return true;
  
  // Count control characters (non-printing ASCII and non-ASCII)
  let controlChars = 0;
  let totalChars = 0;
  
  for (let i = 0; i < bytesRead; i++) {
    totalChars++;
    const byte = bytes[i];
    
    // Control characters (except common whitespace like \n, \r, \t)
    if ((byte < 32 && ![9, 10, 13].includes(byte)) || byte >= 127) {
      controlChars++;
    }
  }
  
  // If more than 10% of the characters are control characters, consider it binary
  return totalChars > 0 && (controlChars / totalChars) > 0.1;
}

// Create directories if they don't exist
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Process a file - add 'use client' directive if needed
function processFile(sourcePath: string, targetPath: string) {
  // Check if file is binary
  if (isBinaryFile(sourcePath)) {
    // Copy binary file directly without text processing
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied binary file: ${path.relative(process.cwd(), targetPath)}`);
    return;
  }
  
  // Process text files
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Add 'use client' directive to .tsx files only
  if (targetPath.endsWith('.tsx')) {
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      content = USE_CLIENT_DIRECTIVE + content;
    }
  }

  // Write the processed file
  fs.writeFileSync(targetPath, content);
  console.log(`Processed: ${path.relative(process.cwd(), targetPath)}`);
}

// Copy a directory recursively
function copyDirectory(source: string, target: string) {
  ensureDirectoryExists(target);
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      processFile(sourcePath, targetPath);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Copying Lexical files with "use client" directive...');
    
    // Clear target directory if it exists
    if (fs.existsSync(TARGET_DIR)) {
      console.log('Clearing previous files...');
      fs.rmSync(TARGET_DIR, { recursive: true, force: true });
    }
    
    // Create target directory
    ensureDirectoryExists(TARGET_DIR);
    
    // Copy directories
    console.log('Copying files...');
    copyDirectory(SOURCE_DIR, TARGET_DIR);
    
    console.log('Update completed successfully!');
    
  } catch (error) {
    console.error('Error updating Lexical:', error);
    process.exit(1);
  }
}

main(); 