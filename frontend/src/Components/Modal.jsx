import axios from "axios";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { balanceAtom, modalAtom } from "../atoms";
const Modal = () => {
  const [modal, setmodal] = useRecoilState(modalAtom);
  const [inp, setInp] = useState();
  const setBalance = useSetRecoilState(balanceAtom);
  async function sendMoney() {
    try {
      await axios.post(
        "https://paytm-clone-backend.vercel.app/api/v1/account/transfer",
        {
          amount: inp,
          to: modal.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBalance((balance) => balance - inp);
      toast.success(`${inp} Rupees sent successfully`);
      setInp(null);
    } catch (error) {
      toast.error("Some error occured");
    }
  }
  return (
    <>
      {modal.isOpen && (
        <div
          key={modal.user._id}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        >
          <div className="bg-white p-2 rounded relative w-[400px]">
            <p className="m-5 font-bold text-3xl flex flex-col items-center mb-16">
              Send Money
            </p>
            <div
              onClick={() => setmodal({ isOpen: false })}
              className="absolute top-2 right-3 cursor-pointer"
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
            <div className="m-5">
              <div className="flex gap-5 items-center">
                <span className="bg-green-400 px-4 py-3 rounded-full">
                  {modal.user.firstname[0].toUpperCase()}
                </span>
                <p className="font-semibold text-xl">
                  {modal.user.firstname + " " + modal.user.lastname}
                </p>
              </div>
              <span className="text-xs font-semibold">Amount (in Rs)</span>
              <div className="flex flex-col ">
                <input
                  placeholder="Enter amount"
                  className="px-3 py-2 bg-white border-[1px] border-slate-200 rounded-md"
                  onChange={(e) => setInp(e.target.value)}
                  type="number"
                  value={inp}
                />
                <button
                  className="bg-green-400 mt-3 py-2 rounded-md"
                  onClick={sendMoney}
                >
                  Initaite Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Modal);
