'use client'

import { ChevronDown, FileAudio, Loader2, Mic, MicOff, Sparkles, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useSpeechDictation } from '@/hooks/use-speech-dictation'
import { SAMPLE_CALLS } from '@/lib/samples'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (value: string) => void
  onAnalyze: () => void
  loading: boolean
}

export function TranscriptInput({ value, onChange, onAnalyze, loading }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const valueRef = useRef(value)
  valueRef.current = value

  const dictation = useSpeechDictation(
    (text) => {
      const current = valueRef.current
      onChange(current ? `${current.trimEnd()}\n${text}` : text)
    },
    (message) => toast.error(message),
  )

  const loadSample = (id: string) => {
    const sample = SAMPLE_CALLS.find((s) => s.id === id)
    if (!sample) return
    onChange(sample.transcript)
    toast.info(`Loaded sample: ${sample.label}`)
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setAudioFile(file.name)
    toast.info('Audio received', {
      description: 'Speech-to-text integration ready — connect a transcription provider to auto-fill the transcript.',
    })
  }

  const toggleMic = () => {
    if (dictation.listening) {
      dictation.stop()
      toast('Dictation stopped')
    } else {
      dictation.start()
      toast.info('Listening… speak to dictate the call')
    }
  }

  const canAnalyze = value.trim().length >= 20 && !loading
  const lineCount = value ? value.split('\n').filter(Boolean).length : 0

  return (
    <section
      aria-labelledby="transcript-heading"
      className="flex flex-col rounded-2xl border bg-card shadow-sm print:hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
        <div>
          <h2 id="transcript-heading" className="text-sm font-semibold">
            Call transcript
          </h2>
          <p className="text-xs text-muted-foreground">Format: &ldquo;Agent: …&rdquo; / &ldquo;Caller: …&rdquo;</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            Load sample
            <ChevronDown className="size-3.5" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sample calls (synthetic)</DropdownMenuLabel>
              {SAMPLE_CALLS.map((s) => (
                <DropdownMenuItem key={s.id} onClick={() => loadSample(s.id)} className="flex-col items-start gap-0.5 py-2">
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative p-5 pb-3">
        <label htmlFor="transcript" className="sr-only">
          Call transcript
        </label>
        <Textarea
          id="transcript"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing && e.keyCode !== 229 && canAnalyze) {
              e.preventDefault()
              onAnalyze()
            }
          }}
          placeholder={'Agent: Thank you for calling, how can I help?\nCaller: Hi, I\'m calling about my claim…\n\nPaste a transcript or load a sample to get started.'}
          className="min-h-[340px] resize-y rounded-xl bg-muted/40 p-4 font-mono text-[13px] leading-relaxed xl:min-h-[420px]"
        />
        {dictation.listening && (
          <span className="absolute top-8 right-8 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-medium text-white shadow">
            <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden />
            Recording
          </span>
        )}
      </div>

      {audioFile && (
        <div className="mx-5 mb-3 flex items-center gap-2 rounded-xl border border-dashed bg-accent/40 px-3 py-2 text-xs">
          <FileAudio className="size-4 text-primary" aria-hidden />
          <span className="truncate font-medium">{audioFile}</span>
          <span className="text-muted-foreground">· Speech-to-text integration ready</span>
          <button
            type="button"
            onClick={() => setAudioFile(null)}
            className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Remove audio file"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t px-5 py-4">
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload aria-hidden />
          Upload audio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMic}
          aria-pressed={dictation.listening}
          className={cn(dictation.listening && 'border-red-300 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300')}
        >
          {dictation.listening ? <MicOff aria-hidden /> : <Mic aria-hidden />}
          {dictation.listening ? 'Stop' : 'Dictate'}
        </Button>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-muted-foreground">
            Clear
          </Button>
        )}
        <span className="ml-auto hidden text-xs text-muted-foreground tabular-nums sm:inline">
          {lineCount} lines · {value.length.toLocaleString()} chars
        </span>
        <Button onClick={onAnalyze} disabled={!canAnalyze} className="h-9 w-full px-4 sm:w-auto">
          {loading ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
          {loading ? 'Analyzing…' : 'Analyze Call'}
        </Button>
      </div>
    </section>
  )
}
