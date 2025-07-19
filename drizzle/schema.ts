import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { relations } from 'drizzle-orm';
import { pgTable, uuid, boolean, integer, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';

const createdAt = timestamp('createdAt').notNull().defaultNow();

const updatedAt = timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

//Define the events table schema
export const EventTable = pgTable('events',
     {
        id:uuid('id').primaryKey().defaultRandom(),
        name:text("name").notNull(),
        description:text("description"),
        durationInMinutes:integer("durationInMinutes").notNull(),
        clerkUserId:text("clerkUserId").notNull(),
        isActive:boolean("isActive").notNull().default(true),
        category:text("category"),
        createdAt,
        updatedAt,
     },
     table => ([
        index("clerkUserId_index").on(table.clerkUserId),
     ])
     ,) 

export const ScheduleTable = pgTable('schedules', {

    id: uuid('id').primaryKey().defaultRandom(),
    timezone: text('timezone').notNull(),
    clerkUserId: text('clerkUserId').notNull().unique(),
    createdAt,
    updatedAt,

})

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable), // one-to-many relationship
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable(
    "scheduleAvailabilities",
    {
      id: uuid("id").primaryKey().defaultRandom(),// unique ID
      scheduleId: uuid("scheduleId") // foreign key to the Schedule table
        .notNull()
        .references(() => ScheduleTable.id, { onDelete: "cascade" }), // cascade delete when schedule is deleted
      startTime: text("startTime").notNull(), // start time of availability (e.g. "09:00")
      endTime: text("endTime").notNull(), // end time of availability (e.g. "17:00")
      dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(), // day of the week (ENUM)
    },
    table => ([
      index("scheduleIdIndex").on(table.scheduleId),           // index on foreign key for faster lookups
    ])
  )

export const ScheduleAvailabilityRelations = relations(
    ScheduleAvailabilityTable,
    ({ one }) => ({
      schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId], // local key
        references: [ScheduleTable.id], // foreign key
      }),
    })
  )