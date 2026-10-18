import { date, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

// RLS is enabled with no policies: Supabase's public API keys cannot read these tables.
// The backend connects as the database owner, which bypasses RLS.
export const intakeCases = pgTable('intake_cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: text('reference').notNull().unique(),
  status: text('status').notNull().default('new'),
  createdAt: createdAt(),

  scamType: text('scam_type').notNull(),
  otherScamType: text('other_scam_type'),
  amountLost: text('amount_lost').notNull(),
  incidentDate: date('incident_date').notNull(),
  country: text('country').notNull(),
  contactChannels: text('contact_channels').array().notNull(),
  paymentMethods: text('payment_methods').array().notNull(),
  institutionName: text('institution_name'),
  reportStatus: text('report_status'),
  existingReportRef: text('existing_report_ref'),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  preferredContact: text('preferred_contact'),
  timezone: text('timezone'),
  bestTimeToReach: text('best_time_to_reach'),

  caseSummary: text('case_summary').notNull(),
  evidenceDetails: text('evidence_details'),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),

  teamEmailSentAt: timestamp('team_email_sent_at', { withTimezone: true }),
  clientEmailSentAt: timestamp('client_email_sent_at', { withTimezone: true }),
  emailError: text('email_error'),
}).enableRLS();

export const intakeAttachments = pgTable(
  'intake_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => intakeCases.id, { onDelete: 'cascade' }),
    storagePath: text('storage_path').notNull(),
    originalName: text('original_name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    createdAt: createdAt(),
  },
  (table) => [index('intake_attachments_case_id_idx').on(table.caseId)],
).enableRLS();
