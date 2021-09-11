import { Request } from "express"
import { UserDeserialize, PostInterface } from "./Interfaces/Interfaces"

export interface AuthRequest extends Request {
  user: UserDeserialize
  body: PostInterface
}