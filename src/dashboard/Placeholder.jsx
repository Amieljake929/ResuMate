import { FolderIcon } from './icons'

export default function Placeholder({ title, description = 'This section is coming soon.' }) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a]">{title}</h1>
      <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-[#c9d8e8] bg-white px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-xl border border-[#e3ebf4] bg-[#f6faff]">
          <FolderIcon className="h-7 w-7 text-black" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Nothing here yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">{description}</p>
      </div>
    </div>
  )
}