import "./App.css";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import axios from "axios";

const URL = "https://insta-clone-mkgwar.herokuapp.com";
//const URL = "http://localhost:5000";
const App = () => {
  const [showError, setshowError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [showLoading, setshowLoading] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [imgLink, setimgLink] = useState("");

  const onDrop = async (file) => {
    if (file.length > 1) {
      setshowError(true);
      seterrorMessage("Can only upload a single image.");
    } else if (
      file[0].type !== "image/jpeg" &&
      file[0].type !== "image/png" &&
      file[0].type !== "image/jpg"
    ) {
      setshowError(true);
      seterrorMessage("File is not jpeg/png.");
    } else {
      setshowError(false);
      seterrorMessage("");
      setshowLoading(true);
      const formdata = new FormData();
      formdata.append("upload", file[0]);
      const { data } = await axios.post(`${URL}/image-upload`, formdata);
      if (data.status === "OK") {
        setshowLoading(false);
        setshowSuccess(true);
        setimgLink(data.link);
      }
    }
  };

  const onManualSelect = async (event) => {
    if (event.target.files.length > 0) {
      setshowError(false);
      seterrorMessage("");
      setshowLoading(true);
      const formdata = new FormData();
      formdata.append("upload", event.target.files[0]);
      const { data } = await axios.post(`${URL}/image-upload`, formdata);
      if (data.status === "OK") {
        setshowLoading(false);
        setshowSuccess(true);
        setimgLink(data.link);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      {!showLoading && !showSuccess && (
        <div className="main-screen bg-white w-[402px] gap-4 h-[469px] p-8 flex items-center justify-between flex-col shadow-lg rounded-[12px]">
          <h1 className="text-[#4F4F4F] text-2xl font-bold">
            Upload your image
          </h1>
          <h2 className="text-[#828282] text-sm font-bold">
            Files should be Jpeg, Png...
          </h2>
          <div
            className="border-[1px] border-[#97BEF4] border-dashed bg-[#F6F8FB] w-full h-full rounded-[12px] flex flex-col items-center justify-center gap-8"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <img src="/Images/image.svg" alt="" />
            <h2 className="text-[#BDBDBD] text-md">
              Drag & Drop your image here
            </h2>
          </div>
          {showError && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
          <h2 className="text-[#BDBDBD] font-bold text-sm">Or</h2>
          <input
            type="file"
            id="pic"
            name="pic"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={onManualSelect}
          />
          <label
            htmlFor="pic"
            className="bg-[#2F80ED] cursor-pointer text-white py-2 px-4 rounded-[8px]"
          >
            Choose a file
          </label>
        </div>
      )}
      {showLoading && !showSuccess && (
        <div className="h-[145px] w-[400px] bg-white flex flex-col justify-center gap-8 shadow-lg rounded-[12px]">
          <h1 className="text-xl text-[#4F4F4F] font-bold w-[340px] mx-auto">
            Uploading...
          </h1>
          <div className="bg-[#F2F2F2] h-2 w-[340px] mx-auto rounded-[8px]">
            <div className="loading-bar h-full bg-[#2F80ED] w-[100px] rounded-[8px]" />
          </div>
        </div>
      )}

      {!showLoading && showSuccess && (
        <div className="main-screen bg-white w-[402px] gap-4 h-[500px] p-8 flex items-center justify-between flex-col shadow-lg rounded-[12px]">
          <div>
            <div className="bg-[#219653] text-white rounded-full h-8 w-8 flex justify-center items-center">
              <span className="material-icons">done</span>
            </div>
          </div>

          <h1 className="text-[#4F4F4F] text-xl font-bold">
            Uploaded Successfully!
          </h1>

          <div className="relative h-full w-full rounded-[12px]">
            <img
              src={imgLink}
              alt=""
              className="absolute h-full w-full rounded-[12px] "
            />
          </div>

          <div className="border-[1px] border-[#E0E0E0] w-full h-[34px] bg-[#F6F8FB] rounded-[8px] flex items-center">
            <h1 className="text-[#4F4F4F] text-sm w-4/5 whitespace-nowrap overflow-hidden text-ellipsis px-2 mx-auto">
              {imgLink}
            </h1>
            <button
              className="bg-[#2F80ED] h-[30px] w-[70px] text-xs text-white rounded-[8px] cursor-pointer"
              onClick={() => navigator.clipboard.writeText(imgLink)}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
