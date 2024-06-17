import pino, { Logger } from 'pino'
import dotenv from 'dotenv'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const logger: Logger = isProduction
    ? pino()
    : pino({
        transport: {
            target: 'pino-pretty',
            options: { colorize: true },
        },
    })
export default logger