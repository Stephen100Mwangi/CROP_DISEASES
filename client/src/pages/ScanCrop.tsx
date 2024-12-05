// import { useState } from "react";
// import { Link } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";
// import Spinner from "../components/Spinner";

// const ScanCrop = () => {
//   const [predictionAccuracy, setPredictionAccuracy] = useState<string>("");
//   const [diseaseDetected, setDiseaseDetected] = useState<string>("");
//   const [cropSelected, setCropSelected] = useState<string>("");
//   const [showResults, setShowResults] = useState(false);
//   const [file, setFile] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [url, setURL] = useState("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!file) {
//       toast.error("Please provide an image");
//       return;
//     }

//     const fileURL = URL.createObjectURL(file);
//     setURL(fileURL);
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/predict/${cropSelected.toLowerCase()}`,
//         formData
//       );
//       if (response.status === 200) {
//         console.log("Prediction successful:", response.data);
//         setShowResults(true);

//         // Perform actions with the response data

//         setPredictionAccuracy(response.data.confidence.toString());
//         setDiseaseDetected(response.data.class);
//       } else {
//         console.log("Unexpected status code:", response.status);
//       }
//     } catch (error) {
//       toast.error("Error scanning crop");
//       console.error("Error scanning crop", error);
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray w-full h-screen flex space-x-0">
//       <div className="options w-[20%] bg-crop flex flex-col space-y-10 p-5">
//         <Toaster position="top-left"></Toaster>
//         <div className="logo flex items-center space-x-2 font-light font-roboto">
//           <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
//             <img src="/crop.svg" className="size-12" alt="" />
//           </div>
//           <p className="text-lg">
//             Crop<span className="text-gray font-lato font-bold">Guard</span>
//           </p>
//         </div>

//         <p className="font-montserrat text-lg text-white">
//           Select a crop to scan
//         </p>
//         <div className="flex flex-col space-y-3">
//           <div className="flex items-center space-x-5 text-white">
//             <input
//               type="radio"
//               name="crop"
//               id=""
//               checked={cropSelected === "Rice"}
//               onChange={() => setCropSelected("Rice")}
//             />
//             <p>Rice</p>
//           </div>
//           <div className="flex items-center space-x-5 text-white">
//             <input
//               type="radio"
//               name="crop"
//               id=""
//               checked={cropSelected === "Apple"}
//               onChange={() => setCropSelected("Apple")}
//             />
//             <p>Apple</p>
//           </div>
//         </div>
//       </div>
//       <div className="display w-[80%] relative p-8">
//         {showResults && (
//           <div className="absolute top-10 right-10 rounded-md bg-crop text-white p-3 space-y-5 flex flex-col">
//             <div className="flex space-x-5">
//               <p className="font-medium font-montserrat text-base">
//                 Crop Detected
//               </p>
//               <p className="font-thin text-black text-base">{cropSelected}</p>
//             </div>
//             <div className="flex space-x-5">
//               <p className="font-medium font-montserrat text-base">
//                 Disease Detected
//               </p>
//               <p className="font-thin text-black text-base">
//                 {diseaseDetected}
//               </p>
//             </div>
//             <div className="flex space-x-5">
//               <p className="font-medium font-montserrat text-base">
//                 Prediction accuracy
//               </p>
//               <p className="font-thin text-black text-base">
//                 {predictionAccuracy}
//               </p>
//             </div>

//             <Link
//               to={"/diseases"}
//               className="bg-gray text-crop text-center p-2 px-6 hover:rounded-full transition-all rounded-md"
//             >
//               View Remedies
//             </Link>
//           </div>
//         )}

//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         <button
//           onClick={handleSubmit}
//           disabled={!file}
//           className={`bg-crop text-gray p-2 px-6 hover:rounded-full ${
//             !file ? "cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? (
//             <Spinner text={"Scanning crop ... Please wait"}></Spinner>
//           ) : (
//             "Scan Crop"
//           )}
//         </button>

//         <img src={url} alt="" className="w-64 h-48 rounded-md object-cover" />
//       </div>
//     </div>
//   );
// };

// export default ScanCrop;

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Spinner from "../components/Spinner";

const ScanCrop = () => {
  const [predictionAccuracy, setPredictionAccuracy] = useState<string>("");
  const [diseaseDetected, setDiseaseDetected] = useState<string>("");
  const [cropSelected, setCropSelected] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setURL] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Clear previous state
      if (url) {
        URL.revokeObjectURL(url);
      }

      const fileURL = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setURL(fileURL);
      setShowResults(false); // Reset results when new file is selected
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!file) {
      toast.error("Please provide an image");
      return;
    }

    if (!cropSelected) {
      toast.error("Please select a crop type");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/predict/${cropSelected.toLowerCase()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Prediction successful:", response.data);
        setShowResults(true);

        // Format confidence as percentage
        setPredictionAccuracy(
          `${(response.data.confidence * 100).toFixed(2)}%`
        );
        setDiseaseDetected(response.data.class);
      } else {
        toast.error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || "Error scanning crop";
        toast.error(errorMsg);
        console.error("Crop scan error:", error);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup URL when component unmounts
  const handleClearImage = () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
    setFile(null);
    setURL("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gray w-full h-screen flex space-x-0">
      <div className="options w-[20%] bg-crop flex flex-col space-y-10 p-5">
        <Toaster position="top-left" />
        <div className="logo flex items-center space-x-2 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="CropGuard Logo" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>

        <p className="font-montserrat text-lg text-white">
          Select a crop to scan
        </p>
        <div className="flex flex-col space-y-3">
          {["Rice", "Apple"].map((crop) => (
            <div key={crop} className="flex items-center space-x-5 text-white">
              <input
                type="radio"
                name="crop"
                checked={cropSelected === crop}
                onChange={() => setCropSelected(crop)}
              />
              <p>{crop}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="display w-[80%] relative p-8">
        {showResults && (
          <div className="absolute top-10 right-10 rounded-md bg-crop text-white p-3 space-y-5 flex flex-col">
            {[
              { label: "Crop Detected", value: cropSelected },
              { label: "Disease Detected", value: diseaseDetected },
              { label: "Prediction Accuracy", value: predictionAccuracy },
            ].map(({ label, value }) => (
              <div key={label} className="flex space-x-5">
                <p className="font-medium font-montserrat text-base">{label}</p>
                <p className="font-thin text-black text-base">{value}</p>
              </div>
            ))}

            <Link
              to={"/diseases"}
              className="bg-gray text-crop text-center p-2 px-6 hover:rounded-full transition-all rounded-md"
            >
              View Remedies
            </Link>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          {url && (
            <div className="relative w-64 h-48">
              <img
                src={url}
                alt="Selected"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || !cropSelected || loading}
            className={`bg-crop text-gray p-2 px-6 hover:rounded-full transition-all 
              ${
                !file || !cropSelected || loading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
          >
            {loading ? (
              <Spinner text={"Scanning crop ... Please wait"} />
            ) : (
              "Scan Crop"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanCrop;
