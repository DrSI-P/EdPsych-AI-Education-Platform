import { Metadata } from 'next'
import { SpecialNeeds } from '@/components/special-needs'

export const metadata: Metadata = {
  title: 'Special Needs | EdPsych Connect',
  description: 'Special Needs portal for EdPsych Connect educational platform',
}

export default function SpecialNeedsPage() {
  return <SpecialNeeds />
}
