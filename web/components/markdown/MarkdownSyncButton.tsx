import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { FileText, Upload, Download } from 'lucide-react';

interface MarkdownSyncButtonProps {
    workspaceId: number;
    authorId: number;
}

export function MarkdownSyncButton({ workspaceId, authorId }: MarkdownSyncButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const importMarkdown = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/markdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'import',
                    workspaceId,
                    authorId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to import markdown files');
            }

            toast.success(`Imported ${data.data.length} markdown files`);
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to import markdown files');
        } finally {
            setIsLoading(false);
        }
    };

    const exportMarkdown = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/markdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'export'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to export to markdown files');
            }

            toast.success(`Exported ${data.data.length} items to markdown files`);
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to export to markdown files');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Markdown Sync
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Markdown Sync</DialogTitle>
                    <DialogDescription>
                        Import markdown files from the /md directory or export content to markdown files.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium">Import Markdown Files</h3>
                        <p className="text-sm text-muted-foreground">
                            Import all markdown files from the /md directory into the database.
                        </p>
                        <Button
                            onClick={importMarkdown}
                            disabled={isLoading}
                            variant="outline"
                            className="mt-2"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Import Files
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium">Export to Markdown</h3>
                        <p className="text-sm text-muted-foreground">
                            Export all content from the database to markdown files in the /md directory.
                        </p>
                        <Button
                            onClick={exportMarkdown}
                            disabled={isLoading}
                            variant="outline"
                            className="mt-2"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Content
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 