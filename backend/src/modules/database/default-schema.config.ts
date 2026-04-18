export const DEFAULT_SCHEMA_OPTIONS = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true, aliases: true, versionKey: false },
  toObject: { virtuals: true, aliases: true, versionKey: false },
};
