import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch the job posting
  const { data: job, error: jobError } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (jobError || !job) {
    redirect("/dashboard")
  }

  const handleUpdate = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect("/auth/login")
    }

    const updates = {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      job_type: formData.get("job_type") as string,
      salary_range: formData.get("salary_range") as string,
      description: formData.get("description") as string,
      contact_email: formData.get("contact_email") as string,
      contact_phone: formData.get("contact_phone") as string,
    }

    await supabase.from("job_postings").update(updates).eq("id", id).eq("user_id", user.id)

    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-slate-800 border-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Edit Job Posting</CardTitle>
              <CardDescription className="text-slate-300">Update your job listing details</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={job.title}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    defaultValue={job.company}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={job.location}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_type" className="text-white">
                      Job Type
                    </Label>
                    <Input
                      id="job_type"
                      name="job_type"
                      defaultValue={job.job_type}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary_range" className="text-white">
                    Salary Range
                  </Label>
                  <Input
                    id="salary_range"
                    name="salary_range"
                    defaultValue={job.salary_range}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Job Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={job.description}
                    required
                    rows={6}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-white">
                      Contact Email
                    </Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      defaultValue={job.contact_email}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-white">
                      Contact Phone
                    </Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      defaultValue={job.contact_phone || ""}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary">
                    Save Changes
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
