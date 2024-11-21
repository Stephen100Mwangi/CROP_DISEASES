/* eslint-disable @typescript-eslint/no-unused-vars */
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { RiLogoutCircleFill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { ImFeed } from "react-icons/im";
import { GiHammerSickle } from "react-icons/gi";
import { FaSearch, FaUsers } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { FaRegLightbulb } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

interface Post {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  content: string;
  likesCount: number;
  comments: string[];
  tags: string[];
}

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [forumPosts, setForumPosts] = useState<Post[]>([]);
  const [like, setLike] = useState(false);
  const [insightful, setInsightful] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showLess, setShowLess] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:5650/forumPosts/all`);

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error fetching posts");
        return;
      } else {
        setForumPosts(data.forumPosts);

        return;
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = forumPosts.filter((eachPost) =>
    searchQuery.toLowerCase().includes(eachPost.title.toLowerCase())
  );

  const handleLike = async () => {
    setLike((prev) => !prev);
  };

  const handleShowCommentForm = async () => {
    setShowCommentForm((prev) => !prev);
  };

  const changeView = async () => {
    setShowLess((prev) => !prev);
  };

  // const handleSubmit = async () => {};

  return (
    <div className="flex space-x-0 h-screen w-full bg-gray">
      <Toaster position="top-left"></Toaster>
      <div className="flex relative flex-[1.5] flex-col space-y-3 p-5 px-3 h-screen bg-crop">
        <div className="logo flex items-center space-x-5 my-10 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>

        <div className="flex px-3 justify-between items-center bg-white p-2">
          <input
            type="text"
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            placeholder="Search post by name"
            className="outline-none"
          />
          <IoIosSearch></IoIosSearch>
        </div>
        <div className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray">
          <ImFeed className="text-xl"></ImFeed>
          <p className="text-lg">Feed</p>
        </div>
        <Link
          to={"/chat"}
          className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray"
        >
          <IoChatbubbleEllipsesSharp className="text-xl"></IoChatbubbleEllipsesSharp>
          <p className="text-lg">Chat</p>
        </Link>
        <div className="flex space-x-3 text text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray">
          <MdOutlinePostAdd className="text-xl"></MdOutlinePostAdd>
          <p className="text-lg">Posts</p>
        </div>
        <div className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray">
          <GiHammerSickle className="text-xl"></GiHammerSickle>
          <p className="text-lg">Diseases</p>
        </div>
        <div className="flex relative space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray">
          <FaUsers className="text-xl" />
          <span className="absolute group-hover:text-gray group-hover:bg-crop hover:bg-crop -top-2.5 text-crop bg-gray flex size-5 items-center justify-center rounded-full text-sm left-1">
            {usersCount}
          </span>
          <p className="text-lg">Users</p>
        </div>

        <div className="flex absolute bottom-10 space-x-3 hover:text-danger text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray bg-danger ">
          <RiLogoutCircleFill></RiLogoutCircleFill>
          <p>Logout</p>
        </div>
      </div>
      <div className="flex-[6] h-[100%] overflow-scroll py-5 grid grid-cols-2 overflow-x-hidden px-5 items-center justify-center flex-wrap gap-20">
        {forumPosts.map((eachPost) => (
          <div
            className="w-[500px] shadow-xl bg-[#f9f9f9] p-3 max-h-fit rounded-xl flex flex-col space-y-3 items-center justify-center"
            key={eachPost.id}
          >
            <img
              className="w-[100%] h-64 object-cover rounded-xl"
              src={eachPost?.imageUrl}
              alt={eachPost.title}
            />
            <p className="font-lato font-bold text-xl line-clamp-1">
              {eachPost.title}
            </p>
            <p
              className={`font-thin text-lg ${showLess ? "line-clamp-2" : ""}`}
            >
              {eachPost.content}
            </p>
            {showLess ? (
              <span
                onClick={changeView}
                className="cursor-pointer hover:text-slate-600"
              >
                Show More
              </span>
            ) : (
              <span
                onClick={changeView}
                className="cursor-pointer hover:text-slate-600"
              >
                Show Less
              </span>
            )}
            {/* <div>{eachPost.tags.map(eachTag => <div>{eachTag}</div>)}</div> */}
            <div className="flex items-center w-full px-12 justify-between">
              <IoMdShareAlt className="text-xl cursor-pointer"></IoMdShareAlt>

              <FaCommentDots
                className="text-xl cursor-pointer"
                onClick={handleShowCommentForm}
              ></FaCommentDots>

              {like && (
                <AiFillLike
                  onClick={handleLike}
                  className="text-xl cursor-pointer"
                ></AiFillLike>
              )}
              {!like && (
                <BiLike
                  onClick={handleLike}
                  className="text-xl cursor-pointer"
                ></BiLike>
              )}
              {eachPost && (
                <FaLightbulb className="text-xl cursor-pointer"></FaLightbulb>
              )}
              {!eachPost && (
                <FaRegLightbulb className="text-xl cursor-pointer"></FaRegLightbulb>
              )}
            </div>

            {/* Comment area */}
            {showCommentForm && (
              <form
                className="w-full flex space-x-2 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <textarea
                  rows={3}
                  name="comment"
                  className="p-2 w-[80%] outline outline-1"
                  autoFocus
                  placeholder="Add a comment here"
                />
                <button className="bg-slate-500 text-gray px-4 p-2">
                  Send
                </button>
              </form>
            )}

            <p>{eachPost.likesCount} likes</p>
            <p>{eachPost?.comments?.length} comments</p>
            <div className="flex justify-start items-start w-full flex-wrap">
              {eachPost?.tags.map((eachTag) => (
                <span className="bg-slate-500 text-gray rounded-md text-[8px] p-2 px-5 m-2">
                  {eachTag.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="flex flex-col space-y-1">
              {/* {eachPost.comments.map((eachComment, index) => (
                <p key={index}>{eachComment}</p>
              ))} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
