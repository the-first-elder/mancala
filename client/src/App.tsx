import CartridgeConnector from "@cartridge/connector";
import { ControllerOptions } from "@cartridge/controller";
import { Chain, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { Provider as JotaiProvider } from "jotai";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Gameplay from "./pages/games/Gameplay";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Lobby from "./pages/Lobby";

const CONTRACT_ADDRESS =
  "0x4c4869d1067625074edd5f2c68774831ee26261423b8a17fc71f533e7b03f5c";

const policies = [
  {
    target: CONTRACT_ADDRESS,
    method: "create_initial_game_id",
  },
  {
    target: CONTRACT_ADDRESS,
    method: "create_game",
  },
  {
    target: CONTRACT_ADDRESS,
    method: "create_private_game",
  },
  {
    target: CONTRACT_ADDRESS,
    method: "join_game",
  },
  {
    target: CONTRACT_ADDRESS,
    method: "move",
  },
  {
    target: CONTRACT_ADDRESS,
    method: "time_out",
  },
];

const options: ControllerOptions = {
  rpc: "https://api.cartridge.gg/x/mancala-alpha-v3/katana",
  theme: "realm-of-ra",
};

function rpc(_chain: Chain) {
  return {
    nodeUrl: "https://api.cartridge.gg/x/mancala-alpha-v3/katana",
  };
}

const SmallScreenWarning = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center text-white bg-black bg-opacity-75 backdrop-blur-sm">
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">
        This game is not optimized for this device screen!
      </h1>
    </div>
  </div>
);

export default function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const connectors = [
    new CartridgeConnector(policies, options) as never as Connector,
  ];

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={connectors}
    >
      <JotaiProvider>
        <Router>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games/:gameId" element={<Gameplay />} />
          </Routes>
        </Router>
      </JotaiProvider>
      {isSmallScreen && <SmallScreenWarning />}
    </StarknetConfig>
  );
}
