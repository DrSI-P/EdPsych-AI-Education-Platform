import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogCommentForm } from './BlogCommentForm';
import { BlogCommentList } from './BlogCommentList';
import { BlogRelatedPosts } from './BlogRelatedPosts';

interface BlogPostViewProps {
  post: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImage?: string | null;
    publishedAt: string | Date | null;
    keyStage?: string | null;
    curriculumArea?: string | null;
    tags: string[];
    readingTime?: number | null;
    readingLevel?: string | null;
    viewCount: number;
    likeCount: number;
    aiGenerated?: boolean;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    categories?: {
      category: {
        id: string;
        name: string;
        slug: string;
      };
    }[];
    relatedResources?: {
      id: string;
      title: string;
      url: string;
      type: string;
      description?: string | null;
    }[];
  };
  relatedPosts?: any[];
  onLike?: () => void;
  isLikeLoading?: boolean;
}

export function BlogPostView({
  post,
  relatedPosts = [],
  onLike,
  isLikeLoading = false
}: BlogPostViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === post.author.id;
  const isAdmin = session?.user?.role === 'admin';
  const isTeacher = session?.user?.role === 'teacher';
  const canEdit = isAuthor || isAdmin || isTeacher;
  
  // Format the published date
  const publishedDate = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : 'Draft';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image || undefined} alt={post.author.name || 'Author'} />
              <AvatarFallback>{post.author.name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <span>{post.author.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{publishedDate}</span>
          </div>
          
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{post.readingTime} min read</span>
            </div>
          )}
          
          {post.viewCount > 0 && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{post.viewCount} views</span>
            </div>
          )}
          
          {post.aiGenerated && (
            <Badge variant="outline" className="ml-auto">
              AI Generated
            </Badge>
          )}
        </div>
        
        {/* Categories and tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories?.map(({ category }) => (
            <Badge key={category.id} variant="secondary" className="cursor-pointer" onClick={() => router.push(`/blog/category/${category.slug}`)}>
              {category.name}
            </Badge>
          ))}
          
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => router.push(`/blog/tag/${encodeURIComponent(tag)}`)}>
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* Educational metadata */}
        {(post.keyStage || post.curriculumArea || post.readingLevel) && (
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            {post.keyStage && (
              <div>
                <span className="font-semibold">Key Stage:</span> KS{post.keyStage}
              </div>
            )}
            
            {post.curriculumArea && (
              <div>
                <span className="font-semibold">Subject:</span> {post.curriculumArea}
              </div>
            )}
            
            {post.readingLevel && (
              <div>
                <span className="font-semibold">Reading Level:</span> {post.readingLevel}
              </div>
            )}
          </div>
        )}
        
        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
      
      {/* Post Content */}
      <div 
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Post Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLike} 
            disabled={isLikeLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const shareData = {
                title: post.title,
                text: post.summary,
                url: window.location.href,
              };
              
              if (navigator.share && navigator.canShare(shareData)) {
                navigator.share(shareData);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share
          </Button>
        </div>
        
        {canEdit && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/blog/edit/${post.slug}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Post
          </Button>
        )}
      </div>
      
      <Separator className="my-8" />
      
      {/* Tabs for comments and resources */}
      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments" className="pt-6">
          {session ? (
            <BlogCommentForm postId={post.id} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Please sign in to leave a comment.
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => router.push('/auth/signin')}>
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8">
            <BlogCommentList postId={post.id} />
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="pt-6">
          {post.relatedResources && post.relatedResources.length > 0 ? (
            <div className="grid gap-4">
              {post.relatedResources.map(resource => (
                <Card key={resource.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                  </CardHeader>
                  {resource.description && (
                    <CardContent className="p-4 pt-2 pb-2">
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </CardContent>
                  )}
                  <CardFooter className="p-4 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Access Resource
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No related resources available for this post.
            </p>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <BlogRelatedPosts posts={relatedPosts} />
        </div>
      )}
    </div>
  );
}
