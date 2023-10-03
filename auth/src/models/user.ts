import mongoose from "mongoose";
import { Password } from "../services/password";


interface UserAttrs {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends mongoose.Document, UserAttrs { }

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        },
    }
})

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const hashedPassword = Password.toHash(this.get('password'))
        this.set('password', hashedPassword)
        next()
    }
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User({ email: attrs.email, password: attrs.password })
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)


export { User }
