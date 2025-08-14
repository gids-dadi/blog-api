import { Schema, model, Types } from 'mongoose';

export interface IComment {
	userId: Types.ObjectId;
	blogId: Types.ObjectId;
	content: string;
}

const commentSchema = new Schema<IComment>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		blogId: {
			type: Schema.Types.ObjectId,
			required: true,
			// ref: 'Blog',
		},

		content: {
			type: String,
			required: true,
			trim: true,
			minlength: [1, 'Content must be at least 1 character long'],
			maxlength: [1000, 'Content must be at most 500 characters long'],
		},
	},
	{
		timestamps: true,
	}
);

export default model<IComment>('Comment', commentSchema);
