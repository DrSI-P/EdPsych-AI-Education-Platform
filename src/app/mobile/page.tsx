import { Metadata } from 'next'
import { Mobile } from '@/components/mobile'

export const metadata: Metadata = {
  title: 'Mobile | EdPsych Connect',
  description: 'Mobile portal for EdPsych Connect educational platform',
}

export default function MobilePage() {
  return <Mobile />
}
