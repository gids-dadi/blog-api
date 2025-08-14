import { Schema, model, Types } from 'mongoose';

interface IToken {
	userId: Types.ObjectId;
	token: string;
}

const tokenSchema = new Schema<IToken>({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
		unique: true,
	},
});

export default model<IToken>('Token', tokenSchema);
