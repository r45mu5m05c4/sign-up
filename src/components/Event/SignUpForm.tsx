import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface SignUpProps {
  showSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const supabase = createClient(
  "https://<your-supabase-project-url>",
  "<your-supabase-public-api-key>"
);

const SignUpForm = ({ showSignUpModal }: SignUpProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await supabase.functions.invoke("initiate_payment", {
      body: JSON.stringify({ name, email }),
    });

    const data = response.data;
    window.location.href = data.paymentUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit">Sign Up and Pay</button>
    </form>
  );
};

export default SignUpForm;
