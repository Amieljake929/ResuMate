import { useState } from 'react'
import { ChatIcon } from './icons'

const TOPICS = [
  {
    name: 'Behavioral',
    description: 'Practice concise stories about how you work.',
    questions: [
      { prompt: 'Tell me about a time you had to adapt to a sudden change.', tip: 'Explain the situation, the decision you made, and what changed because of your response.' },
      { prompt: 'Describe a challenge you faced with a teammate.', tip: 'Focus on how you listened, communicated, and reached a constructive outcome.' },
      { prompt: 'What accomplishment are you most proud of?', tip: 'Choose a specific example and make your personal contribution clear.' },
    ],
  },
  {
    name: 'Role-specific',
    description: 'Connect your skills to the work in the role.',
    questions: [
      { prompt: 'Which project best demonstrates your fit for this role?', tip: 'Pick a project with similar responsibilities and explain your process and result.' },
      { prompt: 'How do you decide what to prioritize when deadlines compete?', tip: 'Share the criteria you use, how you communicate trade-offs, and how you follow through.' },
      { prompt: 'What tools or methods do you use to produce your best work?', tip: 'Give relevant examples and explain why you chose those tools or methods.' },
    ],
  },
  {
    name: 'Common questions',
    description: 'Prepare clear answers to familiar prompts.',
    questions: [
      { prompt: 'Walk me through your background.', tip: 'Give a short, role-relevant overview: where you started, what you do now, and what you want next.' },
      { prompt: 'Why are you interested in this company?', tip: 'Mention a specific product, mission, or team focus and connect it to your own interests.' },
      { prompt: 'What questions do you have for us?', tip: 'Ask about the team’s current priorities, how success is measured, or what the next steps are.' },
    ],
  },
]

export default function InterviewPrep() {
  const [topic, setTopic] = useState(TOPICS[0])
  const [selected, setSelected] = useState(null)

  return (
    <div className="mx-auto max-w-6xl">
      <header className="rounded-3xl border border-[#e3ebf4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef4fa] text-[#0b1f3a]">
            <ChatIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#2f6fa8]">Practice studio</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">Interview preparation</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Explore common interview prompts and use the guidance to shape answers around your own experience.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Interview question topics" className="h-fit rounded-2xl border border-[#e3ebf4] bg-white p-3 shadow-sm">
          {TOPICS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setTopic(item)
                setSelected(null)
              }}
              aria-pressed={topic.name === item.name}
              className={`mb-1 w-full rounded-xl px-4 py-3 text-left transition-colors last:mb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] ${
                topic.name === item.name ? 'bg-[#eef4fa] text-[#0b1f3a]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="block text-sm font-semibold">{item.name}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span>
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#0b1f3a]">{topic.name} questions</h2>
              <p className="mt-1 text-sm text-slate-600">Select a prompt to see a practice tip.</p>
            </div>
            <span className="rounded-full bg-[#f3f6fa] px-3 py-1 text-xs font-medium text-slate-600">
              {topic.questions.length} prompts
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {topic.questions.map((question, index) => {
              const active = selected === index
              return (
                <article key={question.prompt} className="rounded-xl border border-[#e3ebf4] p-4">
                  <button
                    type="button"
                    aria-expanded={active}
                    onClick={() => setSelected(active ? null : index)}
                    className="flex w-full items-start gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef4fa] text-xs font-bold text-[#0b1f3a]">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5 text-sm font-semibold leading-relaxed text-slate-800">
                      {question.prompt}
                    </span>
                    <span aria-hidden="true" className="pt-0.5 text-lg leading-none text-slate-400">
                      {active ? '−' : '+'}
                    </span>
                  </button>
                  {active && (
                    <p className="ml-10 mt-3 border-l-2 border-[#9cc3e8] pl-3 text-sm leading-relaxed text-slate-600">
                      {question.tip}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">
            Frontend practice prompts only. There is no recording, AI feedback, or interview scoring connected.
          </p>
        </section>
      </div>
    </div>
  )
}