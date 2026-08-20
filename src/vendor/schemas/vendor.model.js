import { Schema, model, Types } from "mongoose";

/**
 * ── Sub-schema: a single day's availability slots ──────────────────
 * A vendor can be open multiple times in one day (e.g. 9–12, 4–8),
 * so each day holds an array of start/end slots rather than one string.
 */
const timeSlotSchema = new Schema(
  {
    startTime: {
      // stored as minutes-from-midnight (0–1439) → cheap to query/sort/compare
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
      validate: {
        validator: function (v) {
          return v > this.startTime;
        },
        message: "endTime must be after startTime",
      },
    },
  },
  { _id: false }
);

const availabilitySchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    slots: {
      type: [timeSlotSchema],
      default: [],
    },
    isClosed: {
      // explicit "closed all day" flag, cleaner than an empty slots array
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/**
 * ── Sub-schema: an individual service offered by the vendor ────────
 * Kept embedded (not a separate collection) since services are only
 * ever read/written in the context of their parent vendor, and a
 * vendor realistically has a small, bounded number of them (not an
 * unbounded log like reviews or bookings — those DO belong in their
 * own collections referencing vendorId).
 */
const serviceSchema = new Schema({
  category: {
    // top-level bucket: "Healthcare", "Tech", "Home Services", etc.
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  title: {
    // specific offering, e.g. "General Physician Consultation"
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  address: {
    line1: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true },
    zip: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4,10}$/, "Invalid postal code"],
    },
  },
  location: {
    // GeoJSON — enables $near / $geoWithin "vendors near me" queries
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  availability: {
    type: [availabilitySchema],
    default: [],
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  isActive: {
    // lets a vendor pause one service without deleting it
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

serviceSchema.index({ location: "2dsphere" });
serviceSchema.index({ category: 1, "address.city": 1 });

/**
 * ── Root schema: Vendor ──────────────────────────────────────────
 */
const vendorSchema = new Schema(
  {
    // Reference to a base User/Auth document rather than duplicating
    // credentials here. Keeps auth concerns (password, sessions,
    // login) separate from the vendor business profile.

    // businessName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   maxlength: 150,
    // },
    // vendorOwner: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    vendorEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    subscription:{
      type:String,
      enum:["basic","premium","pro"],
      default:"basic"
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    alternativeContact: {
      type: String,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },

    services: {
      type: [serviceSchema],
      default: [],
    },

    status: {
      // real-time presence, distinct from isActive (account-level enable/disable)
      type: String,
      enum: ["Online", "Offline", "Busy", "Out of Office"],
      default: "Online",
    },
    lastActiveAt: {
      // used to auto-expire a stale "Online" status via a heartbeat job
      type: Date,
      default: Date.now,
    },

    isActive: {
      // account-level soft disable (fraud, non-payment, self-deactivation)
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verificationDocuments: [
      {
        docType: { type: String, required: true }, // "license", "govt_id", "certification"
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    kyc: {
      panOrTaxId: { type: String, trim: true },
      verified: { type: Boolean, default: false },
    },

    profileImage: { type: String }, // URL, actual file lives in object storage

    averageRating: {
      // denormalized counter — actual review docs live in a separate
      // Review collection (ref: vendorId) to avoid unbounded array growth
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    payout: {
      // never store raw bank details yourself — reference the
      // connected-account id from your payments provider instead
      providerAccountId: { type: String },
      provider: { type: String, enum: ["stripe", "razorpay", "other"] },
    },
  },
  { timestamps: true }
);

vendorSchema.index({ businessName: "text", vendorOwner: "text" });

export const VendorModel = model("Vendor", vendorSchema);
