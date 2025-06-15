import { Metadata } from 'next'
import { Student } from '@/components/student'

export const metadata: Metadata = {
  title: 'Student | EdPsych Connect',
  description: 'Student portal for EdPsych Connect educational platform',
}

export default function StudentPage() {
  return <Student />
}
