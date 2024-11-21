import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const HeroPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login')
  }
  return (
    <div className="bg-crop flex w-full h-screen overflow-clip p-10">
      <div className="w-[50%] flex-1 flex flex-col pt-10 space-y-10">
        <div className="logo flex items-center space-x-2 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <p className="text-gray font-bold text-5xl">
          Healthy Crops, Happy Harvests
        </p>
        <p className="text-gray text-xl font-lato font-light leading-8">
          Take the guesswork out of farming! With{" "}
          <span className="font-montserrat font-medium">CropGuard</span>, you
          can detect and prevent crop diseases before they spread. Our powerful
          AI-driven tool keeps you a step ahead, ensuring your fields stay
          vibrant and productive. Protect your investment and maximize your
          yield effortlessly.
        </p>
        <div className="pt-24">
          <Button
            text="See How It Works"
            color="crop"
            textColor="gray"
            clickFunction={goToLogin}
          ></Button>
        </div>
      </div>
      <div className="w-[50%] flex-1 justify-center items-center flex">
        <img
          src="/detectMini.png"
          className="h-[100%] scale-105 w-auto"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroPage;
