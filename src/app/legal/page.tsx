import { Metadata } from 'next'
import { Legal } from '@/components/legal'

export const metadata: Metadata = {
  title: 'Legal | EdPsych Connect',
  description: 'Legal portal for EdPsych Connect educational platform',
}

export default function LegalPage() {
  return <Legal />
}
