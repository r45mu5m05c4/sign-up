import "./App.css";
import { UserProvider } from "./contexts/UserContext";
import Main from "./components/Main";

function App() {
  return (
    <>
      <UserProvider>
        <Main />
      </UserProvider>
    </>
  );
}

export default App;
