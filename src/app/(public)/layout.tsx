import { Footer } from '@/components/layout/Footer'
import BackButton from '@/components/ui/BackButton'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackButton />
      <main className="pt-0">{children}</main>
      <Footer />
    </>
  )
}
