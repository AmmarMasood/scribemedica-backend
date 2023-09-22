import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

enum PatientGender {
  SHE = 'she/her',
  HE = 'he/him',
  THEY = 'they/them',
}

enum NoteType {
  INPATIENT = 'inpatient',
  OUTPATIENT = 'outpatient',
  DICTATION = 'dictation',
}
@Schema({
  timestamps: true,
})
export class Note {
  @Prop({ type: String, ref: 'Profile', required: true })
  userId: string;

  @Prop()
  description: string;

  @Prop({
    required: [true, 'patientName is required'],
  })
  patientName: string;

  @Prop({
    type: String,
    enum: Object.values(PatientGender), // Validate against enum values
  })
  patientGender: string;

  @Prop({
    required: [true, 'note type is required'],
    type: String,
    enum: Object.values(NoteType),
    default: NoteType.INPATIENT,
  })
  type: string;

  @Prop()
  transcription: string;

  @Prop()
  recordingLength: number;

  @Prop({
    required: [true, 'finalized is required'],
  })
  finalized: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
