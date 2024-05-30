// src/components/App.tsx
import * as React from "react";
function App(props) {
  const [count, setCount] = React.useState(0);
  return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setCount((count2) => count2 + 1) }, "Counter ", count);
}
export default App
