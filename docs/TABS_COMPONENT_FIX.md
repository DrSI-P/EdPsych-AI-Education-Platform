# Tabs Component Fix

## Issue

The project was using the `Tabs` component from `@/components/ui/tabs` with custom props that were not compatible with the underlying Radix UI Tabs component. This was causing TypeScript errors during the build process.

The specific error was:

```
Type '{ children: string; type: string; className: string; }' is not assignable to type 'IntrinsicAttributes & AlertProps'.
Property 'type' does not exist on type 'IntrinsicAttributes & AlertProps'.
```

And:

```
Type 'Dispatch<SetStateAction<string>>' is not assignable to type 'FormEventHandler<HTMLDivElement>'.
Types of parameters 'value' and 'event' are incompatible.
```

## Root Cause

The `Tabs` component in `@/components/ui/tabs.tsx` was simply an alias for `TabsPrimitive.Root` from `@radix-ui/react-tabs`:

```tsx
export const Tabs = TabsPrimitive.Root;
```

However, it was being used with custom props that `TabsPrimitive.Root` doesn't accept:

```tsx
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'question-by-question', label: 'Question by Question' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  className="mb-6"
/>
```

## Solution

1. Created a new `SimpleTabs` component in `@/components/ui/tabs.tsx` that accepts the custom props:

```tsx
interface SimpleTabsProps {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SimpleTabs({ tabs, activeTab, onChange, className }: SimpleTabsProps) {
  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={onChange}
      className={className}
    >
      <TabsPrimitive.List className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
```

2. Updated the import and usage in `src/app/assessment/grade/[id]/page.tsx`:

```tsx
import { SimpleTabs } from '@/components/ui/tabs';

// ...

<SimpleTabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'question-by-question', label: 'Question by Question' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  className="mb-6"
/>
```

3. Created a script `fix-tabs-component.js` to update all other files that use the `Tabs` component with the same pattern:

```js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Files to update
const filesToUpdate = [
  'src/app/assessment/templates/page.tsx',
  'src/app/assessment/templates/create/page.tsx',
  'src/app/assessment/preview/[id]/page.tsx',
  'src/app/assessment/results/[id]/page.tsx',
  'src/app/assessment/pupil-voice/results/[id]/page.tsx',
  'src/app/assessment/pupil-voice/preview/[id]/page.tsx',
  'src/app/assessment/create/page.tsx',
  'src/app/assessment/curriculum/page.tsx',
  'src/app/assessment/ai-generate/page.tsx'
];

async function updateFile(filePath) {
  try {
    // Read the file
    const fullPath = path.join(process.cwd(), filePath);
    const content = await readFile(fullPath, 'utf8');

    // Update the import
    let updatedContent = content.replace(
      /import\s*{\s*([^}]*)\bTabs\b([^}]*)\s*}\s*from\s*['"]@\/components\/ui\/tabs['"];/,
      'import { $1SimpleTabs$2 } from \'@/components/ui/tabs\';'
    );

    // Update the component usage
    updatedContent = updatedContent.replace(
      /<Tabs(\s+)tabs={/g,
      '<SimpleTabs$1tabs={'
    );

    // Write the updated content back to the file
    await writeFile(fullPath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Updating Tabs component usage...');
  
  for (const file of filesToUpdate) {
    await updateFile(file);
  }
  
  console.log('Done!');
}

main().catch(console.error);
```

4. Added the script to `apply-all-fixes.js` to ensure it runs with all other fixes.

## Benefits

- Fixed TypeScript errors related to the Tabs component
- Maintained the existing UI and functionality
- Created a more type-safe component that explicitly defines its props
- Automated the fix for all affected files