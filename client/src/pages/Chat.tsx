import toast, { Toaster } from "react-hot-toast";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Spinner from "../components/Spinner";
import { formatDistanceToNow } from "date-fns";
import { Socket, io } from "socket.io-client";

interface UserData {
  senderName: string;
  name: string;
  email: string;
  id: number;
  profilePicture?: string;
  role?: string;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string;
  timestamp: string;
  sender: UserData;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interface for events coming from the server
interface ServerToClient {
  getUsers: (users: { userId: string; socketId: string }[]) => void;
  receiveMessage: (message: Message) => void;
  messageSent: (message: Message) => void;
}

//Interface for events sent back to the server
interface ClientToServer {
  newUser: (userId: string) => void;
  sendMessage: (message: {
    senderId: string;
    receiverId: string;
    content: string;
  }) => void;
}

const Chat = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [greeting, setGreeting] = useState("");
  const [userSelected, setUserSelected] = useState<UserData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [friendId, setFriendId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // onlineUsers will be filled as users connect to the socket
  const [onlineUsers, setOnlineUsers] = useState<
    { userId: string; socketId: string }[]
  >([]);

  // Reference point for the socket
  const socketRef = useRef<Socket<ServerToClient, ClientToServer>>();

  // This is a self validating function
  const loggedInUser: UserData | null = (() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? (JSON.parse(userData) as UserData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  })();

  useEffect(() => {
    // Check if we have a user logged in
    if (!currentUserId) {
      return;
    }

    // Initialize socket connection
    socketRef.current = io("http://localhost:4580", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Send userId to the socket on the backend
    socketRef.current.on("connect", () => {
      console.log("Client --- Connected to socket server");
      if (currentUserId !== null) {
        socketRef.current?.emit("newUser", currentUserId.toString());
      }
    });

    socketRef.current?.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for online users updates
    socketRef.current.on("getUsers", (users) => {
      console.log("Online users", users);
      setOnlineUsers(users);
    });

    // Cleanup on unmount - Save resources
    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUserId]);

  // Track incoming messages
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socketRef.current.on("messageSent", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Automatically scroll to bottom when message is sent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle message submit with socket
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentUserId || !friendId || !newMessage.trim()) {
      toast.error("You cannot send an empty message");
      return;
    }

    try {
      const response = await fetch("http://localhost:5650/messages/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: friendId,
          content: newMessage.trim(),
        }),
      });

      const data: APIResponse<Message> = await response.json();
      if (!response.ok) {
        toast.error("Error sending message");
        throw new Error(data.message || "Error sending message");
      }

      setNewMessage("");
      toast.success("Message sent successfully");

      // Update new messages immediately
      setMessages((prev) => [...prev, data.data]);
    } catch (error: unknown) {
      toast.error("Error sending message");
      console.log(error);
    }
  };

  console.log(messages);

  // Check if a user is online
  const isUserOnline = (userId: number) => {
    return onlineUsers.some((user) => user.userId === userId.toString());
  };

  // Update greeting based on the time
  useEffect(() => {
    const hours = new Date().getHours();
    setGreeting(hours < 12 ? "Morning" : hours < 17 ? "Afternoon" : "Evening");
  }, []);

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

  //Fetching all users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5650/auth/findAll");

        const data: APIResponse<{ users: UserData[] }> = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error fetching users");
        } else {
          setUsers(data.users);
          toast.success("Users fetched successfully");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching users."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch a friend's details by ID when friendId changes
  useEffect(() => {
    const fetchFriendDetails = async () => {
      if (!friendId) return; // Don't fetch if friendId is null

      try {
        const response = await fetch(
          `http://localhost:5650/auth/findOne/${friendId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data: UserData = await response.json();

        if (!response.ok) {
          toast.error("Error fetching friend details");
          return;
        } else {
          setUserSelected(data.user);
          toast.success("Friend details fetched successfully.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching friend details.");
        console.error(error);
      }
    };
    fetchFriendDetails();
  }, [friendId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId || !friendId) return;

      try {
        const response = await fetch(
          `http://localhost:5650/messages/getMutualMessages/${currentUserId}/${friendId}`
        );
        const data: APIResponse<Message[]> = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error fetching messages");
        }

        setMessages(data.data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching messages"
        );
      }
    };
    fetchMessages();
  }, [currentUserId, friendId]);

  const filteredUsers = users
    .filter(
      (user) =>
        user.email !== loggedInUser?.email &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex space-x-0 h-screen overflow-clip w-full">
      <Toaster position="top-left"></Toaster>
      <div className="flex-[1.5] p-5 px-2 bg-crop">
        <div className="logo flex items-center space-x-5 my-10 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <div>
          <p className="font-light my-5 text-white">
            Good {greeting} {loggedInUser?.name}
          </p>
          {/* <p className="text-lg font-light text-white">Chat with Fellow Farmer</p> */}

          <div className="flex bg-white rounded-md outline-none border-none p-2 space-x-2 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="font-thin outline-none w-[80%]"
              placeholder="Search a farmer to chat with"
            />
            <IoIosSearch></IoIosSearch>
          </div>
        </div>
        <p className="p-2 pb-3 text-lg text-gray border-b">Online Members</p>
        <div className="flex flex-col space-y-0 pr-2 overflow-scroll overflow-x-hidden h-96">
          {isLoading && <Spinner text="Fetching users"></Spinner>}
          {filteredUsers.map((eachUser) => (
            <div
              onClick={() => setFriendId(eachUser?.id)}
              className="hover:bg-gray relative border-b text-white flex space-x-3 w-full p-2 py-3 rounded-md hover:border-none cursor-pointer hover:text-crop"
              key={eachUser.id}
            >
              <img
                src={"farmer2.jpg"}
                className="size-10 rounded-full object-cover"
                alt=""
              />
              {isUserOnline(eachUser.id) && (
                <div className="absolute top-2 left-1 w-3 h-3 bg-blue-600 rounded-full"></div>
              )}
              {!isUserOnline(eachUser.id) && (
                <div className="absolute top-2 left-1 w-3 h-3 bg-gray rounded-full"></div>
              )}

              <div>
                <div>{eachUser.name}</div>
                <div>{eachUser.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[5.5] bg-gray p-3 h-screen overflow-clip relative">
        <div className="mainPhoto relative w-full rounded-md flex justify-center items-center h-32">
          <img
            src="/farm.jpg"
            className="border-[5px] absolute -bottom-10 border-gray size-28 rounded-full object-cover"
            alt=""
          />
        </div>
        {userSelected ? (
          <p>Chatting with {userSelected.name}</p>
        ) : (
          <p>Select a friend to start chatting.</p>
        )}

        <div
          ref={messagesEndRef}
          className="messages-container mt-4 p-3 h-[65%] overflow-scroll overflow-x-hidden"
        >
          {messages.map((eachMessage, index) => (
            <div
              key={index}
              className={`my-5 flex w-full ${
                eachMessage.senderId === currentUserId ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`message-item bg-blue-500 flex flex-col relative h-fit w-[400px] space-y-7 text-white p-2 rounded-md mb-2 ${
                  eachMessage.senderId === currentUserId ? "mr-auto" : "ml-auto"
                } ${
                  eachMessage.senderId === currentUserId
                    ? "bg-blue-500"
                    : "bg-slate-500"
                } ${
                  eachMessage.senderId === currentUserId
                    ? "text-white"
                    : "text-black"
                }`}
              >
                <p>
                  {eachMessage.senderId === currentUserId ? (
                    <span className="text-xs absolute right-2 top-1">You</span>
                  ) : (
                    ""
                  )}
                </p>

                <p className="text-xs absolute right-2 -top-5">
                  {eachMessage.senderId !== currentUserId &&
                    eachMessage.senderName}
                </p>

                <p className="text-lg font-light my-2 mt-5">
                  {eachMessage.content}
                </p>
                <p className="text-xs w-full text-right">
                  {formatDistanceToNow(new Date(eachMessage.timestamp))} ago
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex absolute bottom-3 w-full space-x-2 items-center">
          <textarea
            className="outline-none border-none p-2 text-black w-[80%]  font-thin"
            name="newMessage"
            id=""
            spellCheck="true"
            value={newMessage}
            autoFocus
            onChange={(e) => setNewMessage(e.target.value)}
            rows={2}
            cols={50}
            placeholder="Start Typing"
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-crop p-3 hover:bg-white hover:text-crop hover:shadow-xl px-20 hover:rounded-full text-gray font-thin"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
