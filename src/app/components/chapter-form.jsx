"use client"

import Form from "next/form"
import { useRef } from "react"
import { Input } from "./input"
import { addChapter, updateChapter } from "../lib/actions"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { X } from "lucide-react"

export function ChapterForm({ bookId, editData, onClose }) {
    const formRef = useRef(null)
    const router = useRouter()

    const numericBookId = parseInt(bookId.replace("book_", ""))

    async function handleSubmit(formData) {
        if (editData) {
            const result = await updateChapter({
                id: editData.id,
                book_id: numericBookId,
                chapter_num: parseInt(formData.get("chapter_num")),
                chapter_summary: formData.get("chapter_summary")
            })

            if (result.success) {
                alert(`Chapter edited successfully!`)
                formRef.current?.reset()
                router.refresh()
            } else {
                alert(`Error: ${result.error}`)
            }
        } else {
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
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="border border-[#313131] bg-[var(--background)] w-fit p-4 rounded-sm">
                <div className="flex justify-between">
                    <h3 className="font-semibold mb-2 flex-1">{editData ? "Edit Chapter Summary" : "Add New Chapter Summary"}</h3>
                    <X onClick={onClose} />
                </div>
                <Form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Chapter Number"
                        id="chapter_num"
                        name="chapter_num"
                        type="number"
                        min="0"
                        placeholder="e.g. 1"
                        defaultValue={editData?.chapter_num}
                    />
                    <Input
                        label="Chapter Summary"
                        id="chapter_summary"
                        name="chapter_summary"
                        type="text"
                        placeholder="e.g. In this chapter, the protagonist..."
                        defaultValue={editData?.chapter_summary}
                    />
                    <Button>
                        <button type="submit">{editData ? "Save Changes" : "Add Chapter"}</button>
                    </Button>
                </Form>
            </div>
        </div>
    )
}