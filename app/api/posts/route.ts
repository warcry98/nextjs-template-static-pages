import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path";
interface Post {
    id: number;
    title: string;
    content: string;
    description: string;
};

const posts: Post[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "data.json"), "utf8"));

export const GET = (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    console.log(searchParams)
    // const { page = 1, limit = 10 } = req.query;

    // const start = (Number(page) - 1) * Number(limit);
    // const end = start + Number(limit);

    // res.status(200).json(posts.slice(start, end));
}

export const POST = async (req: Request) => {
    const formData = await req.formData()
    const page = formData.get('page')
    const limit = formData.get('limit')
    // const { page = 1, limit = 10 } = req.query;
    if (page && limit) {
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);

        // res.status(200).json(posts.slice(start, end));
        return NextResponse.json(posts.slice(start, end))
    } else {
        return NextResponse.json(posts)
    }
}