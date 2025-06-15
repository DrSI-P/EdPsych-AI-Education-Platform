import { Metadata } from 'next'
import { CurriculumContent } from '@/components/curriculum-content'

export const metadata: Metadata = {
  title: 'Curriculum Content | EdPsych Connect',
  description: 'Curriculum Content portal for EdPsych Connect educational platform',
}

export default function CurriculumContentPage() {
  return <CurriculumContent />
}
