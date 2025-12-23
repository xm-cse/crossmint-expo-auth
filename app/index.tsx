import {
  CrossmintAuthProvider,
  CrossmintProvider,
  CrossmintWalletProvider,
  useCrossmintAuth,
  useWallet,
} from "@crossmint/client-sdk-react-native-ui";
import { Button, Text, View } from "react-native";

const CROSSMINT_API_KEY = process.env.EXPO_PUBLIC_CROSSMINT_API_KEY ?? "";

if (!CROSSMINT_API_KEY) {
  throw new Error("EXPO_PUBLIC_CROSSMINT_API_KEY is not set");
}

export default function App() {
  return (
    <CrossmintProvider apiKey={CROSSMINT_API_KEY}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: "base-sepolia",
            signer: { type: "email" },
          }}
        >
          <MainApp />
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}

function MainApp() {
  const { loginWithOAuth, logout, user } = useCrossmintAuth();
  const { wallet, status } = useWallet();

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Button
          title="Login with Google"
          onPress={() => loginWithOAuth("google")}
        />
      </View>
    );
  }

  if (status === "loaded") {
    return (
      <View style={{ padding: 20 }}>
        <Text>Welcome {user.email}!</Text>
        <Text>Wallet: {wallet?.address}</Text>
        <Button
          title="Send 1 USDC"
          onPress={() =>
            wallet?.send(
              "0xa064b2E2B6f9CEaC2c60a81369aeC35C0FBe467F",
              "usdc",
              "1.0"
            )
          }
        />
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return <Text>Loading wallet...</Text>;
}
