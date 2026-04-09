import User from "../models/User.js";
import { defaultStudentSeed } from "../config/demoStudent.js";

export const ensureDefaultStudent = async () => {
  const existing = await User.findOne({ uid: defaultStudentSeed.uid });
  if (existing) {
    return;
  }

  await User.create(defaultStudentSeed);

  console.log(`Default student seeded: UID ${defaultStudentSeed.uid}`);
};
