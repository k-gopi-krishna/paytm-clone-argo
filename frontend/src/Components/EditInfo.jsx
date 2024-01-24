import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms";
const EditInfo = ({ setShowModal }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [info, setinfo] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    password: user.password,
  });
  const handleInfoChange = (e) => {
    setinfo({ ...info, [e.target.name]: e.target.value });
  };
  const handleEditInfo = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/v1/user/update",
        {
          firstname: info.firstname,
          lastname: info.lastname,
          password: info.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser((user) => {
        return {
          ...user,
          firstname: info.firstname || user.firstname,
          lastname: info.lastname || user.lastname,
          password: info.password || user.password,
        };
      });
      setShowModal(false);
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Some error occured");
    }
  };
  return (
    <div className="inset-0 fixed bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5 bg-white p-10 rounded-md relative">
        <h1 className="font-semibold text-3xl">Edit Info</h1>
        <div
          className="absolute top-2 right-3 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <svg
            viewBox="0 0 840 1000"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path d="M420 80c116 0 215 41 297 123s123 181 123 297-41 215-123 297-181 123-297 123-215-41-297-123S0 616 0 500s41-215 123-297S304 80 420 80m86 420l154-154-86-86-154 152-152-152-88 86 154 154-154 152 88 86 152-152 154 152 86-86-154-152" />
          </svg>
        </div>
        <div className="flex gap-3 items-center">
          <p className="font-semibold text-lg">Firstname</p>
          <input
            placeholder="firstname"
            name="firstname"
            className="px-3 py-2 bg-white border-[1px] border-slate-200 rounded-md"
            onChange={handleInfoChange}
            value={info.firstname}
          />
        </div>
        <div className="flex gap-3 items-center">
          <p className="font-semibold text-lg">Lastname</p>
          <input
            placeholder="lastname"
            name="lastname"
            className="px-3 py-2 bg-white border-[1px] border-slate-200 rounded-md"
            onChange={handleInfoChange}
            value={info.lastname}
          />
        </div>
        <div className="flex gap-3 items-center">
          <p className="font-semibold text-lg">Password</p>
          <input
            placeholder="password"
            name="password"
            className="px-3 py-2 bg-white border-[1px] border-slate-200 rounded-md"
            onChange={handleInfoChange}
            value={info.password}
          />
        </div>
        <button
          className="bg-black text-white w-full py-2 rounded-md"
          onClick={handleEditInfo}
        >
          Update Info
        </button>
      </div>
    </div>
  );
};

export default EditInfo;
