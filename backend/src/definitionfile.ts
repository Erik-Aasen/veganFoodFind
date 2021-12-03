import { Request } from "express"
import { UserDeserialize, PostInterface, MongoInterface} from "./Interfaces/Interfaces"

export interface AuthRequest extends Request {
  user: UserDeserialize
  body: PostInterface
}

export interface RegisterRequest extends Request {
  user: UserDeserialize
  body: MongoInterface
}