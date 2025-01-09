'use client';

import { useState } from 'react';

type Post = {
    id: number;
    title: string;
    content: string;
    description: string;
};

type PostsPageProps = {
    initialPosts: Post[];
    totalPages: number;
};

const POSTS_PER_LOAD = 9;

export default function PostsSSGPage({ initialPosts, totalPages }: PostsPageProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [currentPage, setCurrentPage] = useState(1);

    const loadMorePosts = async () => {
        if (currentPage >= totalPages) return;
    
        const nextPage = currentPage + 1;
        const body = new FormData()
        body.set("page", nextPage.toString())
        body.set("limit", POSTS_PER_LOAD.toString())
        const res = await fetch(`/api/posts`, {
            method: "POST",
            body,
        });
        const newPosts: Post[] = await res.json();
    
        // Deduplicate posts by ID to avoid duplicate keys
        const uniquePosts = newPosts.filter((newPost) => !posts.some((post) => post.id === newPost.id));
    
        setPosts((prev) => [...prev, ...uniquePosts]);
        setCurrentPage(nextPage);
    };

    return (
        <div className="p-4">
        <h1 className="text-center text-2xl font-bold mb-4">Posts (SSG)</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
            <div
                key={post.id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.description}</p>
                <p className="mt-2">{post.content}</p>
            </div>
            ))}
        </div>
        {currentPage < totalPages && (
            <button
            className="block mx-auto mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={loadMorePosts}
            >
            Load More
            </button>
        )}
        </div>
    );
}