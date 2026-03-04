import connection from "@/app/lib/db"

export async function GET() {
    try {
        const [rows] = await connection.query("SELECT * FROM user_summary ORDER BY id")
        return Response.json([...rows])
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}