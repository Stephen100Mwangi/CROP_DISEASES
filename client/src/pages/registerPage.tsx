import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState("Farmer");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role || !location) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords MUST match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5650/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role, password, location }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Error registering user");
        return;
      }

      toast.success("User created successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Internal server error");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-clip w-full bg-gray max-md:max-h-fit max-sm:justify-center max-sm:items-center max-sm:pt-2">
      <Toaster position="top-left"></Toaster>
      <form
        onSubmit={registerUser}
        className="shadow-xl rounded-md p-5 py-10 w-fit bg-white flex flex-col space-y-8 justify-center items-center max-sm:w-[340px] max-sm:h-fit max-sm:space-y-4 max-sm:py-2"
      >
        <p className="text-center font-bold text-xl">Create an Account</p>
        <div className="flex space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-10 max-sm:space-y-3">
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label htmlFor="Username" className="font-bold text-base text-crop">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. John Doe"
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label htmlFor="Email" className="font-bold text-base text-crop">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Input your email"
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
        </div>

        <div className="flex space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-10 max-sm:space-y-3">
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label htmlFor="Password" className="font-bold text-base text-crop">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Input your password"
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label
              htmlFor="Confirm Password"
              className="font-bold text-base text-crop"
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
        </div>

        <div className="flex space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-10 max-sm:space-y-3">
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label htmlFor="Role" className="font-bold text-base text-crop">
              Role
            </label>
            <input
              type="text"
              placeholder="Role"
              readOnly
              aria-readonly
              value={role}
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
          <div className="flex flex-col space-y-3 w-96 max-sm:w-80 max-sm:mx-auto max-sm:space-y-2">
            <label htmlFor="Location" className="font-bold text-base text-crop">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex. Nairobi Kenya"
              className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
            ></input>
          </div>
        </div>

        <button
          disabled={loading}
          className="bg-crop text-gray p-2 w-full rounded-full px-12 hover:shadow-xl hover:bg-gray hover:text-crop max-md:mx-auto max-md:w-[300px]"
        >
          {loading ? (
            <Spinner text="Processing...Please wait"></Spinner>
          ) : (
            "Register"
          )}
        </button>
        <div className="flex space-x-5 p-2">
          <p className="text-crop">Already Have an account</p>
          <Link to="/login" className="text-black">
            Login Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
