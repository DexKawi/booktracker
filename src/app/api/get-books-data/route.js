import connection from "@/app/lib/db";

export async function GET() {
    try {
        const [rows] = await connection.query("SELECT * FROM book ORDER BY id ASC LIMIT 10");
        return Response.json([...rows]);
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 });
    }
}