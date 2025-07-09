import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const UpdateUserRoleModal = ({ isOpen, setIsOpen, role, userEmail }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updatedRole, setUpdatedRole] = useState(role);

  function close() {
    setIsOpen(false);
  }

  // get data === useQuery
  // update/add/delete === useMutation

  const mutation = useMutation({
    mutationFn: async (role) => {
      const { data } = await axiosSecure.patch(
        `/user/role/update/${userEmail}`,
        { role }
      )
      return data
    },
    onSuccess:data => {
      toast.success('User Role Updated Successfully')
      setIsOpen(false)
      // invalidate query
      queryClient.invalidateQueries(['users'])
    },
    onError: error => {
      console.log(error)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(updatedRole)
  };
  return (
    <>
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
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-2xl border border-gray-300"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-black"
              >
                Update user role
              </DialogTitle>
              <form onSubmit={handleSubmit}>
                <div>
                  <select
                    value={updatedRole}
                    onChange={(e) => setUpdatedRole(e.target.value)}
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
                  <button
                    type="submit"
                    className="bg-green-600 py-2 px-3 cursor-pointer text-gray-300 rounded-xl"
                  >
                    Update
                  </button>
                  <button
                    onClick={close}
                    className="bg-red-600  py-2 px-3 cursor-pointer text-gray-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateUserRoleModal;
