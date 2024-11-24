import { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { MdNavigateNext, MdOutlinePostAdd } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
import { GiHammerSickle } from "react-icons/gi";
import { ImFeed } from "react-icons/im";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

interface Disease {
  id: number;
  name: string;
  images: string[];
  description: string;
  managementPractices: string[];
  preventionMethods: string[];
}

const Diseases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [diseases, setDiseases] = useState<Disease[]>([]);

  useEffect(() => {
    const fetchDiseases = async () => {
      const response = await fetch("http://localhost:5420/diseases");

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error fetching diseases");
      }

      setDiseases(data);
    };

    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter((eachDisease) =>
    eachDisease.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToImage = (diseaseId: number, direction: "next" | "prev") => {
    const container = document.querySelector(
      `#disease-${diseaseId} .image-container`
    );
    if (container) {
      const scrollAmount = direction === "next" ? 320 : -320; // 320px is approximate width of image + margin
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen overflow-clip w-full bg-gray  flex flex-col">
      <Toaster position="top-left"></Toaster>
      <div className="controls bg-crop w-full p-5 py-2 flex items-center justify-between">
        <div className="logo flex items-center space-x-5 my-10 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <div className="flex h-fit items-center space-x-4 bg-white p-2 px-5">
          <input
            type="text"
            value={searchQuery}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search disease by name"
            className="font-thin outline-none p-1 w-56"
          />
          <IoIosSearch></IoIosSearch>
        </div>
      </div>
      <div className="flex justify-between items-start h-[calc(100vh-100px)] bg-crop w-full">
        <div className="w-[25%] p-2 flex flex-col space-y-5">
          <Link
            to={"/home"}
            className="flex relative space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray"
          >
            <AiFillHome className="text-xl" />
            <p className="text-lg">Home</p>
          </Link>
          <Link
            to={"/feed"}
            className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray"
          >
            <ImFeed className="text-xl"></ImFeed>
            <p className="text-lg">Feed</p>
          </Link>
          <Link
            to={"/chat"}
            className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray"
          >
            <IoChatbubbleEllipsesSharp className="text-xl"></IoChatbubbleEllipsesSharp>
            <p className="text-lg">Chat</p>
          </Link>
          <Link
            to={"/posts"}
            className="flex space-x-3 text text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray"
          >
            <MdOutlinePostAdd className="text-xl"></MdOutlinePostAdd>
            <p className="text-lg">Posts</p>
          </Link>
          <Link
            to={"/diseases"}
            className="flex space-x-3  bg-gray text-crop transition-all cursor-pointer p-2 w-56 items-center"
          >
            <GiHammerSickle className="text-xl"></GiHammerSickle>
            <p className="text-lg">Diseases</p>
          </Link>

          <div className="flex absolute bottom-10 space-x-3 hover:text-danger text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray bg-danger ">
            <RiLogoutCircleFill></RiLogoutCircleFill>
            <p>Logout</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-20 w-[75%] bg-gray p-20 justify-between items-center h-[100%] overflow-scroll overflow-x-hidden">
          {filteredDiseases.map((eachDisease) => (
            <div
              key={eachDisease.id}
              id={`disease-${eachDisease.id}`}
              className="bg-[#f9f9f9] p-2 rounded-md flex flex-col space-y-4 w-96"
            >
              <small>{eachDisease.id}</small>
              <p className="text-base font-bold">{eachDisease.name}</p>
              <div className="relative w-[99%] h-52 mx-auto p-2 rounded-lg shadow-md overflow-clip">
                <div
                  onClick={() => scrollToImage(eachDisease.id, "prev")}
                  className="size-6 z-50 absolute left-3 top-[45%] flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-300 text-black rotate-180"
                >
                  <MdNavigateNext></MdNavigateNext>
                </div>
                <div
                  onClick={() => scrollToImage(eachDisease.id, "next")}
                  className="size-6 z-50 absolute right-3 top-[45%] flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-300 text-black"
                >
                  <MdNavigateNext></MdNavigateNext>
                </div>
                <div className="flex justify-start flex-nowrap overflow-clip flex-row w-full h-full relative">
                  {eachDisease.images.map((eachImage, index) => (
                    <img
                      src={eachImage}
                      className="w-80 z-10 h-48 mx-4 object-cover shadow-md rounded-lg"
                      key={index}
                      alt={eachDisease.name}
                    />
                  ))}
                </div>
              </div>
              <p className="font-medium ">Description</p>
              <div>{eachDisease.description}</div>
              <div>
                <p className="font-medium ">Management Practices</p>
                {eachDisease.managementPractices.map((eachPractice, index) => (
                  <p key={index}>{eachPractice}</p>
                ))}
              </div>
              <div>
                <p className="font-medium ">Prevention Methods</p>
                {eachDisease.preventionMethods.map((eachPractice, index) => (
                  <p key={index}>{eachPractice}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diseases;
