import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const PurchaseModal = ({ closeModal, isOpen }) => {
  // Total Price Calculation

  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none '
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Plant: Money Plant</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Category: Indoor</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Customer: PH</p>
            </div>

            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Price: $ 120</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Available Quantity: 5</p>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default PurchaseModal
