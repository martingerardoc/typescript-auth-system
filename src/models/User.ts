
export interface UserProfile {
  fullName: string;
  email: string;
}

export class User {

  constructor(
    public readonly id: string,
    public readonly username: string,
    private passwordHash: string,
    private profile: UserProfile
  ) {}

  getPasswordHash(): string {
  return this.passwordHash;
}

  getProfile(): UserProfile {
    return { ...this.profile };
  }

  updateProfile(fullName: string, email: string): void {
    this.profile = { fullName, email };
  }

  verifyPassword(passwordHash: string): boolean {
    return this.passwordHash === passwordHash;
  }

  updatePasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }
}
