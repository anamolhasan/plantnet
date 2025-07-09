import { useState } from "react";
import UpdateUserRoleModal from "../../Modal/UpdateUserRoleModal";

const UserDataRow = ({ user }) => {
  const { email, role, status } = user;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className={`${
          status === 'requested'
          ? 'text-yellow-500'
          : status === 'verified'
          ? 'text-green-500'
          : 'text-red-500'
        } whitespace-no-wrap`}>
          {status ? status : "Unavailable"}
        </p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span onClick={()=>setIsOpen(true)} className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </span>
        {/* Modal */}
        <UpdateUserRoleModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          role={role}
          userEmail={email}
        />
      </td>
    </tr>
  );
};

export default UserDataRow;
