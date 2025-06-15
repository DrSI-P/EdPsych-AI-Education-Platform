import { Metadata } from 'next'
import { SubscriptionManagement } from '@/components/subscription'

export const metadata: Metadata = {
  title: 'Subscription | EdPsych Connect',
  description: 'Subscription portal for EdPsych Connect educational platform',
}

export default function SubscriptionPage() {
  return <SubscriptionManagement />
}
