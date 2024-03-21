import mongoose from 'mongoose'

export interface ITodo {
  title: string
  description: string
}

export type ITodoDoc = mongoose.Document & ITodo

interface ITodoModel extends mongoose.Model<ITodoDoc> {
  build(attr: ITodo): ITodoDoc
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr)
}

const Todo = mongoose.model<ITodoDoc, ITodoModel>('Todo', todoSchema)

export { Todo }
