import { countBlogPosts } from "@/repositories/blog.repository";
import { countBrokerMessages } from "@/repositories/broker.repository";
import { countComments } from "@/repositories/comments.repository";
import { countContactMessages } from "@/repositories/contact.repository";
import { countTelemetryDevices } from "@/repositories/devices.repository";
import { latestTelemetryReading } from "@/repositories/telemetry.repository";
import { countProjects } from "@/repositories/projects.repository";
import { countUsers } from "@/repositories/users.repository";

export async function getAdminStats() {
  const [userCount, blogCount, projectCount, commentCount, contactMessageCount, deviceCount, brokerMessageCount, latestTelemetry] = await Promise.all([
    countUsers(),
    countBlogPosts(),
    countProjects(),
    countComments(),
    countContactMessages(),
    countTelemetryDevices(),
    countBrokerMessages(),
    latestTelemetryReading()
  ]);

  return {
    userCount,
    blogCount,
    projectCount,
    commentCount,
    contactMessageCount,
    deviceCount,
    brokerMessageCount,
    latestTelemetry
  };
}
