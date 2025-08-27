import React from 'react'
import HeroComponent from './Hero'
import MenuComponent from './Menu'

type Props = {}

export default function HeaderComponent({}: Props) {
  return (
    <div>
      <MenuComponent />
      <HeroComponent />
    </div>
  )
}