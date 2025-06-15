import { Metadata } from 'next'
import { Professional } from '@/components/professional'

export const metadata: Metadata = {
  title: 'Professional | EdPsych Connect',
  description: 'Professional portal for EdPsych Connect educational platform',
}

export default function ProfessionalPage() {
  return <Professional />
}
