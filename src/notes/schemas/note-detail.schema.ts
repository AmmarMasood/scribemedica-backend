import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { NoteType } from '../dto/note-detail-upsert.dto';

@Schema({
  timestamps: true,
})
export class NoteDetail {
  @Prop({ type: 'ObjectId', ref: 'Note', required: true })
  noteId: ObjectId;

  @Prop()
  medicalNote: string;

  @Prop({
    type: String,
    enum: Object.values(NoteType), // Validate against enum values
  })
  noteType: string;

  @Prop({
    required: [true, 'modelUsed is required'],
  })
  modelUsed: string;
}

export const NoteDetailSchema = SchemaFactory.createForClass(NoteDetail);
