import React, { useState } from "react";
import supabase from "../../supabase/server";
import { useUser } from "../../contexts/UserContext";

interface SignUpProps {
  showSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
  eventTitle: string;
  amount: number;
}

const SignUpForm = ({ showSignUpModal, eventTitle, amount }: SignUpProps) => {
  const [position, setPosition] = useState("");
  const [team, setTeam] = useState("");
  const { user } = useUser();
  console.log(supabase);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const phoneNumber = user?.phoneNumber;

    if (phoneNumber) {
      try {
        const response = await fetch(
          "https://zqnoqrullziicwrunhwx.supabase.co/functions/initiate_payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Phone-Number": phoneNumber.toString(),
              "X-Event-Title": eventTitle,
              "X-Amount": amount.toString(),
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.error || "Unknown error occurred");
          return;
        }

        const data = await response.json();

        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          console.error("Error: No payment URL returned.");
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
      }
    } else {
      console.error("Phone number is missing.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>{user?.name}</label>
      <label>{user?.email}</label>
      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      >
        <option key={1} value="LW">
          Left Wing
        </option>
        <option key={2} value="C">
          Center
        </option>
        <option key={3} value="RW">
          Right Wing
        </option>
        <option key={4} value="LD">
          Left Defender
        </option>
        <option key={5} value="RD">
          Right Defender
        </option>
        <option key={6} value="G">
          Goalie
        </option>
      </select>
      <select value={team} onChange={(e) => setTeam(e.target.value)} required>
        <option key={1} value="white">
          White
        </option>
        <option key={2} value="black">
          Black
        </option>
      </select>
      <button type="submit">Sign Up and Pay</button>
      <button onClick={() => showSignUpModal(false)}>Cancel</button>
    </form>
  );
};

export default SignUpForm;
