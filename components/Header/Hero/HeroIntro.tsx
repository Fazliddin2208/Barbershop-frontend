import { Button } from '@/components/ui/button'
import React from 'react'

type Props = {}

export default function HeroIntro({}: Props) {
  return (
    <div className='text-white space-y-6'>
        <p className='uppercase'>Welcome to harika</p>
        <h1 className='text-7xl'>Experience the Art of Grooming. The Best Barbershop in Town!</h1>

        <div className='flex gap-4'>
            <Button>Band qilish</Button>
            <Button variant={'outline'}>Hizmatlarni korish</Button>
        </div>
    </div>
  )
}