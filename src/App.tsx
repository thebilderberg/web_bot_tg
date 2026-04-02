import React from "react";
import "./App.css";
import BurgerMenu from "./components/burger-menu/BurgerMenu";
import { AuthProvider } from "./auth/AuthProvider";
import { AuthStatus } from "./auth/AuthStatus";
import { NavigationProvider, useNavigation } from "./navigation/NavigationProvider";
import { AccountScreen } from "./screens/AccountScreen";

function AppBody() {
  const { route } = useNavigation();

  if (route === "account") {
    return <AccountScreen />;
  }

  return (
    <div className="App-content">
      <div className="App-title">Hello world</div>
      <p className="App-text">Это новый текстовый элемент</p>
      <p className="App-text">hello world69</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <NavigationProvider>
            <div className="TopBar">
              <div className="TopBarLeft">
                <BurgerMenu />
              </div>
              <div className="TopBarRight">
                <AuthStatus />
              </div>
            </div>

            <main className="App-main">
              <AppBody />
            </main>
          </NavigationProvider>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
