import PostsSSGPage from './_components/ssgpage';

type Post = {
    id: number;
    title: string;
    content: string;
    description: string;
};

const POSTS_PER_PAGE = 9;

export async function generateStaticParams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
    const posts: Post[] = await res.json();

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    return Array.from({ length: totalPages }, (_, i) => ({
        page: (i + 1).toString(),
    }));
}

export async function generateMetadata() {
    return {
        title: 'Posts SSG with Load More',
        description: 'Static Site Generated Posts with Pagination and Load More functionality',
    };
}

export default async function Page(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = (await props.searchParams);
    const currentPage = parseInt(searchParams.page || '1', 10);

    const body = new FormData()
    body.set("page", currentPage.toString())
    body.set("limit", POSTS_PER_PAGE.toString())

    const res = await fetch(
        `/api/posts`, {
            method: "POST",
            body,
        }
    );
    const initialPosts: Post[] = await res.json();

    const form = new FormData()
    const totalPostsRes = await fetch(`/api/posts`, {
        method: "POST",
        body: form,
    });
    const totalPosts: Post[] = await totalPostsRes.json();

    const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);

    return (
        <PostsSSGPage initialPosts={initialPosts} totalPages={totalPages} />
    );
}