import { Metadata } from 'next'
import { Parent } from '@/components/parent'

export const metadata: Metadata = {
  title: 'Parent | EdPsych Connect',
  description: 'Parent portal for EdPsych Connect educational platform',
}

export default function ParentPage() {
  return <Parent />
}
