import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface BlogPostViewProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    readingTime?: string;
    author?: {
      name: string;
      image?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    tags?: string[];
  };
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
  }>;
}

export function BlogPostView({ post, relatedPosts = [] }: BlogPostViewProps) {
  const router = useRouter();

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Post Header */}
      <header className="mb-8">
        {post.category && (
          <Link 
            href={`/blog/categories/${post.category.slug}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {post.category.name}
          </Link>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mt-2">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime || '5 min read'}</span>
        </div>
        {post.author && (
          <div className="mt-4 flex items-center">
            {post.author.image && (
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={post.author.image}
                  alt={post.author.name}
                />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {post.author.name}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="prose prose-indigo max-w-none dark:prose-invert educational-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Related Posts
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="group">
                <Link href={`/blog/${relatedPost.slug}`}>
                  {relatedPost.coverImage && (
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// Helper function for date formatting
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
