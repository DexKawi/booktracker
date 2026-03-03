"use server"

import connection from "./db"
import { revalidatePath } from "next/cache"

export async function addBook(data) {
    try {
        const [lastId] = await connection.query("SELECT id FROM book ORDER BY id DESC LIMIT 1")
        const [lastbookId] = await connection.query("SELECT book_id FROM book ORDER BY book_id DESC LIMIT 1")

        let newBookId
        let id = lastId.length > 0 ? lastId[0].id + 1 : null

        if (lastbookId.length > 0) {
            const lastId = lastbookId[0].book_id
            const numPart = parseInt(lastId.replace('book_', ''))
            newBookId = `book_${String(numPart + 1).padStart(3, '0')}`
        }

        await connection.query(
            `INSERT INTO book (id, book_id, title, author, summary, cover_url, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                newBookId,
                data.title,
                data.author,
                data.summary,
                data.cover_url,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                new Date().toISOString().slice(0, 19).replace('T', ' ')

            ]
        )

        revalidatePath("/books")

        return { success: true, bookId: newBookId }
    } catch (error) {
        console.error('Error adding book:', error)
        return { success: false, error: error.message }
    }

}

export async function updateBook(data) {
    try {
        await connection.query(
            "UPDATE `book` SET `title` = ?, `author` = ?, `summary` = ?, `cover_url` = ? WHERE `book`.`id` = ?",
            [data.title, data.author, data.summary, data.cover_url, data.id]
        )
        return { success: true, message: `Book updated successfully!` }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function deleteBook(id) {
    try {
        await connection.query(
            "DELETE FROM book WHERE `book`.`id` = ?", [id]
        )
        return { success: true, message: `Book: ${id} deleted successfully!` }
    } catch (error) {
        return { success: false, error: error.message }
    }
}


export async function addChapter(data) {
    try {
        const [lastId] = await connection.query(
            "SELECT id FROM user_summary ORDER BY id DESC LIMIT 1"
        )

        const newId = lastId.length > 0 ? lastId[0].id + 1 : 1

        const { book_id, chapter_num, chapter_summary } = data

        const [lastChapter] = await connection.query(
            'SELECT chapter_num FROM user_summary WHERE `book_id`=? ORDER BY chapter_num DESC', [book_id]
        )

        if (lastChapter[0].chapter_num === chapter_num) {
            return { success: false, error: "That chapter is already exist!" }
        } else {
            await connection.query(
                `INSERT INTO user_summary(id, book_id, chapter_num, chapter_summary)
            VALUES (?,?,?,?)`,
                [
                    newId,
                    book_id,
                    chapter_num,
                    chapter_summary
                ]
            )
            revalidatePath(`/books/${data.book_id}`)
            return { success: true, chapterId: newId }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateChapter(data) {
    try {
        await connection.query(
            "UPDATE `user_summary` SET `chapter_num` = ?, `chapter_summary` = ? WHERE `id` = ?",
            [data.chapter_num, data.chapter_summary, data.id]
        )
        await connection.query(
            "UPDATE `book` SET `updated_at` = ? WHERE `book`.`id` = ?",
            [new Date().toISOString().slice(0, 19).replace('T', ' '), data.book_id]
        )
        return { success: true, message: "Chapter updated successfully!" }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function deleteChapter(chapNum) {
    try {
        await connection.query("DELETE FROM `user_summary` WHERE `user_summary`.`id` = ?", [chapNum])

        return { success: true, message: `Chapter has been deleted successfully!` }
    } catch (error) {
        return { success: false, error: error.message }
    }
}