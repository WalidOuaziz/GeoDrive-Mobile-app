import { neon } from "@neondatabase/serverless";

export async function GET(params:type) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const response = await sql`
            SELECT * FROM drivers
        `;

        return Response.json({ data : response })
    } catch (error) {
        console.log(error);
        return Response.json({error: error})
    }
}