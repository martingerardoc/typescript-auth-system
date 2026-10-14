import { randomBytes, scryptSync, timingSafeEqual, } from "node:crypto";
import { User } from "../models/User.js";
export class AuthenticationService {
    users = [];
    currentUser = null;
    hashPassword(password) {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        return `${salt}:${hash}`;
    }
    verifyPassword(password, storedHash) {
        const [salt, originalHash] = storedHash.split(":");
        if (!salt || !originalHash) {
            return false;
        }
        const hashBuffer = Buffer.from(originalHash, "hex");
        const passwordBuffer = scryptSync(password, salt, 64);
        return (hashBuffer.length === passwordBuffer.length &&
            timingSafeEqual(hashBuffer, passwordBuffer));
    }
    async register(username, password, fullName, email) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!username.trim() || !password || !fullName.trim() || !email.trim()) {
            throw new Error("All fields are required.");
        }
        if (this.users.some((user) => user.username.toLowerCase() === username.trim().toLowerCase())) {
            throw new Error("That username is already registered.");
        }
        if (password.length < 8) {
            throw new Error("Password must contain at least 8 characters.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            throw new Error("Please enter a valid email address.");
        }
        const user = new User(randomBytes(8).toString("hex"), username.trim(), this.hashPassword(password), { fullName: fullName.trim(), email: email.trim() });
        this.users.push(user);
        return user;
    }
    async login(username, password) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const user = this.users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
        if (!user || !this.verifyPassword(password, user.getPasswordHash())) {
            throw new Error("Invalid username or password.");
        }
        this.currentUser = user;
        return user;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    logout() {
        this.currentUser = null;
    }
}
