import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  coordinates: text("coordinates"),
  creatorEmail: text("creator_email").notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").notNull().default("warm"),
  city: text("city").notNull().default("istanbul"),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  pomodoroWorkDuration: text("pomodoro_work_duration").notNull().default("25"),
  pomodoroBreakDuration: text("pomodoro_break_duration").notNull().default("5"),
  pomodoroLongBreakDuration: text("pomodoro_long_break_duration").notNull().default("15"),
  pomodoroRounds: text("pomodoro_rounds").notNull().default("4"),
});

export const insertEventSchema = createInsertSchema(events)
  .omit({ id: true })
  .extend({
    title: z.string().min(1, "Başlık gereklidir"),
    description: z.string().optional().nullable(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    location: z.string().optional().nullable(),
    coordinates: z.string().optional().nullable(),
    creatorEmail: z.string().email("Geçerli bir e-posta adresi giriniz")
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message: "Bitiş zamanı başlangıç zamanından sonra olmalıdır",
      path: ["endTime"]
    }
  );

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;