/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import { useDropzone } from "react-dropzone";

const ScanCrop = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      return;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".svg", ".svg+xml"],
    },
    maxSize: 5 * 1024 * 1024, // 5MBs
    maxFiles: 1,
  });

  // When we fetch files we want to get only the first image file.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleScanCrop = async () => {
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
        toast.error(data.message || "Error creating new user");
        return;
      } else {
        toast.success("Crop scanned successfully");
        console.log("Prediction", data);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Internal server error");
      return;
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray text-center mb-8">
          Crop Health Scanner
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div>
            <div className="p-6 text-gray">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8  
                  flex flex-col items-center justify-center
                  min-h-[200px] cursor-pointer
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }
                `}
              >
                <input onChange={handleFileChange} {...getInputProps()} />
                <div className="text-center">
                  {isDragActive ? (
                    <p className="text-blue-500">Drop your image here</p>
                  ) : (
                    <>
                      <p className="mb-2">Drag & drop an image here</p>
                      <p className="text-sm text-gray-500">
                        or click to select a file
                      </p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={toggleCamera}
                className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <Camera className="h-5 w-5" />
                {showCamera ? "Hide Camera" : "Use Camera Instead"}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="p-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Crop preview"
                    className="w-full h-full object-cover"
                  />
                ) : showCamera ? (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Camera component would go here */}
                    <p className="text-gray-500">Camera preview</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No image selected</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleScanCrop}
                disabled={!file || loading}
                className={`
                  mt-4 w-full p-3 rounded-lg 
                  bg-blue-600 text-white
                  hover:bg-blue-700 transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading ? "Scanning..." : "Scan Crop"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanCrop;
function useDropZone(arg0: {
  onDrop: (acceptedFiles: any) => void; accept: { "image/*": string[]; }; maxSize: number; // 5MBs
  maxFiles: number;
}): { getRootProps: any; getInputProps: any; isDragActive: any; } {
  throw new Error("Function not implemented.");
}

