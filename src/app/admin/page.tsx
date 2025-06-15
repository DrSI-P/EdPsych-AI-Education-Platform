import { Metadata } from 'next'
import { Admin } from '@/components/admin'

export const metadata: Metadata = {
  title: 'Admin | EdPsych Connect',
  description: 'Admin portal for EdPsych Connect educational platform',
}

export default function AdminPage() {
  return <Admin />
}
