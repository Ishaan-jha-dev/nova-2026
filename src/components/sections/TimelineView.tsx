import Link from 'next/link'
import { MapPin, Calendar, ExternalLink, Shirt } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { PinnedCard } from '@/components/ui/PinnedCard'

const timeline = [
  {
    day: 'Day 1',
    date: '15th June, 2026',
    dress: 'Business Casuals',
    events: [
      { time: '9AM – 12PM',   label: 'Registration', highlight: null },
      { time: '12PM – 1PM',   label: 'Briefing on Nova Unplugged \'26', highlight: null },
      { time: '1PM – 2PM',    label: 'Lunch', highlight: null },
      { time: '2PM – 2:30PM', label: 'Inauguration Ceremony', highlight: 'red' },
      { time: '2:30PM – 3PM', label: 'Address by Dignitaries', highlight: 'red' },
      { time: '3PM – 4PM',    label: 'Faculty Session', highlight: 'red' },
      { time: '4PM – 5PM',    label: 'PGP Networking Session / Open Interaction', highlight: null },
      { time: '5PM – 5:30PM', label: 'High Tea & Networking', highlight: null },
      { time: '5:30PM – 7PM', label: 'Jamming Session', highlight: 'yellow' },
    ],
  },
  {
    day: 'Day 2',
    date: '16th June, 2026',
    dress: 'Business Casuals',
    events: [
      { time: '9AM – 10AM',    label: 'Entry, Announcements & Competition Briefing', highlight: null },
      { time: '10AM – 11AM',   label: 'Philosophy Talk Show by Naga (NSRCEL)', highlight: 'red' },
      { time: '10AM – 1PM',    label: 'MUN - Part 1 & Dance Competition', highlight: 'green' },
      { time: '11AM – 12PM',   label: 'Panel Discussion: Breaking into Consulting', highlight: 'red' },
      { time: '12PM – 1PM',    label: 'Faculty Session', highlight: 'red' },
      { time: '1PM – 2PM',     label: 'Lunch', highlight: null },
      { time: '2PM – 3PM',     label: 'DBE Spotlight (TED-style Talks)', highlight: 'red' },
      { time: '2PM – 4PM',     label: 'Case Competition Round 1 & Treasure Hunt', highlight: 'green' },
      { time: '3PM – 4PM',     label: 'Speaker Sessions (Prof. Sabarinath & Personal Branding)', highlight: 'red' },
      { time: '4PM – 4:30PM',  label: 'Open Interaction / Buffer', highlight: null },
      { time: '4:30PM – 5PM',  label: 'High Tea & Networking', highlight: null },
      { time: '5PM – 6:30PM',  label: 'Mr. and Miss Nova - Round 2 & Treasure Hunt', highlight: 'green' },
      { time: '5PM – 6:30PM',  label: 'Informal Networking & Photo Comp Submission', highlight: null },
      { time: '6:30PM – 7PM',  label: 'Closing Announcements / Wrap-Up', highlight: null },
    ],
  },
  {
    day: 'Day 3',
    date: '17th June, 2026',
    dress: 'Theme-Based Personas / DJ Night',
    events: [
      { time: '9AM – 10AM',    label: 'Entry, Announcements & Competition Briefing', highlight: null },
      { time: '10AM – 11AM',   label: 'Panel Discussion with Political Figure', highlight: 'red' },
      { time: '10AM – 11AM',   label: 'Quiz Prelims', highlight: 'green' },
      { time: '10AM – 1PM',    label: 'Drama Competition', highlight: 'green' },
      { time: '11AM – 12PM',   label: 'Academic Session: Prof. Suresh', highlight: 'red' },
      { time: '11AM – 1PM',    label: 'LP and Academic Cell Session / Quiz', highlight: 'green' },
      { time: '12PM – 1PM',    label: 'Professor Session 2', highlight: 'red' },
      { time: '1PM – 2PM',     label: 'Lunch', highlight: null },
      { time: '2PM – 3:30PM',  label: 'Startup Founders Session', highlight: 'red' },
      { time: '2PM – 4:30PM',  label: 'Startup Challenge Competition & MUN - Part 2', highlight: 'green' },
      { time: '3:30PM – 4:30PM', label: 'Open Interaction / Wrap-Up', highlight: null },
      { time: '4:30PM – 5PM',  label: 'High Tea & Networking', highlight: null },
      { time: '5PM – 7PM',     label: 'DJ Night', highlight: 'yellow' },
    ],
  },
  {
    day: 'Day 4',
    date: '18th June, 2026',
    dress: 'Ethnic Wear',
    events: [
      { time: '9AM – 10AM',    label: 'Entry, Announcements & Competition Briefing', highlight: null },
      { time: '10AM – 12:30PM',label: 'Talent Show, Pitch Competition & Case Comp (Finals)', highlight: 'yellow' },
      { time: '12:30PM – 1PM', label: 'Quiz Finals Evaluation', highlight: 'yellow' },
      { time: '1PM – 2PM',     label: 'Lunch', highlight: null },
      { time: '2PM – 3PM',     label: 'Mr. and Miss Nova - Round 3 & Cultural Event', highlight: 'yellow' },
      { time: '3PM – 5PM',     label: 'Prize Distribution & Closing Ceremony', highlight: 'red' },
      { time: '5PM – 5:30PM',  label: 'Fest Wrap-Up Video / Aftermovie and Final Closure', highlight: null },
      { time: '5:30PM – 6PM',  label: 'High Tea & Networking', highlight: null },
    ],
  },
]

const highlightStyle: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: '#FEE2E2',  text: '#DC2626', border: '#FCA5A5'  },
  green:  { bg: '#D1FAE5',  text: '#059669', border: '#A7F3D0'  },
  yellow: { bg: '#FEF3C7',  text: '#D97706', border: '#FDE68A'  },
}

const pinColors: ('pink' | 'orange' | 'blue' | 'purple')[] = ['pink', 'purple', 'blue', 'orange']

interface TimelineViewProps {
  showRegisterButton?: boolean
  noWrapper?: boolean
}

export function TimelineView({ showRegisterButton = true, noWrapper = false }: TimelineViewProps) {
  const content = (
    <>
      {/* Location and Date details */}
      <div className={`flex flex-wrap items-center justify-center gap-4 ${noWrapper ? 'mb-12' : '-mt-8 mb-12'} text-xs font-bold uppercase tracking-wider relative z-10`}>
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white">
          <MapPin size={14} className="text-[#E8A020]" /> IIM Bangalore
        </span>
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white">
          <Calendar size={14} className="text-[#F0A500]" /> June 15–18, 2026
        </span>
      </div>

      {/* Days */}
      <div className="flex flex-col gap-12">
        {timeline.map((day, i) => {
          const pinColor = pinColors[i % 4]

          return (
            <div key={day.day} className="w-full relative">
              <PinnedCard
                pinColor={pinColor}
                title={day.day}
                subtitle={day.date}
              >
                {/* Dress Code Badge */}
                <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white/80 w-fit mx-auto mb-6">
                  <Shirt size={12} className="text-white/60" />
                  Dress Code: {day.dress}
                </div>

                {/* Events list inside PinnedCard */}
                <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-[160px_1fr] gap-0 border-b border-white/10 bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <div className="px-5 py-3.5">Time Slot</div>
                    <div className="px-5 py-3.5 border-l border-white/10">Event</div>
                  </div>

                  {/* Rows */}
                  {day.events.map((ev, j) => {
                    const hl = ev.highlight ? highlightStyle[ev.highlight] : null
                    return (
                      <div
                        key={j}
                        className="flex flex-col sm:grid sm:grid-cols-[160px_1fr] gap-0 border-b last:border-b-0 border-white/10 transition-colors duration-200 hover:bg-white/10"
                      >
                        {/* Time slot column */}
                        <div className="px-4 py-3 sm:px-5 sm:py-4 text-xs font-bold text-white/60 uppercase tracking-wider flex items-center sm:items-start">
                          {ev.time}
                        </div>
                        {/* Event label column */}
                        <div className="px-4 pb-4 sm:px-5 sm:py-4 sm:border-l border-white/10 flex flex-col justify-center sm:items-start">
                          {hl ? (
                            <span
                              className="inline-block w-fit px-3 py-1 rounded-xl text-xs font-bold leading-relaxed border shadow-sm"
                              style={{ background: hl.bg, color: hl.text, borderColor: hl.border }}
                            >
                              {ev.label}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-white/90 leading-relaxed">
                              {ev.label}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </PinnedCard>
            </div>
          )
        })}
      </div>

      {showRegisterButton && (
        <div className="mt-24 text-center">
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#E8A020]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative z-10">
              <p className="text-white text-xl mb-8 font-semibold">Ready to claim your spot in the spotlight?</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-white text-base sm:text-lg bg-gradient-to-r from-[#E8A020] to-[#F0A500] shadow-[0_0_30px_rgba(232, 160, 32,0.3)] hover:shadow-[0_0_50px_rgba(232, 160, 32,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto relative z-20"
              >
                <span>Join the Revolution</span> <ExternalLink size={20} className="shrink-0" />
              </Link>
              <p className="text-white/40 text-sm mt-6 uppercase tracking-widest font-bold">
                Nova Unplugged 2026 · June 15–18, IIM Bangalore
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )

  if (noWrapper) {
    return <div className="w-full max-w-4xl mx-auto">{content}</div>
  }

  return (
    <PageWrapper
      title="Event"
      titleHighlight="Timeline"
      subtitle="Four unforgettable days — every moment mapped out."
      maxWidth="md"
    >
      {content}
    </PageWrapper>
  )
}
