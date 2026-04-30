export type DashboardBookingStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'Cancelled'

export type DashboardBooking = {
  id: number
  bookingRef: string
  service: string
  category: string
  description: string
  customer: string
  customerEmail: string
  customerPhone: string
  customerCity: string
  customerCountry: string
  /** Calendar date (YYYY-MM-DD) */
  date: string
  scheduledAt: string
  /** Total charged */
  amount: number
  basePrice: number
  customOfferPrice: number | null
  status: DashboardBookingStatus
  customerApproved: boolean
  deliveryDays: number
  /** Deadline date YYYY-MM-DD */
  deadline: string
  /** 0–100 */
  deliveryProgress: number
  lastMessagePreview: string
  createdAt: string
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = new Date(ymd + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function bookingFromOffer(params: {
  id: number
  title: string
  customer: string
  amount: number
  dateYmd: string
}): DashboardBooking {
  const deliveryDays = 5
  return {
    id: params.id,
    bookingRef: `BK-${params.id + 1000}`,
    service: params.title,
    category: 'Custom offer',
    description: 'Created from an accepted custom offer in Messages.',
    customer: params.customer,
    customerEmail: '',
    customerPhone: '',
    customerCity: '',
    customerCountry: '',
    date: params.dateYmd,
    scheduledAt: '09:00',
    amount: params.amount,
    basePrice: Math.max(0, Math.round(params.amount * 0.85)),
    customOfferPrice: params.amount,
    status: 'Pending',
    customerApproved: false,
    deliveryDays,
    deadline: addDaysYmd(params.dateYmd, deliveryDays),
    deliveryProgress: 0,
    lastMessagePreview: 'Offer accepted — booking created.',
    createdAt: params.dateYmd,
  }
}
