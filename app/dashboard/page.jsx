"use client"
import React from 'react'
import Image from 'next/image'

const page = () => {
  function loading_img(){
    return `https://img.freepik.com/free-psd/3d-rendering-loading-ui-icon_23-2150838963.jpg?uid=R150377377&ga=GA1.1.766291229.1748918086&semt=ais_items_boosted&w=740`
  }
  
  return (
    <div className='w-full min-h-screen'>
      <Image 
        src='/home.jpg' 
        alt='Image Loading'  
        className='w-100 h-100' 
        width={100} 
        height={100} 
        quality={100}  
      
      />
    </div>
  )
}

export default page