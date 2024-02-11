import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const $notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    imageUrl: text('imageUrl'),
    userId: text('user_id').notNull(),
    editorState: text('editor_state')
})

// we need typescript types for the above table
export type NoteType = typeof $notes.$inferInsert

// drizzle-orm -> Interaction with the database
// drizzle-kit -> It's a developer tool (migrate the tables)
//                when you create a new table the u can drizzle-kit to push ur migrations up to the database 





