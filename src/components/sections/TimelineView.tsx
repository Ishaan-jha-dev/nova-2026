import Link from 'next/link'
import { MapPin, Calendar, ExternalLink, Shirt } from 'lucide-react'

const timeline = [
  {
    day: 'Day 1',
    date: '15th June, 2026',
    dress: 'Business Casuals',
    color: '#E83D8A',
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
    color: '#6C3DE8',
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
    color: '#00FF88',
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
    color: '#FFB800',
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
  red:    { bg: 'rgba(220,38,38,0.15)',  text: '#F87171', border: 'rgba(220,38,38,0.3)'  },
  green:  { bg: 'rgba(0,255,136,0.1)',   text: '#00FF88', border: 'rgba(0,255,136,0.25)' },
  yellow: { bg: 'rgba(255,184,0,0.12)',  text: '#FFB800', border: 'rgba(255,184,0,0.3)'  },
}

interface TimelineViewProps {
  showRegisterButton?: boolean
}

export function TimelineView({ showRegisterButton = true }: TimelineViewProps) {
  return (
    <div className="min-h-screen py-24 px-4 relative overflow-hidden bg-nova-bg">
      {/* Ambient glowing orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[50vw] h-[50vw] bg-nova-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-1/4 w-[40vw] h-[40vw] bg-nova-accent/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
      </div>
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 entrance-1">
          <h1 className="font-display font-black text-5xl sm:text-6xl gradient-text mb-6 tracking-tight">
            Event Timeline
          </h1>
          <p className="text-nova-text-dim max-w-xl mx-auto text-lg leading-relaxed">
            Four unforgettable days — every moment mapped out.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm font-semibold tracking-wide uppercase">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nova-text">
              <MapPin size={16} className="text-nova-primary" /> IIM Bangalore
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nova-text">
              <Calendar size={16} className="text-nova-primary" /> June 15–18, 2026
            </span>
          </div>
        </div>

        {/* Days */}
        <div className="flex flex-col gap-12">
          {timeline.map((day, i) => {
            const delayClass = `entrance-${(i % 5) + 1}`
            return (
              <div key={day.day} className={`relative ${delayClass}`}>
                {/* Day header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-5 pl-2"
                  style={{ borderLeft: `3px solid ${day.color}`, paddingLeft: '1rem' }}
                >
                  <div>
                    <span
                      className="font-display font-black text-2xl sm:text-3xl tracking-tight"
                      style={{ color: day.color }}
                    >
                      {day.day}
                    </span>
                    <span className="ml-3 text-nova-text font-semibold text-lg">
                      ({day.date})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-nova-text-dim w-fit">
                    <Shirt size={12} />
                    Dress Code: {day.dress}
                  </div>
                </div>

                {/* Events table-like card */}
                <div className="nova-card overflow-hidden" style={{ borderColor: `${day.color}25` }}>
                  {/* Header row */}
                  <div className="hidden sm:grid grid-cols-[160px_1fr] gap-0 border-b text-xs font-bold uppercase tracking-widest text-nova-text-dim"
                    style={{ borderColor: `${day.color}20`, background: `${day.color}10` }}
                  >
                    <div className="px-5 py-3">Time Slot</div>
                    <div className="px-5 py-3 border-l" style={{ borderColor: `${day.color}20` }}>Event</div>
                  </div>

                  {/* Event rows */}
                  {day.events.map((ev, j) => {
                    const hl = ev.highlight ? highlightStyle[ev.highlight] : null
                    return (
                      <div
                        key={j}
                        className="flex flex-col sm:grid sm:grid-cols-[160px_1fr] gap-0 border-b last:border-b-0 transition-colors duration-200 hover:bg-white/[0.02]"
                        style={{ borderColor: `${day.color}15` }}
                      >
                        <div className="px-4 py-3 sm:px-5 sm:py-3.5 text-xs font-semibold text-nova-muted uppercase tracking-wider flex items-center sm:items-start sm:pt-4">
                          {ev.time}
                        </div>
                        <div
                          className="px-4 pb-4 sm:px-5 sm:py-3.5 sm:border-l flex flex-col justify-center sm:items-start"
                          style={{ borderColor: `${day.color}15` }}
                        >
                          {hl ? (
                            <span
                              className="inline-block w-fit px-3 py-1 sm:py-0.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold leading-relaxed"
                              style={{ background: hl.bg, color: hl.text, border: `1px solid ${hl.border}` }}
                            >
                              {ev.label}
                            </span>
                          ) : (
                            <span className="text-sm text-nova-text">{ev.label}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        {showRegisterButton && (
          <div className="mt-24 text-center entrance-5">
            <div className="nova-card p-10 border border-nova-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-nova-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-nova-text text-xl mb-8 font-medium">Ready to claim your spot in the spotlight?</p>
              <Link
                href="/register"
                className="nova-btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-white text-lg shadow-[0_0_30px_rgba(255,51,102,0.3)] hover:shadow-[0_0_50px_rgba(255,51,102,0.6)] group-hover:-translate-y-1"
              >
                Join the Revolution <ExternalLink size={20} />
              </Link>
              <p className="text-nova-muted text-sm mt-6 uppercase tracking-widest font-bold opacity-50">
                Nova Unplugged 2026 · June 15–18, IIM Bangalore
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
