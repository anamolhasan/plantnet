import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

const UpdateUserRole = () => {


  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
      >
        Open dialog
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-2xl"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-black"
              >
                Update user role
              </DialogTitle>
              <form>
               <div>
                  <select
                  name="role"
                  id=""
                  className="w-full my-3 border border-gray-300 rounded-xl px-2 py-4"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
               </div>
               <div className="flex justify-between mt-5">
                <button className="bg-green-600 py-2 px-3 cursor-pointer text-gray-800 rounded-xl">Update</button>
                <button className="bg-red-600 py-2 px-3 cursor-pointer text-gray-800 rounded-xl">Cancel</button>
               </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateUserRole;
