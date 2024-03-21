import express from 'express'

import { ITodo, ITodoDoc, Todo } from '../models/todo'

const router = express.Router()
const DEFAULT_PATH = '/api/todo' as const

router.get<{ id: string }, ITodoDoc | string>(
  `${DEFAULT_PATH}/:id`,
  async (req, res) => {
    try {
      const { id } = req.params
      console.log(`Retrieving todo (${id})`)

      const todo = await Todo.findById(id)
      if (todo) {
        console.log(`Todo found.`)
        return res.status(200).send(todo)
      } else {
        console.warn('No todo found.')
        return res.status(204).send()
      }
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't retrieve the todo : ${JSON.stringify(error)}`)
    }
  }
)

router.get<void, ITodoDoc[] | string, void, ITodo>(
  DEFAULT_PATH,
  async (req, res) => {
    try {
      console.log(`Searching all todos with parameters :`, req.query)
      const { description, title } = req.query

      const todo = await Todo.find({
        ...(title ? { title: { $regex: title, $options: 'i' } } : {}),
        ...(description
          ? { description: { $regex: description, $options: 'i' } }
          : {}),
      })
      if (todo.length > 0) {
        console.log(`Todos found.`)
        return res.status(200).send(todo)
      } else {
        console.warn('No todo found.')
        return res.status(204).send()
      }
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't retrieve the todo : ${JSON.stringify(error)}`)
    }
  }
)

router.post<void, ITodoDoc | string, ITodo>(DEFAULT_PATH, async (req, res) => {
  try {
    console.log(`Creating todo with body :`, req.body)

    const todo = await Todo.create(req.body)
    console.log(`Successfully created todo.`)
    return res.status(201).send(todo)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .send(`Couldn't create the todo : ${JSON.stringify(error)}`)
  }
})

router.put<{ id: string }, ITodoDoc | string, ITodo>(
  `${DEFAULT_PATH}/:id`,
  async (req, res) => {
    try {
      const { id } = req.params
      const { description, title } = req.body
      console.log(`Updating todo (${id}) and body :`, req.body)

      const todo = await Todo.findByIdAndUpdate(
        id,
        { description, title },
        { new: true }
      )
      if (todo) res.status(200).send(todo)
      else res.status(204).send()
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't update the todo : ${JSON.stringify(error)}`)
    }
  }
)

router.patch<{ id: string; title: string }, ITodoDoc | string>(
  `${DEFAULT_PATH}/:id/title/:title`,
  async (req, res) => {
    try {
      const { id, title } = req.params
      console.log(`Updating todo (${id}) with title`, title)

      const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true })
      if (todo) res.status(200).send(todo)
      else res.status(204).send()
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't update the todo : ${JSON.stringify(error)}`)
    }
  }
)

router.patch<{ id: string; description: string }, ITodoDoc | string>(
  `${DEFAULT_PATH}/:id/description/:description`,
  async (req, res) => {
    try {
      const { id, description } = req.params
      console.log(`Updating todo (${id}) with description`, description)

      const todo = await Todo.findByIdAndUpdate(
        id,
        { description },
        { new: true }
      )
      if (todo) res.status(200).send(todo)
      else res.status(204).send()
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't update the todo : ${JSON.stringify(error)}`)
    }
  }
)

router.delete<{ id: string }, string, ITodo>(
  `${DEFAULT_PATH}/:id`,
  async (req, res) => {
    const { id } = req.params
    console.log(`Deleting todo (${id})`)
    try {
      const deleted = await Todo.findByIdAndDelete(id)
      if (deleted) {
        return res.status(200).send()
      } else {
        return res.status(204).send()
      }
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .send(`Couldn't delete the todo : ${JSON.stringify(error)}`)
    }
  }
)

export { router as todoRouter }
