import { useState } from "react";
import toast, {Toaster} from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

 interface user_data{
    name: string,
    role: string,
    email: string,
    location:string
  }

const LoginUser = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);


  const loginUser = async (e:React.FormEvent) => {

    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required")
      return;
    }


    try{
      setLoading(true);
      const response = await fetch("http://localhost:5650/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      })

      const data = await response.json();
      if(!response.ok){
        toast.error(data.message || "Error creating new user");
        return;
      }

      console.log(data);

      const userData:user_data = {
        name: data.userExists.name,
        role: data.userExists.role,
        email: data.userExists.email,
        location: data.userExists.location
      }
      
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("User login successful");
      setTimeout(() => {
        navigate('/home')
      }, 2000);

    }catch(error){
      toast.error("Internal server error")
      return;
    }finally{
      setLoading(false)
    }
    
  }
  return (
    <div className="h-screen w-full bg-gray font-poppins flex justify-center items-center">
      <Toaster position="top-left"></Toaster>
      <form onSubmit={loginUser} className="shadow-xl rounded-md p-5 py-10 w-fit bg-white flex flex-col space-y-8 justify-center items-center">
        <p className="text-center font-bold text-xl">LogIn Here</p>
        <div className="flex flex-col space-y-3 w-72">
          <label htmlFor="Email" className="font-bold text-base text-crop">
            Email
          </label>
          <input
            type="email"
            placeholder="Input your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
          ></input>
        </div>
        <div className="flex flex-col space-y-3 w-72">
          <label htmlFor="Email" className="font-bold text-base text-crop">
            Password
          </label>
          <input
            type="password"
            placeholder="Input your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="p-2 focus:outline-crop font-thin focus:outline  text-black font-openSans w-[100%]"
          ></input>
        </div>
        <button disabled={loading} className="bg-crop text-gray p-2 w-full rounded-full px-12 hover:shadow-xl hover:bg-gray hover:text-crop">
          {loading ? <Spinner text={"Processing... Please wait"}></Spinner> : "Login"}
        </button>
        <div className="flex space-x-5">
          <p className="text-red-500">Do not have an account</p>
          <Link to="/register" className="text-black">
            Register Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginUser;
