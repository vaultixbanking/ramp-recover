import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createReference } from '../lib/reference.js';
import type { IntakeInput } from '../validation/intake.js';
import { intakeAttachments, intakeCases } from './schema.js';

export type NewAttachment = {
  caseId: string;
  storagePath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type EmailOutcome = {
  teamEmailSentAt: Date | null;
  clientEmailSentAt: Date | null;
  emailError: string | null;
};

export interface CaseStore {
  create(input: IntakeInput): Promise<{ id: string; reference: string }>;
  addAttachment(attachment: NewAttachment): Promise<void>;
  recordEmails(caseId: string, outcome: EmailOutcome): Promise<void>;
}

export function createDb(databaseUrl: string) {
  // prepare: false keeps this working with Supabase's transaction pooler as well as the session pooler.
  const client = postgres(databaseUrl, { max: 5, prepare: false });
  return { db: drizzle(client), close: () => client.end({ timeout: 5 }) };
}

type Db = ReturnType<typeof createDb>['db'];

const UNIQUE_VIOLATION = '23505';

function isUniqueViolation(error: unknown) {
  // Drizzle wraps driver errors; the Postgres code is on the error or its cause.
  const candidates = [error, (error as { cause?: unknown })?.cause];
  return candidates.some((candidate) => (candidate as { code?: string })?.code === UNIQUE_VIOLATION);
}

const nullIfEmpty = (value: string) => value || null;

export function createCaseStore(db: Db): CaseStore {
  return {
    async create(input) {
      for (let attempt = 1; ; attempt += 1) {
        const reference = createReference();
        try {
          const [row] = await db
            .insert(intakeCases)
            .values({
              reference,
              scamType: input.scamType,
              otherScamType: nullIfEmpty(input.otherScamType),
              amountLost: input.amountLost,
              incidentDate: input.incidentDate,
              country: input.country,
              contactChannels: input.contactChannels,
              paymentMethods: input.paymentMethods,
              institutionName: nullIfEmpty(input.institutionName),
              reportStatus: nullIfEmpty(input.reportStatus),
              existingReportRef: nullIfEmpty(input.referenceId),
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              phone: nullIfEmpty(input.phone),
              preferredContact: nullIfEmpty(input.preferredContact),
              timezone: nullIfEmpty(input.timezone),
              bestTimeToReach: nullIfEmpty(input.bestTimeToReach),
              caseSummary: input.caseSummary,
              evidenceDetails: nullIfEmpty(input.evidenceDetails),
              consentAt: new Date(),
            })
            .returning({ id: intakeCases.id, reference: intakeCases.reference });
          return row!;
        } catch (error) {
          // A reference collision is astronomically rare; retry with a fresh one.
          if (attempt < 3 && isUniqueViolation(error)) continue;
          throw error;
        }
      }
    },

    async addAttachment(attachment) {
      await db.insert(intakeAttachments).values(attachment);
    },

    async recordEmails(caseId, outcome) {
      await db.update(intakeCases).set(outcome).where(eq(intakeCases.id, caseId));
    },
  };
}
