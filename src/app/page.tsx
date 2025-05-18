import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">EdPsych-AI</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  EdPsych-AI Education Platform
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  A comprehensive AI-powered education platform for educational psychologists, teachers, students, and parents.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-90">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                    EdPsych-AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers a wide range of features to support educational psychology and enhance learning experiences.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Comprehensive assessment tools for cognitive, literacy, numeracy, and behavioral evaluation.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resource Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Extensive collection of educational resources aligned with UK curriculum standards.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Professional Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>CPD tracking, professional portfolio management, and mentor matching for educators.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Parent-School Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Tools for enhancing communication and collaboration between parents and schools.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Detailed analytics and reporting for tracking student progress and educator performance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Adventure Quest Saga</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Gamified learning experiences that adapt to individual learning styles and preferences.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1">
            <div className="text-xl font-bold">EdPsych-AI</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Revolutionizing education through AI-powered tools and resources.
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 EdPsych Connect Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
