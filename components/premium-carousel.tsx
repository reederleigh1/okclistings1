"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Crown, ChevronLeft, ChevronRight } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  description: string
  salary_range: string | null
  contact_email: string | null
  contact_phone: string | null
  tier: string
}

export function PremiumCarousel({ jobs }: { jobs: Job[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || jobs.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jobs.length)
    }, 7000) // Updated from 5 seconds to 7 seconds

    return () => clearInterval(interval)
  }, [isPaused, jobs.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length)
  }

  if (jobs.length === 0) return null

  const getVisibleJobs = () => {
    if (jobs.length === 1) return [{ job: jobs[0], index: 0 }]
    if (jobs.length === 2)
      return [
        { job: jobs[currentIndex], index: currentIndex },
        { job: jobs[(currentIndex + 1) % jobs.length], index: (currentIndex + 1) % jobs.length },
      ]

    // Show 3 cards: previous (peek), current (main), next (peek)
    const prevIndex = (currentIndex - 1 + jobs.length) % jobs.length
    const nextIndex = (currentIndex + 1) % jobs.length

    return [
      { job: jobs[prevIndex], index: prevIndex, position: "prev" },
      { job: jobs[currentIndex], index: currentIndex, position: "current" },
      { job: jobs[nextIndex], index: nextIndex, position: "next" },
    ]
  }

  const visibleJobs = getVisibleJobs()

  return (
    <div
      className="relative overflow-hidden px-4 md:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {visibleJobs.map(({ job, index, position }) => {
          const isCurrent = position === "current" || jobs.length <= 2
          const isPeek = position === "prev" || position === "next"

          return (
            <div
              key={index}
              className={`transition-all duration-500 ${
                isCurrent
                  ? "w-full md:w-[600px] scale-100 opacity-100 z-10"
                  : "hidden md:block md:w-[400px] scale-90 opacity-60 z-0"
              }`}
            >
              <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 shadow-2xl border-4 border-dashed border-white/40">
                {/* Number badge */}
                <div className="absolute top-6 left-6 bg-white/90 text-accent rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Premium badge */}
                <div className="absolute top-6 right-6">
                  <Badge className="bg-white text-accent border-2 border-white text-base px-4 py-2">
                    <Crown className="h-4 w-4 mr-2" />
                    PREMIUM
                  </Badge>
                </div>

                {/* Content */}
                <div className="mt-20 space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">{job.title}</h3>
                  <p className="text-xl font-semibold text-white/90">{job.company}</p>
                  <p className="text-white/80 text-base leading-relaxed line-clamp-3">{job.description}</p>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm font-medium">{job.location}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-white">
                        <DollarSign className="h-5 w-5" />
                        <span className="text-sm font-medium">{job.salary_range}</span>
                      </div>
                    )}
                  </div>

                  {isCurrent && (
                    <div className="pt-4">
                      <Button className="w-full bg-white hover:bg-white/90 text-accent text-lg py-6 font-bold shadow-lg rounded-xl">
                        Apply Now →
                      </Button>
                    </div>
                  )}
                </div>

                {/* Arrow decoration */}
                <div className="absolute bottom-6 right-6 text-white/40">
                  <ChevronRight className="h-8 w-8" strokeWidth={3} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls */}
      {jobs.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-accent rounded-full p-4 shadow-xl transition-all hover:scale-110 z-20"
            aria-label="Previous job"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-accent rounded-full p-4 shadow-xl transition-all hover:scale-110 z-20"
            aria-label="Next job"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {jobs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-accent w-12" : "bg-slate-400 hover:bg-slate-300 w-3"
                }`}
                aria-label={`Go to job ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
