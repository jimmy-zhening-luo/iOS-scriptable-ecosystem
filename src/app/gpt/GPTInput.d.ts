declare type GPTInput = {
  prompt: string; // Text or Base64 encoded text
} & Partial<GPTSetting["user"]["default"]>;
