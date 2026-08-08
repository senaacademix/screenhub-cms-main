import prisma from "@/lib/prisma";
import { ClientScreenPlayer } from "@/features/screens";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ScreenDisplayPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

function isScheduleInActiveTimeSlot(schedule: any, isPreviewMode: boolean) {
  if (isPreviewMode) return true;
  if (!schedule.isActive) return false;

  const now = new Date();

  // 1. Check Date Range
  if (schedule.startDate && now < new Date(schedule.startDate)) return false;
  if (schedule.endDate && now > new Date(schedule.endDate)) return false;

  // 2. Check Days of Week (0 = Sun, 1 = Mon, ..., 6 = Sat)
  if (schedule.daysOfWeek && schedule.daysOfWeek !== "ALL") {
    const currentDay = now.getDay().toString();
    const allowedDays = schedule.daysOfWeek.split(",");
    if (!allowedDays.includes(currentDay)) return false;
  }

  // 3. Check Time Range (HH:mm)
  if (schedule.startTime && schedule.endTime) {
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    if (currentTimeStr < schedule.startTime || currentTimeStr > schedule.endTime) {
      return false;
    }
  }

  return true;
}

export default async function ScreenDisplayPage({ params, searchParams }: ScreenDisplayPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const isPreviewMode = preview === "true";

  const screen = await prisma.screen.findUnique({
    where: { slug },
    include: {
      schedules: {
        where: { isActive: true },
        include: {
          publication: {
            include: {
              contents: {
                where: { isActive: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
      contents: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!screen) {
    notFound();
  }

  // Extract internal contents from scheduled active publications matching current time slots
  const scheduledContents = screen.schedules
    .filter((s) => s.publication && (isPreviewMode || s.publication.status === "PUBLISHED"))
    .filter((s) => isScheduleInActiveTimeSlot(s, isPreviewMode))
    .flatMap((s) => s.publication.contents);

  // Only play active scheduled publication contents. If no active schedule matches, contents is empty ([]).
  const finalContents = scheduledContents;

  const screenWithContents = {
    ...screen,
    contents: finalContents,
  };

  return <ClientScreenPlayer screen={screenWithContents} isPreviewMode={isPreviewMode} />;
}
