import { Request } from "express"
import { UserInterface } from "src/Interfaces/UserInterface"

export interface AuthRequest extends Request {
  user: UserInterface
}