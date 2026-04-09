import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    batch: { type: String, trim: true },
  },
  { _id: false },
);

const attendanceSchema = new mongoose.Schema(
  {
    semester: { type: String, default: "Semester 1" },
    present: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    percentLabel: { type: Number, default: 0 },
    startDate: { type: String, default: "-" },
    endDate: { type: String, default: "-" },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["Student", "Mentor", "Admin"],
      default: "Student",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    mobile: { type: String, trim: true, default: "" },
    university: { type: String, trim: true, default: "N/A" },
    image: { type: String, default: "" },
    attendance: {
      type: attendanceSchema,
      default: () => ({}),
    },
    subjects: {
      type: [String],
      default: [],
    },
    mentors: {
      type: [mentorSchema],
      default: [],
    },
    assignments: {
      type: Number,
      default: 0,
    },
    pendingAssignments: {
      type: Number,
      default: 0,
    },
    events: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    _id: this._id,
    uid: this.uid,
    role: this.role,
    name: this.name,
    email: this.email,
    mobile: this.mobile,
    university: this.university,
    image: this.image,
    attendance: this.attendance,
    subjects: this.subjects,
    mentors: this.mentors,
    assignments: this.assignments,
    pendingAssignments: this.pendingAssignments,
    events: this.events,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
