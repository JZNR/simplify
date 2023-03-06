const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      // whitespaces
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    firstName: String,
    surname: String,
    googleId: String,
    events:  [{ type: Schema.Types.ObjectId, ref: "Event" }],
    notes:  [{ type: Schema.Types.ObjectId, ref: "Note" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("User", userSchema);