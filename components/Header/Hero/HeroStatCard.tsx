import { IconProps } from '@/types/Icon';
import { User } from 'lucide-react'
import React from 'react'

type Props = {
    title?: string;
    Icon?: React.FC<IconProps>;
    stat?: string;
    description?: string
}

export default function HeroStatCard({title, Icon, stat, description}: Props) {
  return (
    <div className='text-white w-1/2 border'>
        <div className='flex items-center gap-2'>
            <div className='bg-bg p-2 rounded-full w-auto'>{Icon && <Icon className='w-6 h-6' />}</div>
            <h3>{title}</h3>
        </div>
        <h2>{stat}</h2>
        <p className='capitalize text-text-secondary'>{description}</p>
    </div>
  )
}