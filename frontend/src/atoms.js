import { atom } from "recoil";

export const userAtom = atom({
  key: "User",
  default: null,
});

export const modalAtom = atom({
  key: "Modal",
  default: {
    user: null,
    isOpen: false,
  },
});

export const balanceAtom = atom({
  key: "Balance",
  default: 0,
});
