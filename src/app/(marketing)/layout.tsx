import React from 'react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex justify-center items-center'>{children}</div>
  )
}
