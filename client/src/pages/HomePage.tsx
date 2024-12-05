import { useState } from "react";
import { Link } from "react-router-dom";
import { PiChatsCircleFill } from "react-icons/pi";
import { MdNotificationsActive } from "react-icons/md";
import { BiQrScan } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { MdCompost } from "react-icons/md";
import { IoMenuOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
const HomePage = () => {
  const [count] = useState(100);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="flex h-screen w-full max-sm:flex-col max-sm:space-y-0">
      <div className="relative flex-3 left flex flex-col space-y-6 justify-start font-montserrat items-start p-8 pt-12 bg-crop max-sm:p-5">
        <div className="logo flex items-center space-x-2 font-light font-roboto mb-20 max-sm:mb-0">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        {showMenu ? (
          <IoMdClose
            className="text-3xl cursor-pointer absolute top-0 right-8 sm:hidden"
            onClick={() => setShowMenu(false)}
          ></IoMdClose>
        ) : (
          <IoMenuOutline
            className="text-3xl cursor-pointer absolute top-0 right-8 sm:hidden"
            onClick={() => setShowMenu(true)}
          ></IoMenuOutline>
        )}
        {showMenu && (
          <div className="flex flex-col space-y-5">
            <Link
              to={"/chat"}
              className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 sm:hidden"
            >
              <PiChatsCircleFill className="text-2xl"></PiChatsCircleFill>
              <p>Visit ChatBoard</p>
            </Link>
            <Link
              to={"/scanCrop"}
              className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 sm:hidden"
            >
              <BiQrScan className="text-2xl"></BiQrScan>
              <p>Scan Crops</p>
            </Link>
            <Link
              to={"/posts"}
              className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 sm:hidden"
            >
              <MdCompost className="text-2xl"></MdCompost>
              <p>View Forum posts</p>
            </Link>
            <div className="flex group relative items-center text-white space-x-5 p-2 hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 sm:hidden">
              <MdNotificationsActive className="text-2xl"></MdNotificationsActive>
              <div className="absolute group-hover:bg-crop group-hover:text-gray size-6 flex justify-center items-center -top-3 font-lato font-medium text-[12px] text-crop bg-gray rounded-full p-2 -left-2">
                {count}
              </div>
              <p>Notifications</p>
            </div>
            <div className="flex items-center bg-danger text-gray space-x-5 p-2 hover:text-danger hover:bg-gray cursor-pointer w-56 sm:hidden">
              <RiLogoutCircleFill className="text-2xl"></RiLogoutCircleFill>
              <p>Logout</p>
            </div>
          </div>
        )}

        <Link
          to={"/chat"}
          className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 max-sm:hidden"
        >
          <PiChatsCircleFill className="text-2xl"></PiChatsCircleFill>
          <p>Visit ChatBoard</p>
        </Link>
        <Link
          to={"/scanCrop"}
          className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 max-sm:hidden"
        >
          <BiQrScan className="text-2xl"></BiQrScan>
          <p>Scan Crops</p>
        </Link>
        <Link
          to={"/posts"}
          className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 max-sm:hidden"
        >
          <MdCompost className="text-2xl"></MdCompost>
          <p>View Forum posts</p>
        </Link>
        <div className="flex group relative items-center text-white space-x-5 p-2 hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56 max-sm:hidden">
          <MdNotificationsActive className="text-2xl"></MdNotificationsActive>
          <div className="absolute group-hover:bg-crop group-hover:text-gray size-6 flex justify-center items-center -top-3 font-lato font-medium text-[12px] text-crop bg-gray rounded-full p-2 -left-2">
            {count}
          </div>
          <p>Notifications</p>
        </div>
        <div className="flex items-center bg-danger text-gray space-x-5 p-2 hover:text-danger hover:bg-gray cursor-pointer w-56 absolute bottom-10 max-sm:hidden">
          <RiLogoutCircleFill className="text-2xl"></RiLogoutCircleFill>
          <p>Logout</p>
        </div>
      </div>
      <div className="right relative flex-1 flex justify-center items-center bg-gray overflow-clip w-[100%] max-sm:p-5">
        <p className="text-xl leading-10 font-thin z-[1000] left-5 top-24 absolute text-back w-[620px] max-sm:w-full max-sm:mx-auto">
          Welcome to <span className="font-bold text-crop">CropGuard!</span>{" "}
          Your ultimate companion in smart farming. Whether you need to scan
          your crops for diseases, participate in community forums, or stay
          up-to-date with important notifications, CropGuard has you covered.
          Start exploring today and keep your harvests healthy and productive!
        </p>

        <img
          src="/tomato.png"
          className="z-10 rounded-full m-20 w-[720px] absolute -right-64 h-[560px] object-cover max-sm:right-0"
          alt=""
        />
      </div>
    </div>
  );
};

export default HomePage;
