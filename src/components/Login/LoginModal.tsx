import styled from "styled-components";
import { useState } from "react";
import supabase from "../../supabase/server";
import { useUser } from "../../contexts/UserContext";

export const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false); // New state to toggle between login and register
  const { user, setUser, logout } = useUser();

  const handleAuth = async () => {
    if (!isRegistering && (email === "" || password === "")) {
      setError("Please fill in your credentials");
      return;
    }
    if (isRegistering && (name === "" || email === "" || password === "")) {
      setError("Please fill in your credentials");
      return;
    }
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        else if (data.user) {
          const userId = data.user.id;
          const { error: userError } = await supabase
            .from("user")
            .insert({
              id: userId,
              email,
              name: "",
              premium: false,
              admin: false,
              phoneNumber: parseInt(phoneNumber),
            })
            .single();

          if (userError) throw userError;
          const newlyRegisteredUser = {
            id: data.user.id,
            email: email,
            name: "",
            premium: false,
            admin: false,
            phoneNumber: parseInt(phoneNumber),
          };
          setUser(newlyRegisteredUser);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userId = data.user.id;
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        setUser(userData);
      }

      setError(null);
    } catch (err) {
      setError("Could not authenticate, please try again.");
    }
  };

  const handleLogout = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    setUser(null);
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    const numericValue = value.replace(/\D/g, "");
    setPhoneNumber(numericValue);
  };
  return (
    <>
      {user ? (
        <Button onClick={handleLogout}>Log out</Button>
      ) : (
        <>
          <Modal onClick={(e) => e.stopPropagation()}>
            <Container>
              <Header>{isRegistering ? "Register" : "Log in"}</Header>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-mail"
              />
              {isRegistering && (
                <>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="First and last name"
                  />
                  <Input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                    placeholder="Phone number"
                    pattern="\d*"
                  />
                  <p>
                    With country code without special characters and initial
                    zero(s). e.g. 46703123123
                  </p>
                </>
              )}
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div style={{ display: "flex" }}>
                <SubmitButton type="button" onClick={handleAuth}>
                  {isRegistering ? "Register" : "Log in"}
                </SubmitButton>
                <Button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Switch to Log in" : "Switch to Register"}
                </Button>
              </div>
            </Container>
          </Modal>
        </>
      )}
    </>
  );
};

const Button = styled.button`
  margin: 14px;
  color: #15ba83;
`;
const SubmitButton = styled.button`
  margin: 14px;
  background-color: #15ba83;
  color: #fff;
`;
const Container = styled.div`
  margin: auto;
  height: 70%;
  display: flex;
  flex-direction: column;
`;

const Modal = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  top: 12.5%;
  left: 12.5%;
  height: 75%;
  width: 75%;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
  background-color: #03161b;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    top: 0;
    left: -5%;
  }
`;
const Header = styled.h2`
  color: #15ba83;
`;
const Input = styled.input`
  height: 10%;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
`;
