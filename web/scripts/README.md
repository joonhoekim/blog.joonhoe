# Scripts Directory

This directory contains utility scripts for the project.

## Lexical Editor Integration

### update-lexical.ts

This script handles copying and adapting the Lexical editor from the submodule to work with Next.js.

#### What it does:

1. Updates the Lexical submodule to get the latest version
2. Copies the **all** components to `@/lexical-use-client/`
3. Adds the `'use client'` directive to all TSX files

#### How to use:

1. Execute the script.

```bash
# Run the update script
npm run update-lexical

# Or with PNPM
pnpm update-lexical
```

#### Customizing:

To customize which files get copied or excluded, edit the `EXCLUDE_LIST` in `update-lexical.ts`.
