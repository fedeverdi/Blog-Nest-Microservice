
import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  titolo: String,
  descrizione: String,
  utente_id: String,
});
