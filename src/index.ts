import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE, TAccount } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id
    const findAccount = accounts.find((account) => {
        return account.id === id
    })
    if (findAccount) {
        res.status(200).send(findAccount)
    } else {
        res.status(200).send("Account does not exist")
    }

})

app.delete("/accouunts/:id", (req: Request, res: Response) => {
    const id = req.params.id
    const findAccountIndex = accounts.findIndex((account) => {
        return account.id === id
    })
    if (findAccountIndex >= 0) {
        accounts.splice(findAccountIndex, 1)
        res.status(200).send("item deleted successfully")

    } else {
        res.status(200).send("Account does not exist")
    }
})

app.put("/accouunts/:id", (req: Request, res: Response) => {
    const id = req.params.id
    const { id: newId, ownerName, balance, type } = req.body
    const findAccount = accounts.find((account) => {
        return account.id === id
    })

    if (type !== ACCOUNT_TYPE.BLACK && type !== ACCOUNT_TYPE.BRONZE && type !== ACCOUNT_TYPE.GOLD && type !== ACCOUNT_TYPE.PLATINUM && type !== ACCOUNT_TYPE.SILVER) {
        res.status(400).send("Invalid value of type")
    }

    if (findAccount) {
        findAccount.id = newId || findAccount.id
        findAccount.ownerName = ownerName || findAccount.ownerName
        findAccount.balance = balance || findAccount.balance
        findAccount.type = type || findAccount.type
        res.status(200).send("update completed successfully")
    } else {

        res.status(200).send("Account not found")
    }
})

app.post("/accounts", (req: Request, res: Response) => {
    const { id, ownerName, balance, type } = req.body
    const newAccount: TAccount = {
        id,
        ownerName: ownerName,
        balance: balance,
        type
    }
    accounts.push(newAccount)
    res.status(200).send("Account created successfully")
})