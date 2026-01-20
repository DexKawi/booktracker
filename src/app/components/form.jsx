import Form from "next/form"
import { useRef } from "react"
import { Input } from "./input"
import { addBook } from "../lib/actions"
import { useRouter } from 'next/navigation'

export function FormAdd() {
    const formRef = useRef(null)
    const router = useRouter()

    async function handleSubmit(formData) {
        const result = await addBook({
            title: formData.get('title'),
            author: formData.get('author'),
            summary: formData.get('summary'),
            cover_url: formData.get('cover_url')
        })

        if (result.success) {
            alert(`Buku berhasil ditambah dengan ID: ${result.bookId}`)
            formRef.current?.reset()
            router.refresh()
        } else {
            alert(`Error: ${result.error}`)
        }
    }

    return (
        <div className="border border-[#313131] w-fit p-2 rounded-sm">
            <Form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                <Input label="Book Title" id="title" name="title" type="text" placeholder="e.g. The Great Gatsby" />
                <Input label="Author" id="author" name="author" type="text" placeholder="e.g. F.Scott Fitzgerald" />
                <Input label="Summary" id="summary" name="summary" type="text" placeholder="e.g. I've read chapter..." />
                <Input label="Cover" id="cover_url" name="cover_url" type="url" placeholder="e.g. Image URL" />
                <button type="submit">Add entry</button>
            </Form>
        </div>
    )
}