import { scryptSync, randomBytes } from 'crypto'

export class Password {
    static toHash(password: string) {
        const salt = randomBytes(8).toString('hex')
        const hashedPassword = scryptSync(password, salt, 64).toString('hex')
        return `${hashedPassword}.${salt}`
    }

    static comparePasswords(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".")
        const hashedSupplied = scryptSync(suppliedPassword, salt, 64).toString('hex')
        return hashedPassword === hashedSupplied
    }
}