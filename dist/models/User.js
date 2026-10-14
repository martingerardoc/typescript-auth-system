export class User {
    id;
    username;
    passwordHash;
    profile;
    constructor(id, username, passwordHash, profile) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.profile = profile;
    }
    getPasswordHash() {
        return this.passwordHash;
    }
    getProfile() {
        return { ...this.profile };
    }
    updateProfile(fullName, email) {
        this.profile = { fullName, email };
    }
    verifyPassword(passwordHash) {
        return this.passwordHash === passwordHash;
    }
    updatePasswordHash(passwordHash) {
        this.passwordHash = passwordHash;
    }
}
