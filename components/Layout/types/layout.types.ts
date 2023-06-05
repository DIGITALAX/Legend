export type WalletProps = {
  handleTransaction: () => void;
  profile: string;
  buttonText: string;
  signInLoading: boolean;
};

export type UseSignInResults = {
  handleConnect: () => void;
  handleLensSignIn: () => void;
  connected: boolean;
  signInLoading: boolean;
};

