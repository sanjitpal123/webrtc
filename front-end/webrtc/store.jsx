import { createContext } from "react";

export const MyContext = createContext("defaultValue");

function Store({ children }) {
  return (
    <MyContext.Provider value="Hello from Context">
      {children}
    </MyContext.Provider>
  );
}

export default Store;
