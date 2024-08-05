import React, { useState } from "react";
import supabase from "../../supabase/server";
import { useUser } from "../../contexts/UserContext";

interface SignUpProps {
  showSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({ showSignUpModal }: SignUpProps) => {
  const [position, setPosition] = useState("");
  const [team, setTeam] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const name = user?.name;
    const email = user?.email;
    const response = await supabase.functions.invoke("initiate_payment", {
      body: JSON.stringify({ name, email }),
    });

    const data = response.data;
    window.location.href = data.paymentUrl;
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
