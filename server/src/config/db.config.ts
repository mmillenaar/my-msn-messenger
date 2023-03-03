import dotenv from 'dotenv'
dotenv.config()

type DbConfigType = {
    URL: string,
    options: {}
}

export const dbConfig: DbConfigType = {
    URL: process.env.MONGOURL,
    options: {}
}