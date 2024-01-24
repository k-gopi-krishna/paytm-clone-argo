import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useRecoilState, useSetRecoilState } from "recoil";
import { balanceAtom, modalAtom } from "../atoms";
import useLoggedUser from "../hooks/userLoggedUser";
import DropDown from "./DropDown";
import Modal from "./Modal";
const Dashboard = () => {
  const setmodal = useSetRecoilState(modalAtom);
  const [users, setUsers] = useState();
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const { user, isLoading } = useLoggedUser(localStorage.getItem("token"));
  const [balance, setBalance] = useRecoilState(balanceAtom);
  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://paytm-clone-backend.vercel.app/api/v1/user/bulk?filter=${inp}`
        );
        setUsers(res.data.users);
        const bal = await axios.get(
          "https://paytm-clone-backend.vercel.app/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBalance(bal.data.balance);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [inp]);
  return (
    <div className="h-[100vh] bg-white text-black">
      <header className="flex items-center justify-between border-b-[1px] border-slate p-5">
        <h1 className="font-bold text-2xl">Payments App</h1>
        <div className="flex gap-3 items-center ">
          <p className="font-semibold">
            Hello, {!isLoading && user?.firstname}
          </p>
          <div className="relative">
            <span
              className="bg-slate-100 h-12 w-12 flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => setShowDropDown((s) => (s ? false : true))}
            >
              {!isLoading && user?.firstname[0].toUpperCase()}
            </span>
            <DropDown showDropDown={showDropDown} />
          </div>
        </div>
      </header>
      <div className="p-5">
        <p className="mb-5 font-bold text-xl">
          Your Balance{" "}
          <span className="pl-3">
            {!loading ? `$ ${balance?.toFixed(2)}` : "Loading"}
          </span>
        </p>
        <h1 className="font-bold text-xl mb-3">Users</h1>
        <input
          className="bg-white border-slate-300 border-[1px] rounded-md px-3 py-2 w-full"
          placeholder="Search users..."
          value={inp}
          onChange={(e) => setInp(e.target.value)}
        />
      </div>
      {!loading ? (
        users
          ?.filter((u) => user._id !== u._id)
          .map((user) => (
            <>
              <div
                className="flex items-center justify-between p-5"
                key={user._id}
              >
                <div className="flex items-center gap-5">
                  <span className="bg-slate-100 px-4 py-2 rounded-full">
                    {user.firstname.split("")[0].toUpperCase()}
                  </span>
                  <p className="font-bold text-lg ">
                    {user.firstname + " " + user.lastname}
                  </p>
                </div>
                <button
                  className="text-center  bg-black text-white px-3 py-2 text-sm font-semibold rounded-md"
                  onClick={() =>
                    setmodal({
                      isOpen: true,
                      user,
                    })
                  }
                >
                  Send Money
                </button>
              </div>
            </>
          ))
      ) : (
        <ScaleLoader color="black" className="text-center mt-5" />
      )}
      <Modal />
    </div>
  );
};

export default Dashboard;
