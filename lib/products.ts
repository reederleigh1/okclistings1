export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  tier: "premium"
  duration: string
}

export const PRODUCTS: Product[] = [

{
    id: "premium-listing",
    name: "Premium Listing",
    description: "Maximum exposure for your job posting",
    priceInCents: 1000, // $10
    tier: "premium",
    duration: "30 days",
    features: [
      "30-day listing",
      "Top placement",
      "Homepage featured",
      "Dedicated support",
      "Social media promotion",
      "Email blast to subscribers",
    ],
  },
]
