import React from 'react';
import Link from 'next/link';
import { UILink } from '@/components/ui';

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <UILink href="/" className="text-xl font-bold text-indigo-600">
                EdPsych Connect
              </UILink>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <UILink href="/blog" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Blog
              </UILink>
              <UILink href="/resources" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Resources
              </UILink>
              <UILink href="/faq" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                FAQ
              </UILink>
              <UILink href="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </UILink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UILink href="/auth/signin" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Sign in
            </UILink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
