import { Document } from 'mongoose';

export interface Blog extends Document {
  readonly titolo: string;
  readonly descrizione: string;
  readonly user_id: string;
}