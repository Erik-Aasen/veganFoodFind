import { Request } from "express"
import { UserDeserialize, PostInterface } from "src/Interfaces/UserInterface"

export interface AuthRequest extends Request {
  user: UserDeserialize
  body: PostInterface
}