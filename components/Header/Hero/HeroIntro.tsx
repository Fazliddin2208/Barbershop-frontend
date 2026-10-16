import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroIntro() {
  return (
    <div className='text-white space-y-6'>
        <p className='uppercase'>Welcome to harika</p>
        <h1 className='text-7xl'>Experience the Art of Grooming. The Best Barbershop in Town!</h1>

        <div className='flex gap-4'>
            <Button asChild>
              <Link href="/register">Open a shop</Link>
            </Button>
            <Button asChild variant={'outline'}>
              <Link href="/login">Log in</Link>
            </Button>
        </div>
    </div>
  )
}