---
description: How to implement the "Add Chapter Summary" feature
---

# 📖 Add Chapter Summary Feature

This workflow outlines how to implement a feature that allows users to add a new summary for a book chapter.

---

## Overview

You already have a partially implemented `addChapter` function in `src/app/lib/actions.js` (lines 46-64). This workflow will guide you through completing it and creating the UI components.

### Database Table Structure (for reference)
Based on your existing code, the `user_summary` table has:
- `id` — Primary key
- `book_id` — Reference to the book
- `chapter_num` — Chapter number
- `chapter_summary` — The user's summary text

---

## Step 1: Fix the `addChapter` Server Action

**File:** `src/app/lib/actions.js`

Your current `addChapter` function has undefined variables. Update it to receive data properly:

```javascript
export async function addChapter(data) {
    try {
        // Get the next available ID
        const [lastId] = await connection.query(
            "SELECT id FROM user_summary ORDER BY id DESC LIMIT 1"
        )
        const newId = lastId.length > 0 ? lastId[0].id + 1 : 1

        await connection.query(
            `INSERT INTO user_summary (id, book_id, chapter_num, chapter_summary)
             VALUES (?, ?, ?, ?)`,
            [
                newId,
                data.book_id,        // e.g., 1, 2, 3 (numeric)
                data.chapter_num,    // e.g., 1, 2, 3
                data.chapter_summary // The summary text
            ]
        )

        revalidatePath(`/books/${data.book_id}`)

        return { success: true, chapterId: newId }
    } catch (error) {
        console.error('Error adding chapter:', error)
        return { success: false, error: error.message }
    }
}
```

### Key Points:
- Extract `book_id`, `chapter_num`, and `chapter_summary` from the `data` parameter
- Generate a new `id` by querying the last ID
- Return success/failure status like `addBook` does

---

## Step 2: Create the Chapter Form Component

**File:** `src/app/components/chapter-form.jsx` (new file)

Create a new form component specifically for adding chapter summaries:

```jsx
"use client"

import Form from "next/form"
import { useRef } from "react"
import { Input } from "./input"
import { addChapter } from "../lib/actions"
import { useRouter } from "next/navigation"

export function ChapterForm({ bookId }) {
    const formRef = useRef(null)
    const router = useRouter()

    // Convert book_id string (e.g., "book_001") to number
    const numericBookId = parseInt(bookId.replace("book_", ""))

    async function handleSubmit(formData) {
        const result = await addChapter({
            book_id: numericBookId,
            chapter_num: parseInt(formData.get("chapter_num")),
            chapter_summary: formData.get("chapter_summary")
        })

        if (result.success) {
            alert(`Chapter added successfully!`)
            formRef.current?.reset()
            router.refresh()
        } else {
            alert(`Error: ${result.error}`)
        }
    }

    return (
        <div className="border border-[#313131] w-fit p-4 rounded-sm mt-4">
            <h3 className="font-semibold mb-2">Add New Chapter Summary</h3>
            <Form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Chapter Number"
                    id="chapter_num"
                    name="chapter_num"
                    type="number"
                    placeholder="e.g. 1"
                />
                <Input
                    label="Chapter Summary"
                    id="chapter_summary"
                    name="chapter_summary"
                    type="text"
                    placeholder="e.g. In this chapter, the protagonist..."
                />
                <button type="submit">Add Chapter</button>
            </Form>
        </div>
    )
}
```

### Key Points:
- Accepts `bookId` as a prop (e.g., `"book_001"`)
- Converts string book ID to numeric format for database
- Uses the same `Input` component you already have

---

## Step 3: Integrate the Form into the Book Detail Page

**File:** `src/app/books/[id]/page.jsx`

Import and add the `ChapterForm` component to your book detail page:

```jsx
import { ChapterForm } from "@/app/components/chapter-form"

// Inside your component's return statement, add:
<ChapterForm bookId={id} />
```

Place it wherever makes sense—likely below or alongside the `BookChapter` component.

---

## Step 4: Update BookChapter to Refresh After Adding

**File:** `src/app/components/book-chapter.jsx`

To make new chapters appear without a full page refresh, you have two options:

### Option A: Use `router.refresh()` (simpler)
The form already calls `router.refresh()`, which will trigger a re-render. If your page is set up correctly, this should work.

### Option B: Add a refresh trigger (more control)
Pass a callback or use a state management approach to trigger `fetchSummary()` again after adding a chapter.

---

## Step 5: (Optional) Add a Textarea for Longer Summaries

**File:** `src/app/components/input.jsx`

If you want to support longer summaries, consider creating a `Textarea` variant:

```jsx
export function Textarea({ label, id, name, placeholder }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={id}>{label}</label>
            <textarea
                className="border border-[#313131] p-2 rounded-sm min-h-[100px]"
                id={id}
                name={name}
                placeholder={placeholder}
            />
        </div>
    )
}
```

Then use `<Textarea>` instead of `<Input>` for the chapter summary field.

---

## Summary Checklist

| Step | File | Action |
|------|------|--------|
| 1 | `src/app/lib/actions.js` | Fix `addChapter` function |
| 2 | `src/app/components/chapter-form.jsx` | Create new form component |
| 3 | `src/app/books/[id]/page.jsx` | Import and use `ChapterForm` |
| 4 | `src/app/components/book-chapter.jsx` | (Optional) Add refresh mechanism |
| 5 | `src/app/components/input.jsx` | (Optional) Add `Textarea` component |

---

## Testing

1. Navigate to a book's detail page (e.g., `/books/book_001`)
2. Fill in the chapter number and summary
3. Click "Add Chapter"
4. Verify the new chapter appears in the chapter list
5. Test navigation between chapters with the chevron buttons

---

## Common Gotchas

⚠️ **book_id format mismatch**: Your `book-chapter.jsx` uses `parseInt(bookId.replace('book_', ''))` to filter. Make sure you're storing the numeric ID in `user_summary.book_id`, not the string format.

⚠️ **API limit**: Your `get-user-summary` route has `LIMIT 5`. You may want to remove this limit or increase it to see newly added chapters.

⚠️ **Duplicate chapter numbers**: Consider adding validation to prevent duplicate chapter numbers for the same book.
