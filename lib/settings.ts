import { prisma } from "./prisma";

export const SETTINGS = {
  BLOG_AUTO_PUBLISH: "blog_auto_publish",  // "true" | "false"
} as const;

export async function getSetting(key: string, defaultValue = ""): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    await prisma.setting.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    });
  } catch {}
}

export async function isAutoPublish(): Promise<boolean> {
  const val = await getSetting(SETTINGS.BLOG_AUTO_PUBLISH, "false");
  return val === "true";
}
