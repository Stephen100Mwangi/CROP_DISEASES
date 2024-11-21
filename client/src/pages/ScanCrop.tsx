import { FormEvent, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";

const ScanCrop = () => {
  const cropRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // When we fetch files we want to get only the first image file.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Error creating new user');
        return;
      } else {
        toast.success("Crop scanned successfully");
        console.log("Prediction", data);
      }
    } catch (error) {
      console.log("Error:",error);
      toast.error("Internal server error");
      return;
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="bg-gray font-openSans text-crop w-full h-screen flex justify-center items-center flex-col space-y-5">
      <Toaster position={"top-left"}></Toaster>
      <p className="font-medium text-xl">
        Keep track of the Health of Your Crops
      </p>

      <div className="flex items-center space-x-1">
        <div className="w-96 h-fit rounded-md overflow-clip flex flex-col space-y-3">
          <button className="bg-crop px-12 w-[100%] text-gray rounded p-3 hover:bg-crop hover:bg-opacity-70">
            Capture image using camera
          </button>
          <img
            src="/camera.jpg"
            className="w-96 h-48 rounded-md overflow-clip object-cover"
            alt="Camera preview"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 items-center justify-center"
        >
          
          <div className="border border-opacity-20 rounded-md w-96 p-3 border-black flex justify-center items-center flex-col space-y-5">
            <p className="text-black font-lato font-light text-lg">
              Upload an image to get started
            </p>
            <input
              accept="image/*"
              onChange={handleFileChange}
              type="file"
              ref={cropRef}
            />
            <p>OR</p>
            <p className="font-thin text-black">Drag and Drop File here</p>
            <button
              disabled={!file || loading}
              type="submit"
              className={`bg-crop px-12 w-full text-gray rounded-full p-3 ${loading ? "opacity-50 cursor-not-allowed":""}`}
            >
              {loading ? <Spinner text="Scanning Crop"></Spinner> : "Scan Crop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScanCrop;
