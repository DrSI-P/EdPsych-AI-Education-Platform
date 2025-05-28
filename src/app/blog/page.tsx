'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';
import EducationalAIBlog from '@/components/blog/educational-ai-blog';
import BlogPostEditor from "@/components/blog/blog-post-editor";
import BlogPostDetail from "@/components/blog/blog-post-detail";
import CommentModerationDashboard from "@/components/blog/comment-moderation-dashboard";

const BlogPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="view">View Post</TabsTrigger>
          <TabsTrigger value="moderate">Moderation</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <EducationalAIBlog />
        </TabsContent>
        <TabsContent value="create">
          <BlogPostEditor />
        </TabsContent>
        <TabsContent value="view">
          <BlogPostDetail />
        </TabsContent>
        <TabsContent value="moderate">
          <CommentModerationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPage;
