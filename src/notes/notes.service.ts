import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { IUser } from 'src/auth/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schemas/note.schema';
import { Model } from 'mongoose';
import { UpdateDto } from './dto/update.dto';
import { NoteDetailUpsertDto } from './dto/note-detail-upsert.dto';
import { NoteDetail } from './schemas/note-detail.schema';
import { NoteDetailGenerateDto } from './dto/note-detail-generate.dto';
import OpenAI from 'openai';
import { Profile } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
import {
  SubscriptionPlanStatus,
  SubscriptionPlans,
  isFreePlanActive,
} from 'src/subscription/config/plans';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class NotesService {
  private openai: any;
  private azureOpenAi: any;
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(NoteDetail.name) private noteDetailModel: Model<NoteDetail>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>
  ) {
    const apiKey = process.env.GPT_KEY
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    const azureOpenAiApiKey =
    process.env.AZURE_OPENAI_KEY
    const azureOpenAiEndpoint =
    process.env.AZURE_ENDPOINT

    this.azureOpenAi = new OpenAIClient(
      azureOpenAiEndpoint,
      new AzureKeyCredential(azureOpenAiApiKey),
    );
  }

  async createNew(createDto: CreateDto, user: any) {
    try {
      const { description, patientName, type, finalized } = createDto;
      const profile = await this.profileModel.findOne({
        userId: user.userId,
      });
      const notes = await this.noteModel.find({ userId: user.userId });
      const subscription = await this.subscriptionPlanModel.findOne({
        userId: user.userId,
      });
      if (subscription.planId === SubscriptionPlans.FREE) {
        if (!isFreePlanActive(subscription)) {
          throw new Error('Your free plan has expired.');
        }
        if (profile.notesAllowed <= notes.length) {
          throw new Error('You have reached your free plan notes limit');
        }
      } else {
        if (
          subscription.status === SubscriptionPlanStatus.CANCELLED ||
          subscription.status === SubscriptionPlanStatus.INACTIVE
        ) {
          throw new Error('Your subscription is not active');
        }
        if (profile.notesAllowed <= notes.length) {
          throw new Error(`You have reached your plan notes limit`);
        }
      }
      const newNote = await this.noteModel.create({
        description,
        patientName,
        type,
        finalized,
        userId: user.userId,
      });
      return newNote;
    } catch (e) {
      if (
        e.message === 'You have reached your free plan notes limit' ||
        e.message === 'Your free plan has expired.' ||
        e.message === 'Your subscription is not active' ||
        e.message === 'You have reached your plan notes limit'
      ) {
        throw new BadRequestException(e.message);
      }

      throw new Error('Unable to create new note');
    }
  }

  async updateNote(updateDto: UpdateDto, user: any, noteId: string) {
    try {
      const {
        description,
        patientName,
        patientGender,
        transcription,
        recordingLength,
        finalized,
      } = updateDto;
      const updatedNote = await this.noteModel.findOneAndUpdate(
        {
          _id: noteId,
          userId: user.userId,
        },
        {
          description,
          patientName,
          patientGender,
          transcription,
          recordingLength,
          finalized,
        },
        {
          new: true,
        },
      );
      return updatedNote;
    } catch (e) {
      console.log(e);
      throw new Error('Unable to update note');
    }
  }

  async finalize(
    user: any,
    noteDetailUpsertDto: NoteDetailUpsertDto,
    noteId: string,
  ) {
    try {
      const generated = await this.generateDetails(user, {
        transcript: noteDetailUpsertDto.transcript,
        noteType: noteDetailUpsertDto.noteType,
        patientGender: noteDetailUpsertDto.patientGender,
      });
      const finalizedNote = await this.noteModel.findOneAndUpdate(
        {
          _id: noteId,
        },
        {
          finalized: true,
          patientGender: noteDetailUpsertDto.patientGender,
        },
      );
      if (!finalizedNote) throw new Error('Unable to finalize note');

      const finalizedNoteDetail = await this.noteDetailModel.create({
        medicalNote: generated.note,
        noteId: finalizedNote._id,
        modelUsed: generated.model,
        noteType: noteDetailUpsertDto.noteType,
      });

      return {
        note: finalizedNote,
        noteDetail: finalizedNoteDetail,
      };
    } catch (e) {
      throw new Error('Unable to finalize note');
    }
  }

  async updateNoteDetail(
    user: any,
    noteDetailUpsertDto: NoteDetailUpsertDto,
    noteDetailId: string,
  ) {
    try {
      const updatedNoteDetail = await this.noteDetailModel.findOneAndUpdate(
        {
          _id: noteDetailId,
        },
        {
          ...noteDetailUpsertDto,
        },
      );

      return {
        updatedNoteDetail,
      };
    } catch (e) {
      throw new Error('Unable to finalize note');
    }
  }

  async generateDetails(
    user: any,
    noteDetailGenerateDto: NoteDetailGenerateDto,
  ) {
    try {
      const profile = await this.profileModel.findOne({
        userId: user.userId,
      });

      const text = `Create a medical note based on with this transcript for the person with these pronouns ${noteDetailGenerateDto.patientGender} here is the transcript ${noteDetailGenerateDto.transcript}`;

      if (profile.speciality) {
        text.concat(
          ` and the speciality of the doctor who wrote this transcript is ${profile.speciality}, so make sure to create a note based on that speciality`,
        );
      }

      // const t = await this.generateWithOpenAI(
      //   text,
      //   noteDetailGenerateDto.transcript,
      //   noteDetailGenerateDto.noteType,
      // );

      const t = await this.generateDetailWithAzure(
        text,
        noteDetailGenerateDto.transcript,
        noteDetailGenerateDto.noteType,
      );

      return t;
    } catch (err) {
      console.log(err);
      throw new Error('Unable to generate note details');
    }
  }

  async generateWithOpenAI(text: any, transcript: any, noteType: any) {
    try {
      const c2 = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      });
      const reply = c2.choices[0].message.content;

      const c3 = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `This is the medical note: ${reply} created against patient with this transcript ${transcript} for the patient. Enhance it and return a ${noteType}.`,
          },
        ],
      });

      return {
        note: c3.choices[0].message.content,
        model: c3.model,
      };
    } catch (e) {
      console.log(e);
      throw new Error('Unable to generate note details');
    }
  }
  async generateDetailWithAzure(text: any, transcript: any, noteType: any) {
    try {
      const c2 = await this.azureOpenAi.getChatCompletions(
        'scribemedica-gpt-35',
        [
          {
            role: 'user',
            content: text,
          },
        ],
        {},
      );
      const reply = c2.choices[0].message.content;
      const c3 = await this.azureOpenAi.getChatCompletions(
        'scribemedica-gpt-35',
        [
          {
            role: 'user',
            content: `This is the medical note: ${reply} created against patient with this transcript ${transcript} for the patient. Enhance it and return a ${noteType}.`,
          },
        ],
        {},
      );

      return {
        note: c3.choices[0].message.content,
        model: c3.model,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Unable to generate note details');
    }
  }

  // async getNotes(
  //   user: any,
  //   noteType: string,
  //   page: number,
  //   limit: number,
  //   search: string,
  // ) {
  //   try {
  //     const notes = await this.noteModel.find({ userId: user.userId });

  //     const noteIds = notes.map((note) => note._id);

  //     const noteDetails = await this.noteDetailModel.find({
  //       noteId: { $in: noteIds },
  //     });

  //     const notesWithDetails = notes.map((note) => {
  //       const noteDetail = noteDetails.find(
  //         (detail) => detail.noteId.toString() === note._id.toString(),
  //       );
  //       return {
  //         ...note.toObject(),
  //         noteDetail,
  //       };
  //     });

  //     return notesWithDetails;
  //   } catch (e) {
  //     throw new Error('Unable to get notes');
  //   }
  // }

  async getNotes(
    user: any,
    noteType: string,
    page: number,
    limit: number,
    search: string,
  ) {
    try {
      // Define a filter object to filter notes based on noteType and search keyword
      const filter: any = { userId: user.userId };
      if (noteType && noteType !== 'all') {
        filter.type = noteType;
      }
      if (search) {
        filter.patientName = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
      }

      // Calculate skip count to implement pagination
      const skip = (page - 1) * limit;

      // Retrieve notes with pagination and filtering
      const notes = await this.noteModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order

      const noteIds = notes.map((note) => note._id);

      // Retrieve note details for the filtered notes
      const noteDetails = await this.noteDetailModel.find({
        noteId: { $in: noteIds },
      });

      // Map notes with their details
      const notesWithDetails = notes.map((note) => {
        const noteDetail = noteDetails.find(
          (detail) => detail.noteId.toString() === note._id.toString(),
        );
        return {
          ...note.toObject(),
          noteDetail,
        };
      });

      return notesWithDetails;
    } catch (e) {
      throw new Error('Unable to get notes');
    }
  }

  async getNoteDetails(noteId: string, user: any) {
    try {
      const note = await this.noteModel.findOne({
        _id: noteId,
        userId: user.userId,
      });

      if (!note) throw new Error('Unable to find note');

      const noteDetail = await this.noteDetailModel.findOne({
        noteId: note._id,
      });

      return {
        note,
        noteDetail,
      };
    } catch (e) {
      throw new Error('Unable to get note details');
    }
  }

  async deleteNote(user: any, noteId: string) {
    try {
      const note = await this.noteModel.findOne({
        _id: noteId,
        userId: user.userId,
      });
      const noteDetail = await this.noteDetailModel.findOne({
        noteId: note._id,
      });

      if (!note) throw new Error('Unable to find note');

      await this.noteModel.deleteOne({
        _id: note._id,
      });
      await this.noteDetailModel.deleteOne({
        _id: noteDetail._id,
      });

      return {
        note,
      };
    } catch (e) {
      throw new Error('Unable to delete note');
    }
  }
}
