import { Metadata } from 'next'
import { Educator } from '@/components/educator'

export const metadata: Metadata = {
  title: 'Educator | EdPsych Connect',
  description: 'Educator portal for EdPsych Connect educational platform',
}

export default function EducatorPage() {
  return <Educator />
}
