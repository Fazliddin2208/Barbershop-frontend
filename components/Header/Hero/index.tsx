import Image from 'next/image'
import React from 'react'
import HeroIntro from './HeroIntro'
import HeroStats from './HeroStats'

export default function HeroComponent() {
  return (
    <div className='w-full h-full flex items-center justify-center relative bg-[]'>
      <div className='w-full h-full absolute bg-black/50 z-5'></div>
      <Image src={'/assets/images/hero-bg.jpg'} alt='hero-bg' width={1000} height={1000} quality={100} className='cover w-full h-full absolute z-0' />
      <div className='relative z-10 w-full px-20 grid grid-cols-2 justify-between'>
          <HeroIntro />
          <HeroStats />
      </div>
    </div>
  )
}