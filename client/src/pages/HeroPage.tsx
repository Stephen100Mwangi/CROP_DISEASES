import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const HeroPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="bg-crop flex w-full h-screen overflow-clip p-10 max-sm:flex-col max-sm:p-5 max-sm:py-2">
      <div className="w-[50%] flex-1 flex flex-col pt-10 space-y-10 max-sm:w-full">
        <div className="logo flex items-center space-x-2 font-light font-roboto">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>
        <p className="text-gray font-bold text-5xl max-sm:text-3xl">
          Healthy Crops, Happy Harvests
        </p>
        <p className="text-gray text-xl font-lato font-light leading-8 max-sm:text-lg max-sm:leading-9">
          Take the guesswork out of farming! With{" "}
          <span className="font-montserrat font-medium">CropGuard</span>, you
          can detect and prevent crop diseases before they spread. Our powerful
          AI-driven tool keeps you a step ahead, ensuring your fields stay
          vibrant and productive. Protect your investment and maximize your
          yield effortlessly.
        </p>
        <div className="pt-24 max-sm:pt-3 max-sm:mx-auto">
          <Button
            text="See How It Works"
            color="crop"
            textColor="gray"
            clickFunction={goToLogin}
          ></Button>
        </div>
      </div>
      <div className="w-[50%] flex-1 justify-center items-center flex max-sm:w-full">
        <img
          src="/detectMini.png"
          className="h-[100%] scale-105 w-auto max-sm:scale-100"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroPage;
