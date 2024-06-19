const Footer = () => {
  return (
    <div className='bg-blue-800 py-10'>
        <div className='container mx-auto flex justify-between items-center'>
            <span className=' tracking-tight'>
              <img src="IsracardLogo.png"/>
            </span>
            <span className='text-white font-bold tracking-tight flex gap-4'>
                <p className='cursor-pointer'>Privacy Policy</p>
                <p className='cursor-pointer'>Terms of Service</p>
            </span>
        </div>
    </div>
  )
}

export default Footer