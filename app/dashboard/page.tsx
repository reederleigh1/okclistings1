import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's job postings
  const { data: jobPostings } = await supabase
    .from("job_postings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  const activeJobs = jobPostings?.filter((job) => new Date(job.expires_at) > new Date()) || []
  const expiredJobs = jobPostings?.filter((job) => new Date(job.expires_at) <= new Date()) || []

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="border-b bg-primary backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-secondary">
            okclistings1.com
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs">
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Browse Jobs
              </Button>
            </Link>
            <Link href="/post-job">
              <Button className="bg-accent hover:bg-accent/90 text-white">Post a Job</Button>
            </Link>
            <form action={handleSignOut}>
              <Button variant="ghost" className="text-white hover:text-secondary hover:bg-primary/80">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Account Info */}
          <Card className="mb-8 bg-slate-800 border-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Account Information</CardTitle>
              <CardDescription className="text-slate-300">Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-white">
                <p>
                  <span className="font-semibold text-secondary">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold text-secondary">Member Since:</span>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold text-secondary">Total Posts:</span> {jobPostings?.length || 0}
                </p>
                <p>
                  <span className="font-semibold text-secondary">Active Posts:</span> {activeJobs.length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Job Postings */}
          <Card className="mb-8 bg-slate-800 border-secondary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-secondary">Active Job Postings</CardTitle>
                  <CardDescription className="text-slate-300">Your currently active job listings</CardDescription>
                </div>
                <Link href="/post-job">
                  <Button className="bg-accent hover:bg-accent/90 text-white">Post New Job</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-300 mb-4">You don't have any active job postings yet.</p>
                  <Link href="/post-job">
                    <Button className="bg-secondary hover:bg-secondary/90 text-primary">Post Your First Job</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <Card key={job.id} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl text-white">{job.title}</CardTitle>
                              <Badge
                                className={
                                  job.tier === "premium"
                                    ? "bg-accent text-white"
                                    : job.tier === "featured"
                                      ? "bg-secondary text-primary"
                                      : "bg-slate-600 text-white"
                                }
                              >
                                {job.tier.toUpperCase()}
                              </Badge>
                            </div>
                            <CardDescription className="text-slate-300">
                              {job.company} • {job.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p>
                            <span className="font-semibold text-white">Job Type:</span> {job.job_type}
                          </p>
                          <p>
                            <span className="font-semibold text-white">Salary:</span> {job.salary_range}
                          </p>
                          <p>
                            <span className="font-semibold text-white">Posted:</span>{" "}
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-semibold text-white">Expires:</span>{" "}
                            {new Date(job.expires_at).toLocaleDateString()}
                          </p>
                          <p className="pt-2">
                            <span className="font-semibold text-white">Description:</span>
                          </p>
                          <p className="text-slate-300">{job.description}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Link href={`/dashboard/edit/${job.id}`}>
                            <Button
                              variant="outline"
                              className="border-secondary text-secondary hover:bg-secondary hover:text-primary bg-transparent"
                            >
                              Edit
                            </Button>
                          </Link>
                          <form
                            action={async () => {
                              "use server"
                              const supabase = await createClient()
                              await supabase.from("job_postings").delete().eq("id", job.id)
                              redirect("/dashboard")
                            }}
                          >
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                            >
                              Delete
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expired Job Postings */}
          {expiredJobs.length > 0 && (
            <Card className="bg-slate-800 border-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Expired Job Postings</CardTitle>
                <CardDescription className="text-slate-300">Your past job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiredJobs.map((job) => (
                    <Card key={job.id} className="bg-slate-700/50 border-slate-600 opacity-60">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl text-white">{job.title}</CardTitle>
                              <Badge className="bg-slate-600 text-white">EXPIRED</Badge>
                            </div>
                            <CardDescription className="text-slate-300">
                              {job.company} • {job.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p>
                            <span className="font-semibold text-white">Expired:</span>{" "}
                            {new Date(job.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
