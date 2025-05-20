import { NextRequest, NextResponse } from 'next/server';
import { importMarkdownFilesToDb, exportDbItemsToMarkdown } from '@/lib/markdown';

export async function POST(req: NextRequest) {
  try {
    const { action, workspaceId, authorId } = await req.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required (import or export)' },
        { status: 400 }
      );
    }

    let result;

    if (action === 'import') {
      if (!workspaceId || !authorId) {
        return NextResponse.json(
          { error: 'workspaceId and authorId are required for import' },
          { status: 400 }
        );
      }
      
      result = await importMarkdownFilesToDb(
        Number(workspaceId), 
        Number(authorId)
      );
      
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${result.length} markdown files`,
        data: result,
      });
    } 
    
    if (action === 'export') {
      result = await exportDbItemsToMarkdown();
      
      return NextResponse.json({
        success: true,
        message: `Successfully exported ${result.length} items to markdown files`,
        data: result,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "import" or "export"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error processing markdown operation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process markdown operation' },
      { status: 500 }
    );
  }
} 