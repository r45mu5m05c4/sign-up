import styled from "styled-components";
import { useState } from "react";
import supabase from "../../supabase/server";
import { useUser } from "../../contexts/UserContext";

interface LoginProps {
  showLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginModal = ({ showLoginModal }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, logout } = useUser();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Please fill in your login credentials");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setUser(data.user);
      showLoginModal(false);
    } catch (err) {
      setError(`${err}` || "Could not log you in, please contact admin");
    }
  };

  const handleLogout = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    setUser(null);
  };

  return (
    <>
      <Overlay onClick={() => showLoginModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        {user && user.aud !== "anon" ? (
          <Button onClick={handleLogout}>Log out</Button>
        ) : (
          <>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-mail"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex" }}>
              <Button type="submit" onClick={handleLogin}>
                Log in
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  z-index: 50;
`;
const Button = styled.button``;
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
    margin-right: -200px;
    margin-left: auto;
    margin-top: 8px;
  }
`;

const Input = styled.input`
  margin: auto;
  margin-bottom: 6%;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
`;
