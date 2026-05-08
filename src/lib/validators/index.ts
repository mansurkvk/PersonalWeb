import { z } from "zod";

// API girislerini zod ile dogrular; hatali payload sistemin kirilmasini engeller.
const optionalNumber = z.coerce.number().finite().optional();
const emptyToUndefined = z.literal("").transform(() => undefined);
const optionalUrl = z.union([z.string().url(), emptyToUndefined]).optional();

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  displayName: z.string().min(2).max(80),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_.]+$/),
  email: z.string().email(),
  password: z.string().min(6)
});

export const blogPostInputSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().min(10).max(320),
  content: z.string().min(20),
  coverImage: optionalUrl,
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().min(2).default("Engineering Notes"),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false)
});

export const projectInputSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  summary: z.string().min(10).max(320),
  description: z.string().min(20),
  coverImage: optionalUrl,
  images: z.array(z.string().url()).default([]),
  technologies: z.array(z.string().min(1)).default([]),
  category: z.string().min(2).default("Web Platform"),
  status: z.enum(["idea", "prototype", "active", "archived"]).default("active"),
  links: z
    .object({
      github: optionalUrl,
      demo: optionalUrl,
      article: optionalUrl,
      oldSite: optionalUrl
    })
    .default({}),
  featured: z.boolean().default(false)
});

export const commentSchema = z.object({
  postId: z.string().min(12),
  parentCommentId: z.string().min(12).optional(),
  content: z.string().min(3).max(1200)
});

export const commentModerationSchema = z.object({
  status: z.enum(["visible", "hidden", "pending"])
});

export const telemetryReadingSchema = z.object({
  deviceId: z.string().min(2).max(80),
  temperature: optionalNumber,
  humidity: optionalNumber,
  pressure: optionalNumber,
  voltage: optionalNumber,
  current: optionalNumber,
  batteryPercent: optionalNumber,
  signalStrength: optionalNumber,
  distance: optionalNumber,
  motionState: z.string().max(80).optional(),
  deviceStatus: z.string().max(80).optional(),
  uptime: optionalNumber,
  errorCode: z.string().max(80).optional(),
  firmwareVersion: z.string().max(80).optional(),
  locationLabel: z.string().max(120).optional(),
  source: z.string().max(80).optional(),
  rawPayload: z.record(z.unknown()).optional(),
  payload: z.record(z.unknown()).optional()
});

export const telemetryDeviceInputSchema = z.object({
  deviceId: z.string().min(2).max(80),
  name: z.string().min(2).max(120),
  description: z.string().max(600).optional(),
  deviceKey: z.string().min(8).optional(),
  type: z.string().max(80).default("esp32"),
  location: z.string().max(160).optional(),
  locationLabel: z.string().max(160).optional(),
  firmwareVersion: z.string().max(80).optional(),
  isActive: z.boolean().default(true)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(3),
  siteDescription: z.string().min(10),
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().min(10),
  oldSiteUrl: z.string().url(),
  theme: z.enum(["dark", "light", "system"]).default("dark")
});
