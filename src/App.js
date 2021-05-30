import { useState } from "react";
import { ethers } from "ethers";

import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

import "./App.css";

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greetingValue, setGreetingValue] = useState("");

  const requestAccount = async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log({ data });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greetingValue) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greetingValue);
      await transaction.wait();
      setGreetingValue("");
      fetchGreeting();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          placeholder="setGreeting"
          value={greetingValue}
          onChange={(e) => {
            setGreetingValue(e.target.value);
          }}
        />
      </header>
    </div>
  );
}

export default App;
