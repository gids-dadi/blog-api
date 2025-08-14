import { Schema, model, Types } from 'mongoose';

interface ILike {
	userId: Types.ObjectId;
	blogId?: Types.ObjectId;
	commentId?: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		blogId: {
			type: Schema.Types.ObjectId,
			// ref: 'Blog',
		},

		commentId: {
			type: Schema.Types.ObjectId,
			// ref: 'Comment',
		},
	},
	{
		timestamps: true,
	}
);

export default model<ILike>('Like', likeSchema);
