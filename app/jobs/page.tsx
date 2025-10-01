import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Crown, Star } from "lucide-react"
import Link from "next/link"
import { PremiumCarousel } from "@/components/premium-carousel"

export default async function JobsPage() {
  const supabase = await createClient()

  const { data: allJobs } = await supabase
    .from("job_postings")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  // Separate jobs by tier
  const premiumJobs = allJobs?.filter((job) => job.tier === "premium") || []
  const featuredJobs = allJobs?.filter((job) => job.tier === "featured") || []
  const basicJobs = allJobs?.filter((job) => job.tier === "basic") || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-slate-900 to-primary">
      {/* Navigation */}
      <nav className="border-b bg-primary backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-secondary hover:text-secondary/80 transition-colors">
            okclistings1.com
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#pricing">
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Pricing
              </Button>
            </Link>
            <Link href="/post-job">
              <Button className="bg-accent hover:bg-accent/90 text-white">Post a Job</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-secondary">Live Job Board</h1>
          <p className="text-xl text-slate-200 mb-8">{allJobs?.length || 0} active opportunities in Oklahoma City</p>
          <Link href="/post-job">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              Post Your Job
            </Button>
          </Link>
        </div>

        {/* Premium Carousel Section */}
        {premiumJobs.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Crown className="h-8 w-8 text-accent" />
              <h2 className="text-4xl font-bold text-accent">Premium Opportunities</h2>
              <Crown className="h-8 w-8 text-accent" />
            </div>
            <PremiumCarousel jobs={premiumJobs} />
          </div>
        )}

        {featuredJobs.length > 0 && (
          <div className="mb-16">
            <div className="bg-white border-8 border-black p-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Star className="h-6 w-6 text-black" fill="black" />
                <h2 className="text-3xl font-bold text-black uppercase tracking-wider font-serif">
                  Featured Classifieds
                </h2>
                <Star className="h-6 w-6 text-black" fill="black" />
              </div>
            </div>
            <div className="bg-white p-6 shadow-2xl border-8 border-black">
              <div className="grid md:grid-cols-2 gap-4">
                {featuredJobs.map((job, index) => (
                  <div key={job.id} className="border-4 border-black p-3 bg-white">
                    <div className="border-b-2 border-black pb-2 mb-2">
                      <h3 className="font-bold text-base text-black uppercase font-serif leading-tight">{job.title}</h3>
                    </div>
                    <p className="text-sm font-bold text-black mb-1">{job.company}</p>
                    <p className="text-xs text-black leading-snug mb-2">{job.description}</p>
                    <div className="text-xs text-black space-y-0.5 border-t border-black pt-2">
                      <p>
                        <span className="font-bold">Location:</span> {job.location}
                      </p>
                      <p>
                        <span className="font-bold">Type:</span> {job.job_type}
                      </p>
                      {job.salary_range && (
                        <p>
                          <span className="font-bold">Salary:</span> {job.salary_range}
                        </p>
                      )}
                      {job.contact_email && (
                        <p className="break-all">
                          <span className="font-bold">Email:</span> {job.contact_email}
                        </p>
                      )}
                      {job.contact_phone && (
                        <p>
                          <span className="font-bold">Phone:</span> {job.contact_phone}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center gap-1 mt-2 pt-2 border-t border-black">
                      <Star className="h-3 w-3" fill="black" />
                      <Star className="h-3 w-3" fill="black" />
                      <Star className="h-3 w-3" fill="black" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {basicJobs.length > 0 && (
          <div>
            <div className="bg-white border-t-8 border-b-8 border-black p-3 mb-0">
              <h2 className="text-4xl font-bold text-black uppercase tracking-widest text-center font-serif">
                CLASSIFIEDS
              </h2>
            </div>
            <div className="bg-white p-6 shadow-2xl border-8 border-t-0 border-black">
              <div className="columns-1 md:columns-3 lg:columns-4 gap-4 text-xs leading-tight">
                {basicJobs.map((job, index) => (
                  <div key={job.id} className="break-inside-avoid mb-3 pb-3 border-b border-black">
                    <h3 className="font-bold text-black uppercase mb-0.5 text-sm">{job.title}</h3>
                    <p className="font-semibold text-black mb-0.5">{job.company}</p>
                    <p className="text-black leading-snug mb-1">{job.description}</p>
                    <p className="text-black">
                      <span className="font-bold">Loc:</span> {job.location}
                    </p>
                    <p className="text-black">
                      <span className="font-bold">Type:</span> {job.job_type}
                    </p>
                    {job.salary_range && (
                      <p className="text-black">
                        <span className="font-bold">Pay:</span> {job.salary_range}
                      </p>
                    )}
                    {job.contact_email && (
                      <p className="text-black break-all">
                        <span className="font-bold">Contact:</span> {job.contact_email}
                      </p>
                    )}
                    {job.contact_phone && (
                      <p className="text-black">
                        <span className="font-bold">Ph:</span> {job.contact_phone}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!allJobs ||
          (allJobs.length === 0 && (
            <div className="text-center py-20 bg-white border-8 border-black p-12">
              <h3 className="text-2xl font-bold text-black mb-2 uppercase font-serif">No Listings Available</h3>
              <p className="text-black mb-6">Be the first to post a classified ad!</p>
              <Link href="/post-job">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Post a Job
                </Button>
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}
