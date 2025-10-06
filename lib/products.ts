export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  tier: "basic" | "featured" | "premium"
  duration: string
}

export const PRODUCTS: Product[] = [
  {
    id: "basic-listing",
    name: "Basic Listing",
    description: "Perfect for small businesses and one-time gigs",
    priceInCents: 1000, // $10
    tier: "basic",
    duration: "30 days",
    features: ["30-day listing", "Standard placement", "Basic job details", "Email notifications"],
  },
  {
    id: "featured-listing",
    name: "Featured Listing",
    description: "Get more visibility with featured placement",
    priceInCents: 7900, // $79
    tier: "featured",
    duration: "30 days",
    features: [
      "30-day listing",
      "Featured placement",
      "Highlighted in search",
      "Priority support",
      "Social media share",
    ],
  },
  {
    id: "premium-listing",
    name: "Premium Listing",
    description: "Maximum exposure for your job posting",
    priceInCents: 14900, // $149
    tier: "premium",
    duration: "60 days",
    features: [
      "60-day listing",
      "Top placement",
      "Homepage featured",
      "Dedicated support",
      "Social media promotion",
      "Email blast to subscribers",
    ],
  },
]
