import { Link } from "react-router-dom";

const Lost = () => {
  return (
    <div className="bg-gray w-full h-screen flex flex-col space-y-10 items-center justify-center">
      <p>Oops you are lost</p>
      <img src="/lost.svg" className="size-56" alt="" />
      <Link
        to={"/home"}
        className="bg-crop text-gray font-light p-3 rounded-full px-8"
      >
        Find your way back
      </Link>
    </div>
  );
};

export default Lost;
