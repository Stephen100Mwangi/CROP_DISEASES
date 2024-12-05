import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { RiLogoutCircleFill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { ImFeed } from "react-icons/im";
import { GiHammerSickle } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiFillHome, AiFillLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { FaRegLightbulb } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoMenuOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

interface Post {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  content: string;
  likesCount: number;
  comments: string[];
  tags: string[];
  commentCount?: number;
}

interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  forumPostId: number;
}

const Dashboard = () => {
  const [usersCount] = useState(0);
  const [forumPosts, setForumPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [postCommentedId, setPostCommentedId] = useState("");
  const [enlighteningPosts, setEnlighteningPosts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [userId, setCurrentUserId] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const loggedInUser = (() => {
    const userData = localStorage.getItem("user");
    return userData && JSON.parse(userData);
  })();
  const userEmail = loggedInUser.email;

  useEffect(() => {
    if (!userEmail) {
      return;
    }
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:5650/auth/findByEmail/?userEmail=${userEmail}`
      );
      console.log(response);
      const data = await response.json();
      const userData = data.user;
      setCurrentUserId(userData.id);
    };

    fetchUser();
  }, [userEmail]);

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
    eachPost.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePostExpansion = (postId: string) => {
    // Adds OR removes ids from expandedPosts array

    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Add or remove comment text area
  const toggleCommentArea = (postId: string) => {
    postCommentedId === postId
      ? setPostCommentedId("")
      : setPostCommentedId(postId);
  };

  const toggleLikePost = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleEnlighteningPosts = (postId: string) => {
    setEnlighteningPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const sendComment = async (forumPostId: number) => {
    const response = await fetch("http://localhost:5650/comments/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, content, forumPostId }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Error sending comment");
      return;
    }

    toast.success("Comment added successfully");
    setContent("");
  };

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch("http://localhost:5650/comments/all");
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        toast.error(data.message || "Error fetching comments");
        return;
      } else {
        setComments(data.comments);

        forumPosts.forEach((post) => {
          const count = comments.map(
            (eachComment) => eachComment?.forumPostId === parseInt(post.id)
          );
          post.commentCount = count;
        });
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="flex space-x-0 h-screen w-full bg-gray max-sm:flex-col max-sm:space-y-0">
      <Toaster position="top-left"></Toaster>
      <div className="flex relative flex-[1.5] flex-col space-y-3 p-5 px-3 h-screen bg-crop max-sm:pb-3">
        <div className="logo flex items-center space-x-5 my-10 font-light font-roboto max-sm:my-3">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>

        {showMenu ? (
          <IoMdClose
            className="text-3xl cursor-pointer absolute top-5 right-8 sm:hidden"
            onClick={() => setShowMenu(false)}
          ></IoMdClose>
        ) : (
          <IoMenuOutline
            className="text-3xl cursor-pointer absolute top-5 right-8 sm:hidden"
            onClick={() => setShowMenu(true)}
          ></IoMenuOutline>
        )}

        {showMenu && (
          <div className="absolute flex flex-col space-y-3 right-0 bg-crop h-fit p-4 top-40 scale-90 z-[1000]">
            <Link
              to={"/home"}
              className="flex space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray sm:hidden"
            >
              <AiFillHome className="text-xl" />
              <p className="text-lg">Home</p>
            </Link>
            <Link
              to={"/feed"}
              className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray sm:hidden"
            >
              <ImFeed className="text-xl"></ImFeed>
              <p className="text-lg">Feed</p>
            </Link>
            <Link
              to={"/chat"}
              className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray sm:hidden"
            >
              <IoChatbubbleEllipsesSharp className="text-xl"></IoChatbubbleEllipsesSharp>
              <p className="text-lg">Chat</p>
            </Link>
            <Link
              to={"/posts"}
              className="flex space-x-3 text bg-gray text-crop transition-all cursor-pointer p-2 w-56 items-center sm:hidden"
            >
              <MdOutlinePostAdd className="text-xl"></MdOutlinePostAdd>
              <p className="text-lg">Posts</p>
            </Link>
            <Link
              to={"/diseases"}
              className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray sm:hidden"
            >
              <GiHammerSickle className="text-xl"></GiHammerSickle>
              <p className="text-lg">Diseases</p>
            </Link>
            <div className="flex relative space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray sm:hidden">
              <FaUsers className="text-xl" />
              <span className="absolute group-hover:text-gray text-center group-hover:bg-crop hover:bg-crop -top-2.5 text-crop bg-gray flex size-5 items-center justify-center rounded-full text-sm left-1">
                {usersCount}
              </span>
              <p className="text-lg">Users</p>
            </div>

            <div className="flex space-x-3 hover:text-danger text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray bg-danger sm:hidden">
              <RiLogoutCircleFill></RiLogoutCircleFill>
              <p>Logout</p>
            </div>
          </div>
        )}

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
        <Link
          to={"/home"}
          className="flex space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray max-sm:hidden"
        >
          <AiFillHome className="text-xl" />
          <p className="text-lg">Home</p>
        </Link>
        <Link
          to={"/feed"}
          className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray max-sm:hidden"
        >
          <ImFeed className="text-xl"></ImFeed>
          <p className="text-lg">Feed</p>
        </Link>
        <Link
          to={"/chat"}
          className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray max-sm:hidden"
        >
          <IoChatbubbleEllipsesSharp className="text-xl"></IoChatbubbleEllipsesSharp>
          <p className="text-lg">Chat</p>
        </Link>
        <Link
          to={"/posts"}
          className="flex space-x-3 text bg-gray text-crop transition-all cursor-pointer p-2 w-56 items-center max-sm:hidden"
        >
          <MdOutlinePostAdd className="text-xl"></MdOutlinePostAdd>
          <p className="text-lg">Posts</p>
        </Link>
        <Link
          to={"/diseases"}
          className="flex space-x-3 text-gray hover:text-crop transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray max-sm:hidden"
        >
          <GiHammerSickle className="text-xl"></GiHammerSickle>
          <p className="text-lg">Diseases</p>
        </Link>
        <div className="flex relative space-x-3 text-gray group transition-all hover:text-crop cursor-pointer p-2 w-56 items-center hover:bg-gray max-sm:hidden">
          <FaUsers className="text-xl" />
          <span className="absolute group-hover:text-gray text-center group-hover:bg-crop hover:bg-crop -top-2.5 text-crop bg-gray flex size-5 items-center justify-center rounded-full text-sm left-1">
            {usersCount}
          </span>
          <p className="text-lg">Users</p>
        </div>

        <div className="flex absolute bottom-10 space-x-3 hover:text-danger text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-gray bg-danger max-sm:hidden">
          <RiLogoutCircleFill></RiLogoutCircleFill>
          <p>Logout</p>
        </div>
      </div>
      <div className="flex-[6] h-[100%] overflow-scroll py-5 grid grid-cols-2 overflow-x-hidden px-5 items-center justify-center flex-wrap gap-20 max-sm:grid-cols-1">
        {filteredPosts.map((eachPost) => (
          <div
            className="w-[500px] relative shadow-xl bg-[#f9f9f9] p-3 max-h-fit rounded-xl flex flex-col space-y-3 items-center justify-center max-sm:w-full max-sm:mx-auto"
            key={eachPost.id}
          >
            <img
              className="w-[100%] h-64 object-cover rounded-xl max-sm:h-52"
              src={eachPost?.imageUrl}
              alt={eachPost.title}
            />
            <p className="font-lato font-bold text-xl line-clamp-1">
              {eachPost.title}
            </p>

            <p
              className={`font-thin text-lg ${
                !expandedPosts.includes(eachPost.id) ? "line-clamp-2" : ""
              }`}
            >
              {eachPost.content}
            </p>

            {expandedPosts.includes(eachPost.id) ? (
              <span
                onClick={() => togglePostExpansion(eachPost.id)}
                className="cursor-pointer hover:text-slate-600"
              >
                Show Less
              </span>
            ) : (
              <span
                onClick={() => togglePostExpansion(eachPost.id)}
                className="cursor-pointer hover:text-slate-600"
              >
                Show More
              </span>
            )}

            {/* <div>{eachPost.tags.map(eachTag => <div>{eachTag}</div>)}</div> */}
            <div className="flex items-center w-full px-12 justify-between">
              <IoMdShareAlt className="text-xl cursor-pointer"></IoMdShareAlt>

              <FaCommentDots
                className="text-xl cursor-pointer"
                onClick={() => toggleCommentArea(eachPost.id)}
              ></FaCommentDots>
              {likedPosts.includes(eachPost.id) ? (
                <AiFillLike
                  onClick={() => toggleLikePost(eachPost.id)}
                  className="text-xl cursor-pointer"
                ></AiFillLike>
              ) : (
                <BiLike
                  onClick={() => toggleLikePost(eachPost.id)}
                  className="text-xl cursor-pointer"
                ></BiLike>
              )}
              {enlighteningPosts.includes(eachPost.id) ? (
                <FaLightbulb
                  onClick={() => toggleEnlighteningPosts(eachPost.id)}
                  className="text-xl cursor-pointer"
                ></FaLightbulb>
              ) : (
                <FaRegLightbulb
                  onClick={() => toggleEnlighteningPosts(eachPost.id)}
                  className="text-xl cursor-pointer"
                ></FaRegLightbulb>
              )}
            </div>

            {/* Comment area */}
            {eachPost.id === postCommentedId ? (
              <form
                className="w-full flex space-x-2 items-center absolute top-24 left-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <textarea
                  rows={3}
                  name="comment"
                  className="p-2 w-[80%] outline outline-1"
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add a comment here"
                />
                <button
                  onClick={() => sendComment(parseInt(eachPost.id))}
                  className="bg-slate-500 text-gray px-4 p-2"
                >
                  Send
                </button>
              </form>
            ) : (
              ""
            )}

            <div className="flex w-full justify-between">
              <p>{eachPost.likesCount} likes</p>
              <p>{eachPost.likesCount} people found this insightful</p>
              <p>{eachPost.commentCount} comments</p>
            </div>
            <div className="flex justify-start items-start w-full flex-wrap">
              {eachPost?.tags.map((eachTag, index) => (
                <span
                  key={index}
                  className="bg-slate-500 text-gray rounded-md text-[8px] p-2 px-5 m-2"
                >
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
