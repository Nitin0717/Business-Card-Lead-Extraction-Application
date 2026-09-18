'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  FileImage,
  FileSpreadsheet,
  Inbox,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'

type Lead = {
  id: number
  firstName: string
  lastName: string
  title: string
  company: string
  location: string
  phone: string
  email: string
  confidence: number
  source: string
}

const sampleLeads: Lead[] = [
  { id: 1, firstName: 'Sarah', lastName: 'Chen', title: 'VP of Marketing', company: 'Northstar Labs', location: 'San Francisco, CA', phone: '+1 (415) 555-0138', email: 'sarah.chen@northstarlabs.com', confidence: 98, source: 'sarah-chen.jpg' },
  { id: 2, firstName: 'Marcus', lastName: 'Thompson', title: 'Co-founder & CEO', company: 'Lumen Studio', location: 'Austin, TX', phone: '+1 (512) 555-0184', email: 'marcus@lumenstudio.co', confidence: 96, source: 'marcus-thompson.png' },
  { id: 3, firstName: 'Priya', lastName: 'Nair', title: 'Head of Partnerships', company: 'Vercel Systems', location: 'New York, NY', phone: '+1 (212) 555-0196', email: 'priya.nair@vercelsystems.com', confidence: 94, source: 'priya-nair.jpg' },
  { id: 4, firstName: 'Daniel', lastName: 'Okafor', title: 'Product Director', company: 'Arc & Field', location: 'Chicago, IL', phone: '+1 (773) 555-0142', email: 'daniel@arcandfield.com', confidence: 91, source: 'daniel-okafor.jpg' },
  { id: 5, firstName: 'Elena', lastName: 'Rossi', title: 'Principal Consultant', company: 'Rossi Advisory', location: 'London, UK', phone: '+44 20 7946 0821', email: 'elena@rossiadvisory.co.uk', confidence: 89, source: 'elena-rossi.png' },
]

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [leads, setLeads] = useState<Lead[]>(sampleLeads)
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(100)
  const [query, setQuery] = useState('')
  const [dragging, setDragging] = useState(false)

  const addFiles = (incoming: FileList | File[]) => {
    const images = Array.from(incoming).filter((file) => file.type.startsWith('image/'))
    if (!images.length) return
    setFiles((current) => [...current, ...images])
    setIsProcessing(true)
    setProgress(12)
    let value = 12
    const timer = window.setInterval(() => {
      value += 22
      setProgress(Math.min(value, 100))
      if (value >= 100) {
        window.clearInterval(timer)
        setIsProcessing(false)
        setLeads((current) => current.length ? current : sampleLeads)
      }
    }, 260)
  }

  const exportLeads = () => {
    const rows = leads.map(({ firstName, lastName, title, company, location, phone, email }) => ({
      'First Name': firstName, 'Last Name': lastName, 'Position / Job Title': title,
      Company: company, Location: location, 'Phone Number': phone, 'Email Address': email,
    }))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Leads')
    XLSX.writeFile(workbook, 'leadforge-business-card-leads.xlsx')
  }

  const filteredLeads = leads.filter((lead) => `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#172238]">
      <header className="border-b border-[#e4e9f0] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-[11px] bg-[#173b70] text-white shadow-sm"><Sparkles className="size-[18px]" /></div>
            <span className="text-[19px] font-bold tracking-[-0.03em]">Leadforge</span>
            <span className="hidden rounded-full bg-[#e9f7f5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#168b82] sm:inline-flex">VLM workspace</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#627188]"><ShieldCheck className="size-4 text-[#168b82]" /><span className="hidden sm:inline">Private workspace</span><button className="rounded-lg p-2 hover:bg-slate-50" aria-label="More options"><MoreHorizontal className="size-5" /></button></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#168b82]"><span className="size-2 rounded-full bg-[#1db5a5]" /> EXTRACTION CONSOLE</div><h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#14243d] sm:text-[40px]">Turn cards into <span className="text-[#168b82]">connections.</span></h1><p className="mt-2 max-w-xl text-[15px] leading-6 text-[#718096]">Upload a batch of business cards and let Qwen Vision turn them into clean, actionable leads.</p></div>
          <button onClick={exportLeads} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173b70] px-5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,59,112,0.18)] transition hover:bg-[#102d57]"><ArrowDownToLine className="size-4" /> Export Excel <ArrowRight className="size-4 opacity-60" /></button>
        </div>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_10px_rgba(27,48,79,0.03)] sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-base font-bold text-[#1c2b42]">Upload business cards</h2><p className="mt-1 text-xs text-[#8491a4]">JPG, PNG or WEBP · up to 20 MB each</p></div><span className="rounded-full bg-[#f0f7ff] px-3 py-1 text-xs font-bold text-[#3469a7]">{files.length || 12} cards ready</span></div>
            <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files) }} className={`group flex min-h-[178px] w-full flex-col items-center justify-center rounded-xl border border-dashed transition ${dragging ? 'border-[#168b82] bg-[#effbf9]' : 'border-[#c9d5e4] bg-[#fbfcfe] hover:border-[#168b82] hover:bg-[#f7fcfb]'}`}><input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => event.target.files && addFiles(event.target.files)} /><span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#eaf7f5] text-[#168b82] transition group-hover:scale-105"><UploadCloud className="size-6" /></span><span className="text-sm font-semibold text-[#34445b]">Drop your cards here, or <span className="text-[#168b82]">browse files</span></span><span className="mt-1.5 text-xs text-[#97a3b3]">Multiple files supported</span></button>
            {files.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{files.map((file, index) => <span key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg bg-[#f3f6fa] px-3 py-2 text-xs text-[#506078]"><FileImage className="size-3.5 text-[#168b82]" />{file.name}<button onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${file.name}`}><X className="size-3.5" /></button></span>)}</div>}
            {isProcessing && <div className="mt-5 rounded-xl border border-[#cbeae6] bg-[#f2fbfa] p-4"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#237c76]"><span className="flex items-center gap-2"><Sparkles className="size-3.5" /> Qwen VLM is extracting fields</span><span>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#d9eeeb]"><div className="h-full rounded-full bg-[#168b82] transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>}
          </div>

          <aside className="rounded-2xl bg-[#173b70] p-6 text-white shadow-[0_10px_28px_rgba(23,59,112,0.15)]"><div className="mb-10 flex items-center justify-between"><span className="rounded-lg bg-white/10 p-2"><FileSpreadsheet className="size-5 text-[#7fe0d5]" /></span><span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8caed6]">Batch summary</span></div><p className="text-sm text-[#abc0dc]">Leads extracted</p><p className="mt-1 text-5xl font-bold tracking-[-0.06em]">{leads.length}</p><div className="my-6 h-px bg-white/10" /><div className="space-y-4 text-sm"><div className="flex items-center justify-between"><span className="text-[#abc0dc]">Avg. confidence</span><span className="font-semibold text-[#d8fffa]">93.6%</span></div><div className="flex items-center justify-between"><span className="text-[#abc0dc]">Processing time</span><span className="font-semibold text-[#d8fffa]">1.8s / card</span></div><div className="flex items-center justify-between"><span className="text-[#abc0dc]">Model</span><span className="font-semibold text-[#d8fffa]">Qwen2.5-VL 7B</span></div></div><div className="mt-10 flex items-center gap-2 text-xs text-[#8caed6]"><Check className="size-3.5 text-[#7fe0d5]" /> All fields validated</div></aside>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_2px_10px_rgba(27,48,79,0.03)]"><div className="flex flex-col gap-4 border-b border-[#edf0f4] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-base font-bold text-[#1c2b42]">Extracted leads <span className="ml-1 text-[#9aa7b7]">({leads.length})</span></h2><p className="mt-1 text-xs text-[#8491a4]">Review the fields before exporting your lead list.</p></div><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9aa7b7]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads..." className="h-10 w-full rounded-lg border border-[#dce4ed] bg-[#fbfcfe] pl-9 pr-3 text-sm outline-none transition placeholder:text-[#a7b1be] focus:border-[#168b82] sm:w-56" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead><tr className="border-b border-[#edf0f4] text-[10px] font-bold uppercase tracking-[0.1em] text-[#99a5b4]"><th className="px-6 py-3.5">Name</th><th className="px-4 py-3.5">Position</th><th className="px-4 py-3.5">Company</th><th className="px-4 py-3.5">Location</th><th className="px-4 py-3.5">Contact</th><th className="px-4 py-3.5">Confidence</th><th className="px-4 py-3.5">Source</th></tr></thead><tbody>{filteredLeads.map((lead) => <tr key={lead.id} className="border-b border-[#f0f2f5] last:border-0 hover:bg-[#fbfcfe]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#eaf2fb] text-xs font-bold text-[#32679f]">{lead.firstName[0]}{lead.lastName[0]}</div><div><p className="text-sm font-semibold text-[#27374f]">{lead.firstName} {lead.lastName}</p><p className="mt-0.5 text-[11px] text-[#98a4b3]">Lead #{String(lead.id).padStart(3, '0')}</p></div></div></td><td className="px-4 py-4 text-sm text-[#506078]">{lead.title}</td><td className="px-4 py-4 text-sm font-medium text-[#354860]">{lead.company}</td><td className="px-4 py-4 text-sm text-[#647389]">{lead.location}</td><td className="px-4 py-4"><p className="text-xs font-medium text-[#3f526d]">{lead.email}</p><p className="mt-1 text-[11px] text-[#98a4b3]">{lead.phone}</p></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${lead.confidence >= 95 ? 'bg-[#e8f8f1] text-[#21835d]' : 'bg-[#fff7e4] text-[#ab7316]'}`}>{lead.confidence}%</span></td><td className="px-4 py-4"><span className="flex items-center gap-1.5 text-xs text-[#8491a4]"><FileImage className="size-3.5" />{lead.source}</span></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-[#edf0f4] px-6 py-4"><span className="text-xs text-[#8491a4]">Showing {filteredLeads.length} of {leads.length} leads</span><button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-bold text-[#168b82] hover:text-[#126e68]"><Plus className="size-3.5" /> Add more cards</button></div></section>
        <footer className="mt-8 flex flex-col gap-3 border-t border-[#e3e8ef] pt-5 text-xs text-[#94a0ae] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><Clock3 className="size-3.5" /> Last batch processed just now</span><span>Powered by Qwen Vision-Language Model <span className="mx-1">·</span> <button className="underline underline-offset-2">View architecture</button></span></footer>
      </div>
    </main>
  )
}
