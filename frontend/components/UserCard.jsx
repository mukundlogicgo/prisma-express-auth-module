import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

const UserCard = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.setItem("token", "");
    toast.success("Log out successfully");
    router.replace("/auth/signup");
  };

  return (
    <>
      <div className="flex items-center h-screen w-full justify-center">
        <div className="max-w-md">
          <div className="bg-white shadow-xl rounded-lg py-3">
            <div className="photo-wrapper p-2">
              {user?.profilePicture ? (
                <img
                  className="w-32 h-32 rounded-full mx-auto"
                  src={user?.profilePicture}
                  alt="User avatar"
                />
              ) : (
                <img
                  className="w-32 h-32 rounded-full mx-auto"
                  src="/image/user_avatar.png"
                  alt="User avatar"
                />
              )}
            </div>
            <div className="p-2">
              <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                {user.name}
              </h3>
              <div className="text-center text-gray-400 text-xs font-semibold">
                <p>Web Developer</p>
              </div>
              <table className="text-xs my-3">
                <tbody>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      Email
                    </td>
                    <td className="px-2 py-2">{user.email}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center my-3">
                <button
                  onClick={handleLogout}
                  className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
