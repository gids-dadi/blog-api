import { genSlug } from '@/utils';
import { Schema, model, Types } from 'mongoose';

export interface IBlog {
	title: string;
	slug: string;
	content: string;
	banner: {
		publicId: string;
		url: string;
		width: number;
		height: number;
	};
	author: Types.ObjectId;
	viewsCount: number;
	likesCount: number;
	commentsCount: number;
	status: 'draft' | 'published';
}

const blogSchema = new Schema<IBlog>(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			maxLength: [150, 'Title cannot exceed 150 characters'],
		},
		slug: {
			type: String,
			required: [true, 'Slug is required'],
			unique: [true, 'Slug must be unique'],
		},
		content: {
			type: String,
			required: [true, 'Content is required'],
		},
		banner: {
			publicId: {
				type: String,
				required: [true, 'Banner public ID is required'],
			},
			url: {
				type: String,
				required: [true, 'Banner URL is required'],
			},
			width: {
				type: Number,
				required: [true, 'Banner width is required'],
			},
			height: {
				type: Number,
				required: [true, 'Banner height is required'],
			},
		},
		author: {
			type: Schema.Types.ObjectId,
			required: [true, 'Author is required'],
			ref: 'User',
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		likesCount: {
			type: Number,
			default: 0,
		},
		commentsCount: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['draft', 'published'],
			message: '{VALUE} is not a valid status',
			default: 'draft',
			required: [true, 'Status is required'],
		},
	},
	{
		timestamps: true,
	}
);

blogSchema.pre('validate', function (next) {
	if (this.title && !this.slug) {
		this.slug = genSlug(this.title);
	}
	next();
});

export default model<IBlog>('Blog', blogSchema);
