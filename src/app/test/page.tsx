import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] px-5 flex flex-col gap-4 py-10">
      <Button variant="primary">Enabled</Button>
      <Button disabled>Disabled</Button>
      <Button variant="sub">Sub Enabled</Button>
    </main>
  )
}
