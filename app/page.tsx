import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default async function Home() {
  const supabase = await createClient()

  const { data: allJobs } = await supabase
    .from("job_postings")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  // Sort jobs by tier: premium first, then featured, then basic
  const sortedJobs = allJobs?.sort((a, b) => {
    const tierOrder = { premium: 0, featured: 1, basic: 2 }
    return tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder]
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="border-b bg-primary backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-secondary">
            okclistings1.com
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#pricing">
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Pricing
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/post-job">
                  <Button className="bg-accent hover:bg-accent/90 text-white">Post a Job</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                    Sign In
                  </Button>
                </Link>
                <Link href="/post-job">
                  <Button className="bg-accent hover:bg-accent/90 text-white">Post a Job</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-sMmQQFZ79ozrY9fZAlsxiTDY6oKuGO.mp4" type="video/mp4" />
        </video>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-secondary">
              Find Your Next Gig
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white text-pretty drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Explore exciting opportunities in OKC
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#jobs">
                <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-primary">
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/post-job">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Local. Live. Less Saturated.</h2>
            <p className="text-lg text-white text-pretty">
              Real Oklahoma City jobs from real local employers. No spam, no outdated listings—just fresh opportunities
              updated daily. We're dedicated to strengthening OKC's economy by connecting local talent with quality
              opportunities that matter.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-t-4 border-t-secondary bg-primary text-white">
              <CardHeader>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/images/desk-laptop.jpg"
                    alt="Freelancer workspace with laptop"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardTitle className="text-secondary">Freelancer/Gig/Remote/Local Job Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200">
                  Browse hundreds of freelance opportunities across design, development, marketing, and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="jobs" className="py-20 bg-gradient-to-b from-primary via-slate-900 to-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 text-secondary">Live Job Board</h2>
            <p className="text-xl text-slate-200 mb-8">Browse all active opportunities in Oklahoma City</p>
            <Link href="/jobs">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
                View All Jobs
              </Button>
            </Link>
          </div>

          <div className="text-center py-12">
            <p className="text-xl text-slate-300 mb-6">Ready to post your opportunity?</p>
            <Link href="/post-job">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-slate-100 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-700">PRICING TABLE</h2>
            <p className="text-lg text-slate-600">Choose the plan that works best for your hiring needs</p>
          </div>

          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-4 gap-0">
              {/* Left sidebar - OUR PLANS */}
              <div className="bg-slate-50 p-8 border-r border-slate-200">
                <h3 className="text-2xl font-bold text-slate-700 mb-6">OUR PLANS</h3>
                <div className="space-y-6 text-sm text-slate-600">
                  <p className="leading-relaxed">
                    Choose from three visibility tiers designed to match your hiring needs and budget.
                  </p>
                  <p className="leading-relaxed">
                    All plans include active listings on our job board with direct application links and email
                    notifications.
                  </p>
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Instant posting activation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Local OKC talent pool</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Mobile-optimized listings</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Direct applicant contact</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Plan - Green */}
              <div className="flex flex-col">
                <div className="bg-green-600 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">BASIC</h3>
                  <p className="text-sm text-green-100">
                    Perfect for small businesses and startups looking to hire locally
                  </p>
                </div>
                <div className="flex-1 p-6 bg-white">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">30-day active listing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Standard placement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Email notifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-5 w-5 text-red-500 shrink-0 mt-0.5 text-xl leading-none">×</span>
                      <span className="text-sm text-slate-400">Featured badge</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-5 w-5 text-red-500 shrink-0 mt-0.5 text-xl leading-none">×</span>
                      <span className="text-sm text-slate-400">Priority placement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-5 w-5 text-red-500 shrink-0 mt-0.5 text-xl leading-none">×</span>
                      <span className="text-sm text-slate-400">Carousel rotation</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white border-t border-slate-200">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-slate-800">$10</span>
                    <span className="text-slate-600 ml-2">/ 30 days</span>
                  </div>
                  <Link href="/post-job?tier=basic">
                    <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white">ORDER NOW</Button>
                  </Link>
                </div>
              </div>

              {/* Featured Plan - Red/Maroon */}
              <div className="flex flex-col border-2 border-red-700">
                <div className="bg-red-700 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">STANDARD</h3>
                  <p className="text-sm text-red-100">
                    Most popular choice for growing companies seeking quality candidates
                  </p>
                </div>
                <div className="flex-1 p-6 bg-white">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">30-day active listing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Featured badge highlight</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Priority email notifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Enhanced visibility</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Highlighted placement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-5 w-5 text-red-500 shrink-0 mt-0.5 text-xl leading-none">×</span>
                      <span className="text-sm text-slate-400">Carousel rotation</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white border-t border-slate-200">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-slate-800">$25</span>
                    <span className="text-slate-600 ml-2">/ 30 days</span>
                  </div>
                  <Link href="/post-job?tier=featured">
                    <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white">ORDER NOW</Button>
                  </Link>
                </div>
              </div>

              {/* Premium Plan - Blue */}
              <div className="flex flex-col">
                <div className="bg-blue-800 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">PREMIUM</h3>
                  <p className="text-sm text-blue-100">
                    Maximum exposure for urgent hiring needs and competitive positions
                  </p>
                </div>
                <div className="flex-1 p-6 bg-white">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">30-day active listing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Premium carousel rotation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Top priority placement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Featured badge highlight</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Maximum visibility</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">Instant notifications</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white border-t border-slate-200">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-slate-800">$35</span>
                    <span className="text-slate-600 ml-2">/ 30 days</span>
                  </div>
                  <Link href="/post-job?tier=premium">
                    <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white">ORDER NOW</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-secondary">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-200">
              Everything you need to know about finding and posting jobs in Oklahoma City
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  What is okclistings1.com and how does it help me find Oklahoma City jobs?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  okclistings1.com is the best job board Oklahoma City has to offer for finding local employment
                  opportunities. Our OKC job board connects job seekers with employers across all industries. Whether
                  you're looking for full-time jobs Oklahoma City, part-time jobs OKC, or OKC gig work, our platform
                  makes it easy to find jobs Oklahoma City residents are searching for. We specialize in Oklahoma City
                  careers and OKC employment opportunities that match your skills and experience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  How do I post a job listing on your OKC classifieds platform?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  To post job listing OKC on our platform, simply click the "Post a Job" button and choose from our
                  three pricing tiers. Our Oklahoma City job classifieds system makes it easy to post job ad Oklahoma
                  City employers need. You can create Oklahoma job postings for any position type, and your listing will
                  appear in our OKC employment listings immediately. We offer the most affordable way to hire in
                  Oklahoma City with transparent pricing and maximum visibility for your Oklahoma City job openings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  What types of jobs can I find on your Oklahoma City job search platform?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Our OKC job search platform features diverse opportunities including Oklahoma City freelance jobs,
                  contract work OKC, full-time positions, and part-time roles. You'll find local jobs OKC across all
                  industries from tech and healthcare to hospitality and trades. We specialize in OKC local employment
                  and make it easy to find jobs in OKC that match your career goals. Our platform is where to find jobs
                  in OKC for both traditional employment and flexible gig opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  Why should employers choose okclistings1.com for Oklahoma City hiring now?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Employers choose us because we're the most effective platform for Oklahoma City hiring now. Our OKC
                  classifieds reach thousands of local job seekers actively searching for opportunities. With three
                  visibility tiers, you can maximize your reach and find qualified candidates quickly. We're not just
                  another job board - we're a dedicated Oklahoma City job classifieds platform that understands the
                  local market and connects you with OKC talent efficiently.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  What makes your platform different from other jobs in Oklahoma City listings?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Unlike generic job boards, we focus exclusively on jobs in Oklahoma City and OKC employment
                  opportunities. Our platform combines the simplicity of traditional OKC classifieds with modern job
                  board features. We offer three distinct listing tiers to fit any budget, from basic listings to
                  premium featured positions. Our local focus means better quality matches between employers and job
                  seekers, making us the go-to destination for Oklahoma City careers and local employment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  How quickly will my job posting appear on the OKC job board?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Your Oklahoma job postings go live immediately after payment. Premium listings appear at the top of
                  our job board in a rotating carousel for maximum visibility, while featured listings get highlighted
                  placement. All listings are instantly searchable and visible to thousands of job seekers browsing
                  Oklahoma City job openings. This immediate visibility helps you start receiving applications right
                  away for your OKC employment listings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  Can I post freelance and contract positions on your platform?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  We welcome Oklahoma City freelance jobs, contract work OKC, and OKC gig work postings. Our platform is
                  perfect for both traditional employment and flexible work arrangements. Whether you need someone for a
                  one-time project or ongoing contract work, our OKC job board connects you with qualified freelancers
                  and contractors in the Oklahoma City area.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-primary border-2 border-secondary/30 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-secondary text-left">
                  How do job seekers benefit from using okclistings1.com?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Job seekers get access to the most comprehensive collection of local jobs OKC has to offer, all in one
                  place. Our platform makes your OKC job search efficient by organizing opportunities by tier and
                  category. You can quickly browse Oklahoma City employment opportunities, filter by job type, and apply
                  directly. We focus on quality local employers, so you're seeing real OKC local employment
                  opportunities from businesses in your community.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 border-t-4 border-t-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary">okclistings1.com</h3>
              <p className="text-slate-200">Connecting Oklahoma City's talent with opportunity since 2025.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
              <ul className="space-y-2 text-slate-200">
                <li>
                  <Link href="#jobs" className="hover:text-secondary transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/post-job" className="hover:text-secondary transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-secondary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-accent">Contact</h4>
              <p className="text-slate-200">
                Support: rrrdevelopment82@gmail.com
                <br />
                Attn: OKC Support
              </p>
            </div>
          </div>
          <div className="border-t border-secondary/30 mt-8 pt-8 text-center text-slate-200">
            <p>&copy; 2025 okclistings1.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
