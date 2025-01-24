import { useNavigate } from "react-router-dom";

const Error = () => {
  const Navigate = useNavigate();

  function HandleNavigate() {
    Navigate("/");
  }
  return (
    <>
      <div className="pt-16 flex justify-center flex-col items-center space-y-4">
        <div>
          <h1>Error!</h1>
        </div>
        <div>
          <p>Try after some Time</p>
        </div>
        <div>
          <button
            className="border border-red-800 p-2 rounded-lg bg-black text-white hover:bg-orange-500"
            onClick={HandleNavigate}
          >
            Go To Home-Page
          </button>
        </div>
      </div>
    </>
  );
};

export default Error;
