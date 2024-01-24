import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import { userAtom } from "../atoms";
import EditInfo from "./EditInfo";
const DropDown = ({ showDropDown }) => {
  const setuser = useResetRecoilState(userAtom);
  const navigate = useNavigate();
  async function handleLogout() {
    console.log("clicked");
    localStorage.removeItem("token");
    setuser(null);
    navigate("/signin");
  }
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showDropDown && (
        <div className="absolute right-1 mt-2 bg-slate-200 w-[150px] rounded-md">
          <p
            className="border-b-white border-b-[1px] px-3 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Update profile
          </p>
          <div className="px-3 py-2 cursor-pointer" onClick={handleLogout}>
            Logout
          </div>
          {showModal && <EditInfo setShowModal={setShowModal} />}
        </div>
      )}
    </>
  );
};

export default memo(DropDown);
