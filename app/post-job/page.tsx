import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PostJobForm from "@/components/post-job-form"

export default async function PostJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login?redirect=/post-job")
  }

  return <PostJobForm userId={user.id} />
}
