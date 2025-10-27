import React from 'react'
import HeroStatCard from './HeroStatCard'
import { FaStar, FaUser } from 'react-icons/fa'

type Props = {}

export default function HeroStats({}: Props) {
  return (
    <div className='border flex flex-col items-end'>
        <HeroStatCard Icon={FaUser} title='Customers' stat='1,291' description='We already have more than 1,291 customers' />
        <HeroStatCard Icon={FaStar} title='Awards' stat='15 +' description='We received 15 awards during our career both at home and abroad' />
    </div>
  )
}