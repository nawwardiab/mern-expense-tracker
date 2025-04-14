import { v4 as uuidv4 } from "uuid";

//! Generate Token for Invitation Link
export function generateInviteToken() {
  return uuidv4();
}
