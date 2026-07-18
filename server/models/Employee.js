const mongoose = require('mongoose');

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: DEPARTMENTS,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
      max: [10000000, 'Salary exceeds maximum limit'],
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
module.exports.DEPARTMENTS = DEPARTMENTS;
