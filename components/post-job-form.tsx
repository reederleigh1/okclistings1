"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRODUCTS } from "@/lib/products"
import Checkout from "@/components/checkout"
import { ArrowLeft } from "lucide-react"

function PostJobFormInner({ userId }: { userId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tierParam = searchParams.get("tier") as "basic" | "featured" | "premium" | null

  const [selectedTier, setSelectedTier] = useState<"basic" | "featured" | "premium">(tierParam || "basic")
  const [showCheckout, setShowCheckout] = useState(false)
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    description: "",
    salaryRange: "",
    contactEmail: "",
    contactPhone: "",
  })

  const selectedProduct = PRODUCTS.find((p) => p.tier === selectedTier)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowCheckout(true)
  }

  const jobDataString = JSON.stringify({ ...jobData, tier: selectedTier, userId })

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-primary">
        <nav className="border-b bg-primary backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-secondary">
              okclistings1.com
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => setShowCheckout(false)}
            className="mb-6 text-white hover:text-secondary hover:bg-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form
          </Button>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-secondary">Complete Your Payment</h1>
            <p className="text-slate-300 mb-8">
              You're posting a {selectedProduct.name} for ${selectedProduct.priceInCents / 100}
            </p>
            <Checkout productId={selectedProduct.id} jobData={jobDataString} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <nav className="border-b bg-primary backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-secondary">
            okclistings1.com
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-secondary">Post a Job</h1>
            <p className="text-lg text-slate-300">Fill out the form below to post your job listing</p>
          </div>

          <Card className="bg-slate-800 border-secondary/30">
            <CardHeader>
              <CardTitle className="text-secondary">Job Details</CardTitle>
              <CardDescription className="text-slate-300">Provide information about the position</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Web Developer"
                    required
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    required
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="Oklahoma City, OK"
                      required
                      value={jobData.location}
                      onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobType" className="text-white">
                      Job Type *
                    </Label>
                    <Select
                      required
                      value={jobData.jobType}
                      onValueChange={(value) => setJobData({ ...jobData, jobType: value })}
                    >
                      <SelectTrigger id="jobType" className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Job Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={6}
                    required
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryRange" className="text-white">
                    Salary Range (Optional)
                  </Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g. $50,000 - $70,000"
                    value={jobData.salaryRange}
                    onChange={(e) => setJobData({ ...jobData, salaryRange: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-white">
                      Contact Email *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="hiring@company.com"
                      required
                      value={jobData.contactEmail}
                      onChange={(e) => setJobData({ ...jobData, contactEmail: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-white">
                      Contact Phone (Optional)
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="(405) 555-0123"
                      value={jobData.contactPhone}
                      onChange={(e) => setJobData({ ...jobData, contactPhone: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">Select Your Plan</h3>
                  <p className="text-sm text-slate-300 mb-4">Choose the visibility level for your job</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {PRODUCTS.map((product) => (
                      <div
                        key={product.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedTier === product.tier
                            ? "border-secondary bg-secondary/10"
                            : "border-slate-600 hover:border-secondary/50 bg-slate-700"
                        }`}
                        onClick={() => setSelectedTier(product.tier)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white">{product.name}</h3>
                          <div className="text-right">
                            <div className="font-bold text-secondary">${product.priceInCents / 100}</div>
                            <div className="text-xs text-slate-400">{product.duration}</div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">{product.description}</p>
                        <ul className="space-y-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-xs flex items-center gap-1 text-slate-300">
                              <span className="text-secondary">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PostJobForm({ userId }: { userId: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <PostJobFormInner userId={userId} />
    </Suspense>
  )
}
