import { Metadata } from 'next'
import { Assessment } from '@/components/assessment'

export const metadata: Metadata = {
  title: 'Assessment | EdPsych Connect',
  description: 'Assessment portal for EdPsych Connect educational platform',
}

export default function AssessmentPage() {
  return <Assessment />
}
