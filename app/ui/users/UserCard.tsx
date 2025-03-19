
import Image from "next/image";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import AcmeLogo from "../acme-logo";




interface User {
  profileImage?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface UserCardProps {
  user: User;
  onMessageClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onMessageClick }) => {
  const isValidUrl = (url?: string) => {
    try {
      return url && new URL(url).protocol.startsWith("http");
    } catch {
      return false;
    }
  };



  return (
    <div className="flex flex-col transition-transform hover:scale-105">
      <div className="w-80 h-32 bg-blue-900 rounded-t-2xl flex flex-col items-center justify-center">
        <AcmeLogo />
        <h4 className="text-white text-center">{user.role}</h4>
      </div>

      <div className="w-80 h-96 bg-white rounded-xl shadow-lg overflow-hidden border-b-2 border-b-blue-900 p-6 flex flex-col items-center text-center">
        {isValidUrl(user.profileImage) ? (
          <Image
            src={user.profileImage!} // Image will be loaded only if it's a valid URL
            alt="User Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border mb-4"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 text-blue-900 font-bold text-3xl mb-4 border">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
          {user?.name || "John Doe"}
        </h2>
        <p className="text-gray-600 flex items-center justify-center text-sm">
          <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
          {user?.email || "johndoe@example.com"}
        </p>
        <p className="text-gray-600 flex items-center justify-center text-sm">
          <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
          {user?.phone || "(123) 456-7890"}
        </p>

        {/* Action Button */}
        <button
          onClick={onMessageClick}
          className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg w-full"
        >
          Send Message
        </button>

        {/* Social Media Icons */}
        <div className="mt-4 flex space-x-4">
          {user.facebook && <a href={user.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook  className="w-12 h-12 text-blue-600"/></a>}
          {user.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter  className="w-12 h-12 text-blue-400" /></a>}
          {user.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin  className="w-12 h-12 text-blue-700"/></a>}
          {user.instagram && <a href={user.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram  className="w-12 h-12 text-pink-500" /></a>}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
