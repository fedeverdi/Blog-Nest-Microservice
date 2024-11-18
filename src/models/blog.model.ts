import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @Prop({ required: true })
  titolo: string;

  @Prop({ required: true })
  descrizione: string;

  @Prop({ required: true })
  user_id: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
