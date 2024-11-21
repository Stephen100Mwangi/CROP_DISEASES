import { useState } from "react";
import { Link } from "react-router-dom";
import { PiChatsCircleFill } from "react-icons/pi";
import { MdNotificationsActive } from "react-icons/md";
import { BiQrScan } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { MdCompost } from "react-icons/md";
const HomePage = () => {
  const [count] = useState(100);
  return (
    <div className="flex h-screen w-full">
      <div className="relative flex-3 left flex flex-col space-y-6 justify-start font-montserrat items-start p-8 pt-12 bg-crop">
        <div className="logo flex items-center space-x-2 font-light font-roboto mb-20">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <Link to={"/chat"} className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56">
          <PiChatsCircleFill className="text-2xl"></PiChatsCircleFill>
          <p>Visit ChatBoard</p>
        </Link>
        <Link to={"/scanCrop"} className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56">
          <BiQrScan className="text-2xl"></BiQrScan>
          <p>Scan Crops</p>
        </Link>
        <Link to={"/posts"} className="flex items-center space-x-5 p-2 text-white hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56">
          <MdCompost className="text-2xl"></MdCompost>
          <p>View Forum posts</p>
        </Link>
        <div className="flex group relative items-center text-white space-x-5 p-2 hover:bg-gray hover:text-crop rounded-md transition-all cursor-pointer w-56">
          <MdNotificationsActive className="text-2xl"></MdNotificationsActive>
          <div className="absolute group-hover:bg-crop group-hover:text-gray size-6 flex justify-center items-center -top-3 font-lato font-medium text-[12px] text-crop bg-gray rounded-full p-2 -left-2">
            {count}
          </div>
          <p>Notifications</p>
        </div>
        <div className="flex items-center text-danger space-x-5 p-2 hover:bg-danger hover:text-gray cursor-pointer w-56 absolute bottom-10">
          <RiLogoutCircleFill className="text-2xl"></RiLogoutCircleFill>
          <p>Logout</p>
        </div>
      </div>
      <div className="right relative flex-1 flex justify-center items-center bg-gray overflow-clip">
        <p className="text-xl leading-10 font-thin z-[1000] left-5 top-24 absolute text-back w-[620px]">
          Welcome to <span className="font-bold text-crop">CropGuard!</span> Your ultimate companion in smart farming.
          Whether you need to scan your crops for diseases, participate in
          community forums, or stay up-to-date with important notifications,
          CropGuard has you covered. Start exploring today and keep your
          harvests healthy and productive!
        </p>

        <img
          src="/tomato.png"
          className="z-10 rounded-full m-20 w-[720px] absolute -right-64 h-[560px] object-cover"
          alt=""
        />
      </div>
    </div>
  );
};

export default HomePage;
