import React, { useEffect, useState } from "react";
import { Avatar, Modal } from "antd";
import { X, User } from "lucide-react";
import { auth } from "@/lib/Firebase";
import { UserOutlined } from "@ant-design/icons";

interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
}

const UserModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
    
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email || "No Email",
        avatar: currentUser.photoURL || undefined,
      });
    }
  }, []);

  return (
    <>
   <div
  onClick={() => setIsModalOpen(true)}
  className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg h-[42px] cursor-pointer hover:bg-white/20 transition"
>
  <Avatar
    size={35}
    src={user?.avatar}
    icon={!user?.avatar && <UserOutlined />}
    style={{
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    }}
  />

  <span className="text-white font-medium truncate max-w-[119px]">
    {user?.name
      ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
      : "Loading..."}
  </span>
</div>


      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={<X className="text-white/70 hover:text-white" />}
        centered
        className="custom-ant-modal"
      >
        {user && (
          <div className="text-center py-4 bg-linear-to-br from-purple-600 via-purple-700 to-purple-900 rounded-2xl text-white">
            {/* Email */}
            <div className="text-white/80 text-sm mb-4">{user.email}</div>

            {/* Avatar */}
            <div className="mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mx-auto border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-white/20 flex items-center justify-center border-2 border-white/20">
                  <User size={32} className="text-white/70" />
                </div>
              )}
            </div>

            {/* Greeting */}
            <h2 className="text-white text-xl font-medium mb-4">
              Hello, {user.name}!
            </h2>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserModal;
