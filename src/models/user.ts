import { Schema, model, models } from 'mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
	firstName?: string;
	lastName?: string;
	username: string;
	email: string;
	password: string;
	isActive?: boolean;
	role: 'user' | 'admin';
	socialLinks?: {
		website?: string;
		facebook?: string;
		linkedIn?: string;
		instagram?: string;
		x?: string;
		youtube?: string;
	};
}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			maxlength: [50, 'Username cannot exceed 50 characters'],
			unique: [true, 'Username already exists'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email already exists'],
			maxLength: [50, 'Email cannot exceed 100 characters'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters'],
			select: false, // Do not return password in queries
		},
		role: {
			type: String,
			required: [true, 'Role is required'],
			enum: {
				values: ['user', 'admin'],
				message: '{VALUE}  is not a valid role',
			},
			default: 'user',
		},
		firstName: {
			type: String,
			maxlength: [20, 'First name cannot exceed 50 characters'],
		},
		lastName: {
			type: String,
			maxlength: [20, 'Last name cannot exceed 50 characters'],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		socialLinks: {
			website: {
				type: String,
				maxlength: [100, 'Website URL cannot exceed 100 characters'],
			},
			facebook: {
				type: String,
				maxlength: [100, 'Facebook URL cannot exceed 100 characters'],
			},
			linkedIn: {
				type: String,
				maxlength: [100, 'LinkedIn URL cannot exceed 100 characters'],
			},
			instagram: {
				type: String,
				maxlength: [100, 'Instagram URL cannot exceed 100 characters'],
			},
			x: {
				type: String,
				maxlength: [100, 'X URL cannot exceed 100 characters'],
			},
			youtube: {
				type: String,
				maxlength: [100, 'YouTube URL cannot exceed 100 characters'],
			},
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
		return;
	}

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

export default model<IUser>('User', userSchema, 'users');
