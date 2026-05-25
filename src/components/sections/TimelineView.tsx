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
      { time: '10AM – 1PM',   label: 'Registration',              highlight: 'red'   },
      { time: '1PM – 2PM',    label: 'Lunch',                     highlight: null    },
      { time: '2PM – 5PM',    label: 'Orientation and Inauguration', highlight: 'red' },
      { time: '4:30PM – 5PM', label: 'High Tea',                  highlight: null    },
      { time: '5PM – 7PM',    label: 'Jamming',                   highlight: 'green' },
    ],
  },
  {
    day: 'Day 2',
    date: '16th June, 2026',
    dress: 'Ethnic Day',
    events: [
      { time: '9AM – 10AM',   label: 'Breakfast',                                              highlight: null    },
      { time: '10AM – 1PM',   label: 'MUN *(For Participants)',                                 highlight: 'green' },
      { time: '10AM – 1PM',   label: 'Dance Competition *(For Participants)',                   highlight: 'green' },
      { time: '10AM – 1PM',   label: 'Engaging Activities *(For Non-Participants)',             highlight: 'green' },
      { time: '1PM – 2PM',    label: 'Lunch',                                                  highlight: null    },
      { time: '2PM – 4PM',    label: 'Speaker Sessions (Professor/Industry Experts/IIMB Alumni)', highlight: 'red' },
      { time: '4PM – 4:30PM', label: 'High Tea',                                               highlight: null    },
      { time: '4:30PM – 6PM', label: 'Case Competition 1',                                     highlight: 'yellow'},
      { time: '6PM Onwards',  label: 'Sufi Evening',                                           highlight: 'yellow'},
    ],
  },
  {
    day: 'Day 3',
    date: '17th June, 2026',
    dress: 'Business Formals',
    events: [
      { time: '9AM – 10AM',   label: 'Arrival',                                                  highlight: null    },
      { time: '10AM – 1PM',   label: 'MUN *(For Participants)',                                   highlight: 'green' },
      { time: '10AM – 1PM',   label: 'Drama Competition *(For Participants)',                     highlight: 'green' },
      { time: '10AM – 1PM',   label: 'DBE Bazaar *(Open to all)',                                highlight: 'green' },
      { time: '1PM – 2PM',    label: 'Lunch',                                                    highlight: null    },
      { time: '2PM – 5PM',    label: 'Speaker Sessions (Professor/Industry Experts/IIMB Alumni)', highlight: 'red'  },
      { time: '5PM – 7PM',    label: 'Case Competition 2 *(For Participants)',                   highlight: 'yellow'},
      { time: '5PM – 7PM',    label: 'Treasure Hunt *(For Non-Participants)',                    highlight: 'yellow'},
    ],
  },
  {
    day: 'Day 4',
    date: '18th June, 2026',
    dress: 'Business Casuals',
    events: [
      { time: '9AM – 10AM',    label: 'Arrival',                       highlight: null    },
      { time: '10AM – 2PM',    label: 'Talent Show',                   highlight: 'yellow'},
      { time: '2PM – 3PM',     label: 'Lunch',                         highlight: null    },
      { time: '3PM – 4:30PM',  label: 'Closing Ceremony / Winners Announcement', highlight: 'red' },
      { time: '4:30 – 5:30PM', label: 'High Tea',                      highlight: null    },
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
}

export function TimelineView({ showRegisterButton = true }: TimelineViewProps) {
  return (
    <PageWrapper
      title="Event"
      titleHighlight="Timeline"
      subtitle="Four unforgettable days — every moment mapped out."
      maxWidth="md"
    >
      {/* Location and Date details */}
      <div className="flex flex-wrap items-center justify-center gap-4 -mt-8 mb-12 text-xs font-bold uppercase tracking-wider relative z-10">
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

      {/* CTA */}
      {showRegisterButton && (
        <div className="mt-24 text-center">
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#E8A020]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-white text-xl mb-8 font-semibold">Ready to claim your spot in the spotlight?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-white text-lg bg-gradient-to-r from-[#E8A020] to-[#F0A500] shadow-[0_0_30px_rgba(232, 160, 32,0.3)] hover:shadow-[0_0_50px_rgba(232, 160, 32,0.6)] transition-all hover:-translate-y-1"
            >
              Join the Revolution <ExternalLink size={20} />
            </Link>
            <p className="text-white/40 text-sm mt-6 uppercase tracking-widest font-bold">
              Nova Unplugged 2026 · June 15–18, IIM Bangalore
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
