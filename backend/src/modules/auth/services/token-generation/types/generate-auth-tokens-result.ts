export interface IGenerateAuthTokensResult {
  accessToken: string;
  refreshToken: { token: string; expiresAt: Date };
}
