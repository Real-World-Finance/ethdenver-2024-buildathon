import { Investment } from "../components/InvestmentCard";

const mockUrl = "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg";
const mockDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const mockInvestment: Investment = {
  name: "Fund 1",
  description: mockDescription,
  imageUrl: mockUrl,
  price: 100,
  id: "1",
};
export const mockInvestments: Investment[] = [
  mockInvestment,
  {
    name: "Fund 2",
    description: mockDescription,
    imageUrl: mockUrl,
    price: 100,
    id: "2",
  },
  {
    name: "Fund 3",
    description: mockDescription,
    imageUrl: mockUrl,
    price: 100,
    id: "3",
  },
  {
    name: "Fund 4",
    description: mockDescription,
    imageUrl: mockUrl,
    price: 100,
    id: "4",
  },
  {
    name: "Fund 5",
    description: mockDescription,
    imageUrl: mockUrl,
    price: 100,
    id: "5",
  },
  {
    name: "Fund 6",
    description: mockDescription,
    imageUrl: mockUrl,
    price: 100,
    id: "6",
  },
];
