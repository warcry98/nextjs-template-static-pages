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

const POSTS_PER_PAGE = 9

export const generateStaticParams = async() => {
    const body = new FormData()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        body,
        // next: { tags: [ 'posts '],
        //     revalidate: 60,
        // }
    })

    const posts: Post[] = await res.json();

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    return Array.from({ length: totalPages }, (_, i) => ({
        page: (i + 1).toString()
    }));
}

export default async function PostsSSGPage(props: { searchParams: Promise<{ page? : string }>}) {
    const searchParams = (await props.searchParams);
    const currentPage = parseInt(searchParams.page || '1', 10);
    console.log(currentPage)
    const body = new FormData()
    body.set("page", String(currentPage))
    body.set("limit", String(POSTS_PER_PAGE))
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
            method: "POST",
            body, 
            // next: {
            //     tags: [ 'posts'],
            //     revalidate: 60,
            // }
        }
    )

    const posts: Post[] = await res.json();
    console.log(posts)

    const nextPage = currentPage + 1;
    const hasMore = posts.length === POSTS_PER_PAGE;

    return (
        <div className="p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Posts (SSG)</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <div key={post.id}
                        className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-sm text-gray-500">{post.description}</p>
                        <p className="mt-2">{post.content}</p>
                    </div>
                ))}
            </div>
            {hasMore && (
                <a href={`?page=${nextPage}`}
                    className="block mx-auto mt-6 px-4 py-2 bg-blue-500 text-white rounded text-center"
                >
                    Load More
                </a>
            )}
        </div>
    )
}