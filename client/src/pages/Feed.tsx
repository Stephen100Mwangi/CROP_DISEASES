import { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa6";
import { RiLogoutCircleFill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdOutlineCompost } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import Select, { StylesConfig } from "react-select";
import { FormEvent, ChangeEvent } from "react";
import Spinner from "../components/Spinner";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { IoCloudUpload } from "react-icons/io5";

interface UserData {
  senderName: string;
  name: string;
  email: string;
  id: number;
  profilePicture?: string;
  role?: string;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface Posts {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  content: string;
  likesCount: number;
  comments: string[];
  tags: string[];
}
const Feed = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [postCount, setPostsCount] = useState<number>(0);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [postImageURL, setPostImageURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  //   Image upload with cloudinary
  const [profileImage, setProfileImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
  const [previewURL, setPreviewURL] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Posts | null>(null);
  const [targetId, setTargetId] = useState<string>("");
  const [postsLoading, setPostsLoading] = useState(false);

  const customStyles: StylesConfig<{ label: string; value: string }, false> = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px", // Set a minimum height
      height: "auto", // Allow the component to grow vertically
    }),
    valueContainer: (provided) => ({
      ...provided,
      width: "320px",
      height: "auto", // Allow the value container to expand
    }),
    multiValue: (provided) => ({
      ...provided,
      height: "auto", // Adjust multi-value tags to fit content
    }),
  };

  const loggedInUser = (() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? (JSON.parse(userData) as UserData) : null;
    } catch (error) {
      console.log("Error parsing user data", error);
      return null;
    }
  })();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!loggedInUser?.email) return;

      try {
        const response = await fetch(
          `http://localhost:5650/auth/findByEmail?userEmail=${loggedInUser.email}`
        );

        const data: APIResponse<{ user: UserData }> = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error fetching current user");
        }

        setCurrentUserId(data.user.id);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching current user"
        );
      }
    };

    fetchCurrentUser();
  }, [loggedInUser]);

  const tagOptions = [
    // Crop Categories
    { value: "maize", label: "Maize" },
    { value: "wheat", label: "Wheat" },
    { value: "rice", label: "Rice" },
    { value: "potato", label: "Potato" },
    { value: "tomato", label: "Tomato" },

    // Disease Categories
    { value: "fungal", label: "Fungal Disease" },
    { value: "bacterial", label: "Bacterial Disease" },
    { value: "viral", label: "Viral Disease" },
    { value: "pest", label: "Pest Damage" },

    // Treatment Categories
    { value: "prevention", label: "Prevention" },
    { value: "treatment", label: "Treatment" },
    { value: "pesticides", label: "Pesticides" },
    { value: "organic", label: "Organic Solutions" },

    // General Categories
    { value: "question", label: "Question" },
    { value: "discussion", label: "Discussion" },
    { value: "success-story", label: "Success Story" },
    { value: "advice", label: "Advice" },
    { value: "news", label: "News" },
    { value: "research", label: "Research" },
  ];

  const handleImageChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShowPreview(true);
    e.preventDefault();
    // Grab the first image
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/svg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/svg+xml")
    ) {
      setProfileImage(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      toast.error("Please provide a valid image");
      return;
    }
  };

  const uploadImage = async (e:FormEvent) => {
    e.preventDefault();
    setShowPreview(false);

    if (!profileImage) {
      toast.error("Please select an image");
      return;
    }

    setImageLoading(true);

    try {
      // Create a formData
      const formData = new FormData();
      formData.append("file", profileImage);
      formData.append("upload_preset", upload_preset);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv5tddhyx/image/upload",
        formData
      );

      if (response.status !== 200) {
        toast.error("Error uploading image");
        setShowPreview(false);
        setProfileImage(null);
        return;
      }
      const imageURL = response.data.secure_url;
      setPostImageURL(imageURL);

      setIsLoading(false);
      toast.success("Image uploaded successfully");
    } catch (error: unknown) {
      console.error("Error details:", error);
      toast.error("Error uploading image:");
      setImageLoading(false);
    } finally {
      setImageLoading(false);
    }
  };

  const handleData = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !currentUserId ||
      !postTitle ||
      !postContent ||
      !postImageURL ||
      !postTags
    ) {
      toast.error("All fields must be provided");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5650/forumPosts/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          title: postTitle,
          content: postContent,
          imageUrl: postImageURL,
          tags: postTags,
        }),
      });

      if (!response) {
        toast.error("Error creating post");
        return;
      } else {
        toast.success("Successful post creation");
        return;
      }
    } catch (error) {
      toast("Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:5650/forumPosts/all", {
        method: "GET",
      });

      if (!response) {
        toast.error("Error fetching users");
        return;
      }
    };

    fetchPosts();
  }, []);

  

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      const response = await fetch("http://localhost:5650/forumPosts/all");
      if (!response.ok) {
        toast.error("Error fetching posts");
        return;
      }

      const data = await response.json();
      const allPosts = data.forumPosts;
      const ownForumPosts = allPosts.filter(
        (eachPost: Posts) => eachPost.userId === currentUserId
      );
      setPosts(ownForumPosts);
      setPostsCount(ownForumPosts.length);
      setPostsLoading(false);
    };

    fetchPosts();
  }, [currentUserId]);

  const handleUpdatePost = async (postId: string) => {
    if (!editingPost) {
      toast.error("No post selected for update");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5650/forumPosts/${postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitle,
            content: postContent,
            // tags: postTags.length > 0 ? postTags : editingPost.tags,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Error updating post");
        return;
      }

      toast.success("Post updated successfully");
      setShowUpdateForm(false);
      return;
    } catch (error) {
      console.log(error);
      toast.error("Error updating post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = (postId: string) => async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleUpdatePost(postId);
  };

  const handleUpdate = async (eachPost:Posts) => {
    setEditingPost(eachPost);
    setShowUpdateForm(true);
    setPostTitle(eachPost.title);
    setTargetId(eachPost.id); // Set the target ID as a string
    setPostContent(eachPost.content);
    setPostTags(eachPost.tags);
  };

  return (
    <div className="w-full h-screen overflow-clip flex bg-gray">
      <Toaster position="top-left"></Toaster>
      <div className="h-full flex-[1] p-5 py-2 flex flex-col space-y-5 border border-r-slate-500">
        <div className="logo flex items-center space-x-5 my-5 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5">
          <FaUsers className="text-3xl"></FaUsers>
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">34</p>
            <p className="font-thin">Followers</p>
          </div>
        </div>
        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5">
          <MdOutlineCompost className="text-3xl"></MdOutlineCompost>
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">{postCount}</p>
            <p className="font-thin">Posts</p>
          </div>
        </div>
        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5">
          <MdNotificationsActive className="scale-150"></MdNotificationsActive>
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">5</p>
            <p className="font-thin">Notifications</p>
          </div>
        </div>
        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5">
          <IoChatbubbleEllipsesSharp className="text-3xl"></IoChatbubbleEllipsesSharp>
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">12</p>
            <p className="font-thin">Messages</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-crop p-2 w-48 text-gray px-5 rounded-md"
        >
          Create a post
        </button>

        <div className="flex absolute bottom-5 space-x-3 hover:text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-danger ">
          <RiLogoutCircleFill className="text-3xl"></RiLogoutCircleFill>
          <p>Logout</p>
        </div>
      </div>
      <div className=" relative h-full flex-[4] overflow-scroll overflow-x-hidden grid grid-cols-2 p-5">
        {postsLoading && <Spinner text="Fetching posts ..."></Spinner>}
        {posts.map((eachPost) => (
          <div
            className="w-[400px] shadow-xl bg-[#f9f9f9] p-3 max-h-fit rounded-xl flex flex-col space-y-3 items-center justify-center"
            key={eachPost.id}
          >
            <img
              className="w-[100%] h-64 object-cover rounded-xl"
              src={eachPost?.imageUrl}
              alt={eachPost.title}
            />
            <p className="font-lato font-bold text-xl">{eachPost.title}</p>
            <p className="font-thin text-lg line-clamp-3">{eachPost.content}</p>
            <div className="flex space-x-1 w-full">
              {eachPost.tags.map((eachTag) => (
                <span className="text-xs bg-slate-500 text-gray px-3 items-center justify-center py-1">
                  {eachTag}
                </span>
              ))}
            </div>
            <p>{eachPost.likesCount} likes</p>

            <div className="flex items-center justify-between w-full">
              <button className="items-center flex p-2 px-5 rounded-sm bg-danger text-gray hover:rounded-md">
                Delete Project
              </button>
              <button
                onClick={handleUpdateClick(targetId)}
                className="items-center flex p-2 px-5 rounded-sm bg-slate-500 text-gray hover:rounded-md"
              >
                Update Project
              </button>
            </div>
            {/* <div>{eachPost.tags.map(eachTag => <div>{eachTag}</div>)}</div> */}
          </div>
        ))}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdate}
            className="absolute bg-slate-500 left-10 shadow-xl flex flex-col space-y-4 p-3 rounded-md top-10 h-fit w-fit"
          >
            <div className="flex flex-col space-y-2">
              <label htmlFor="Title" className="font-semibold text-gray">
                Post Title
              </label>
              <input
                value={postTitle}
                type="text"
                onChange={(e) => setPostTitle(e.target.value)}
                className="font-thin p-2 px-3 outline-none"
                placeholder="Input a title for your post"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="Tags" className="font-semibold text-gray">
                What does your post cover
              </label>
              <Select
                isMulti
                className="outline-none"
                styles={customStyles}
                options={tagOptions}
                onChange={(selectedOptions) =>
                  setPostTags(selectedOptions.map((option) => option.value))
                }
              ></Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="Content" className="font-semibold text-gray">
                Post Content
              </label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="font-thin p-2 px-3 outline-none"
                rows={5}
                placeholder="Write something about your post"
              />
            </div>

            <button
              disabled={isLoading}
              onClick={handleUpdatePost(targetId)}
              className="p-2 px-4 hover:bg-white hover:text-slate-500 hover:shadow-md text-slate-500 bg-gray"
            >
              {isLoading ? (
                <Spinner text={"Updating post ..."}></Spinner>
              ) : (
                "Update Post"
              )}
            </button>
          </form>
        )}
        {showForm && (
          <form
            onSubmit={handleData}
            className="absolute bg-slate-500 left-10 shadow-xl flex flex-col space-y-4 p-3 rounded-md top-10 h-fit w-fit"
          >
            <div className="flex flex-col space-y-2">
              <label htmlFor="Title" className="font-semibold text-gray">
                Post Title
              </label>
              <input
                value={postTitle}
                type="text"
                onChange={(e) => setPostTitle(e.target.value)}
                className="font-thin p-2 px-3 outline-none"
                placeholder="Input a title for your post"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="Tags" className="font-semibold text-gray">
                What does your post cover
              </label>
              <Select
                isMulti
                className="outline-none"
                styles={customStyles}
                options={tagOptions}
                onChange={(selectedOptions) =>
                  setPostTags(selectedOptions.map((option) => option.value))
                }
              ></Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="Image" className="font-semibold text-gray">
                Post Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="font-thin p-2 px-3"
                placeholder="Input a title for your post"
              />
            </div>

            {showPreview && (
              <button
                className="bg-gray text-slate-500 p-2 flex items-center space-x-2 justify-center"
                onClick={uploadImage}
              >
                <p>Upload Image</p>
                <IoCloudUpload></IoCloudUpload>
              </button>
            )}

            {imageLoading && (
              <Spinner text="Uploading Image...Please wait"></Spinner>
            )}

            {/* Preview */}

            {showPreview && (
              <div className="flex flex-col space-y-2 mx-auto">
                <img src={previewURL} alt="" className="size-24 object-cover" />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label htmlFor="Content" className="font-semibold text-gray">
                Post Content
              </label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="font-thin p-2 px-3 outline-none"
                rows={5}
                placeholder="Write something about your post"
              />
            </div>

            <button
              disabled={isLoading}
              className="p-2 px-4 hover:bg-white hover:text-slate-500 hover:shadow-md text-slate-500 bg-gray"
            >
              {isLoading ? (
                <Spinner text={"Creating post ..."}></Spinner>
              ) : (
                "Create Post"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feed;
