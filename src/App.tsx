import { useEffect, useState } from "react";
import "./App.css";
import { UserProvider, useUser } from "./contexts/UserContext";
import { LoginModal } from "./components/Login/LoginModal";
import Main from "./components/Main";
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    user && user.providerType === "anon-user"
      ? setShowLoginModal(true)
      : setShowLoginModal(false);
  }, [user]);
  return (
    <>
      <UserProvider>
        {showLoginModal && <LoginModal showLoginModal={setShowLoginModal} />}
        <Main />
      </UserProvider>
    </>
  );
}

export default App;
