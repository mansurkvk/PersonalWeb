import type { ObjectId } from "mongodb";

export type UserRole = "admin" | "user";

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  x?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
};

export type UserDocument = {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};

export type AuthLogDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
};

export type BlogPostStatus = "draft" | "published";

export type BlogPostDocument = {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: BlogPostStatus;
  authorId: ObjectId;
  viewCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
};

export type BlogCommentStatus = "visible" | "hidden" | "pending";

export type BlogCommentDocument = {
  _id?: ObjectId;
  postId: ObjectId;
  userId: ObjectId;
  parentCommentId?: ObjectId;
  authorName: string;
  content: string;
  status: BlogCommentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectStatus = "idea" | "prototype" | "active" | "archived";

export type ProjectDocument = {
  _id?: ObjectId;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage?: string;
  images: string[];
  technologies: string[];
  category: string;
  status: ProjectStatus;
  links: {
    github?: string;
    demo?: string;
    article?: string;
    oldSite?: string;
  };
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export type ContactMessageDocument = {
  _id?: ObjectId;
  userId?: ObjectId;
  name?: string;
  email: string;
  subject: string;
  productSlug?: string;
  message: string;
  source: "contact-page" | "product-page";
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TelemetryDeviceDocument = {
  _id?: ObjectId;
  deviceId: string;
  name: string;
  description?: string;
  deviceKeyHash?: string;
  apiKeyHash?: string;
  type: string;
  status?: string;
  location?: string;
  locationLabel?: string;
  firmwareVersion?: string;
  isActive?: boolean;
  lastSeenAt?: Date;
  lastTopic?: string;
  lastPayloadSize?: number;
  lastReading?: Record<string, unknown>;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TelemetryReadingDocument = {
  _id?: ObjectId;
  deviceId: string;
  packetType?: "status" | "telemetry" | "performance" | string;
  topic?: string;
  qos?: number;
  source?: string;
  transport?: string;
  payloadSize?: number;
  brokerReceivedAtMs?: number;
  cloudReceivedAtMs?: number;
  rawText?: string;
  parseOk?: boolean;

  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
  current?: number;
  currentA?: number;
  currentmA?: number;
  batteryPercent?: number;
  signalStrength?: number;
  wifiRssi?: number;
  distance?: number;
  motionState?: string;
  deviceStatus?: string;
  uptime?: number;
  errorCode?: string;
  firmwareVersion?: string;
  locationLabel?: string;

  data?: Record<string, unknown>;
  normalized?: Record<string, unknown>;
  rawPayload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BrokerMessageStatus = "queued" | "processed" | "failed";

export type BrokerMessageDocument = {
  _id?: ObjectId;
  topic: string;
  deviceId?: string;
  payload: Record<string, unknown>;
  status: BrokerMessageStatus;
  createdAt: Date;
  processedAt?: Date;
};

export type EmailOutboxStatus = "queued" | "sent" | "failed";

export type EmailOutboxDocument = {
  _id?: ObjectId;
  to: string;
  subject: string;
  body: string;
  template?: string;
  status: EmailOutboxStatus;
  tryCount: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
};

export type SiteSettingsDocument = {
  _id?: ObjectId;
  siteTitle: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  oldSiteUrl: string;
  socialLinks: SocialLinks;
  theme: "dark" | "light" | "system";
  createdAt: Date;
  updatedAt: Date;
};

export type AuditLogDocument = {
  _id?: ObjectId;
  actorUserId?: ObjectId;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};
