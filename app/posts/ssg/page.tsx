import { Metadata } from "next"

interface Post {
    id: number;
    title: string;
    content: string;
    description: string;
};

export const metadata: Metadata = {
    title: 'Posts (SSG)',
    description: 'Static-Site Generated Posts with Incremental Static Regeneration and Pagination',
}

const POSTS_PER_PAGE = 10

export const generateStatisParams = async() => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        next: { tags: [ 'posts '],
            revalidate: 60,
        }
    })

    const posts: Post[] = await res.json();

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    return Array.from({ length: totalPages }, (_, i) => ({
        page: (i + 1).toString(),
    }));
}

export default async function PostsSSGPage({ searchParams }: { searchParams: { page? : string }}) {
    const currentPage = parseInt(searchParams.page || '1', 10);
    const body = new FormData()
    body.set("page", String(1))
    body.set("limit", String(1))
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
            method: "POST",
            body, 
            next: {
                tags: [ 'posts'],
                revalidate: 60,
            }
        }
    )

    const posts: Post[] = await res.json();
    
    const nextPage = currentPage + 1;
    const hasMore = posts.length === POSTS_PER_PAGE;

    return (
        <div>
            <h1>Posts (SSG)</h1>
            <div>
                {posts.map((post) => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
            {hasMore && (
                <a href={`?page=${nextPage}`}>
                    Load More
                </a>
            )}
        </div>
    )
}