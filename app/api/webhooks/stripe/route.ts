import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    try {
      // Extract job data from session metadata
      const jobDataString = session.metadata?.jobData
      if (!jobDataString) {
        console.error("No job data in session metadata")
        return NextResponse.json({ error: "No job data" }, { status: 400 })
      }

      const jobData = JSON.parse(jobDataString)
      const tier = session.metadata?.tier || "basic"

      // Calculate expiration date based on tier
      const expiresAt = new Date()
      if (tier === "premium") {
        expiresAt.setDate(expiresAt.getDate() + 60) // 60 days
      } else if (tier === "featured") {
        expiresAt.setDate(expiresAt.getDate() + 45) // 45 days
      } else {
        expiresAt.setDate(expiresAt.getDate() + 30) // 30 days
      }

      // Insert job posting into database with user_id
      const { data, error } = await supabaseAdmin.from("job_postings").insert({
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        job_type: jobData.jobType,
        description: jobData.description,
        salary_range: jobData.salaryRange || null,
        contact_email: jobData.contactEmail,
        contact_phone: jobData.contactPhone || null,
        tier: tier,
        expires_at: expiresAt.toISOString(),
        user_id: jobData.userId, // Link to user
      })

      if (error) {
        console.error("Error creating job posting:", error)
        return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 })
      }

      console.log("Job posting created successfully:", data)
    } catch (err) {
      console.error("Error processing webhook:", err)
      return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
