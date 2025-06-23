import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies, ControllerOptions, } from "@cartridge/controller";
import { constants } from "starknet";

const CONTRACT_ADDRESS_GAME = '0x70061966613c3788149d4bed8c391403ee19bc23f02d9ff6a056cfb646820e2'

const policies: SessionPolicies = {
  contracts: {
    [CONTRACT_ADDRESS_GAME]: {
      methods: [
        {
          name: "add_initial_food",
          entrypoint: "add_initial_food" // create player
        },
        {
          name: "add_initial_food",
          entrypoint: "add_initial_food" // update player score
        },
      ],
    },
  },
}

// Controller basic configuration
const namespace = "tamagotchi"; //ensure this is correct

const options: ControllerOptions = {
  // @ts-ignore
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  policies,
  preset: "bytebeasts-tamagotchi",
  namespace: "tamagotchi", 
  slot: "bbv2"
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;
