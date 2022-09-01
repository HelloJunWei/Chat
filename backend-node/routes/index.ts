import express from 'express'
import { findUser, findUsersById } from '../services/user'
import { getFirebaseApp } from '../utils/firebase'
import { verifyToken } from '../services/auth'
import {getRoomInfo, getTotalMessageCount, setMessageDataToFirestore, updateRoomInfo, updateTotalMessageCount, updateUserCount  } from '../services/room'

const router = express.Router()

router.post('/login', async (req, res) => {
  const token = req.body.token
  if (!token) {
    res.status(403).send('error')
    return
  }

  try {
    const user = await findUser(token)
    const firebaseToken = await getFirebaseApp().auth()
      .createCustomToken(user.userId)
    res.json({
      firebaseToken,
      userId: user.userId,
      photoUrl: user.photoUrl,
      displayName: user.displayName
    })
  } catch (e) {
    console.error(e)
    res.status(520).send('error')
  }
})

router.get('/users', async(req, res) => {
  try {
    const token = req.headers.authorization || ''
    if (!verifyToken(token)) {
      throw new Error('403')
    }
    const userIds = req.query.userIds as string[]
    const result = await findUsersById(userIds)
    res.json(result)
  } catch (e: any) {
    console.error(e)
    if (e?.message === '403') {
      res.status(403).send('403')
      return
    }
    res.status(500).send('403')


  }
})

router.post('/sendMessage', async(req, res) => {
  try {
    const roomId = req.body.roomId
    const message = req.body.message
    const token = req.headers.authorization || ''
    if (!roomId) throw new Error('error')
    if (!verifyToken(token)) throw new Error('403')

    const sender = await findUser(token)
    const roomInfo = await getRoomInfo(roomId)
    const totalMessage = await getTotalMessageCount(roomId)
    if (!roomInfo || !totalMessage) return new Error('error')

    const otherId = roomInfo?.RoomUsers.find(val => val !== sender.userId) || ''
    if (!otherId) throw new Error('error')

    // set Message
    const messageReference = await setMessageDataToFirestore(roomId, {
      senderId: sender.userId,
      otherId: otherId,
      message
    })

    // update total message count
    updateTotalMessageCount(roomId, totalMessage?.Count ? totalMessage.Count + 1 : 0)

    // update total LastMessage and time
    updateRoomInfo(roomId, messageReference)

    const messageId = (await messageReference.get()).id
    res.json({
      messageId
    })

  } catch (e: any) {
    console.error(e)
    if (e?.message === '403') {
      res.status(403).send('403')
      return
    }
    res.status(500).send('403')
  }
})

router.post('/readRoomMessage', async(req, res) => {
  try {
    const roomId = req.body.roomId
    const token = req.headers.authorization || ''
    if (!roomId) throw new Error('error')
    if (!verifyToken(token)) throw new Error('403')
    const sender = await findUser(token)
    const totalMessage = await getTotalMessageCount(roomId) 

    await updateUserCount(roomId, {
      senderId: sender.userId,
      count: totalMessage?.Count || 0
    })

    res.json()
  } catch(e: any) {
    console.error(e)
    if (e?.message === '403') {
      res.status(403).send('403')
      return
    }
    res.status(500).send('403')

  }
})

export default router

