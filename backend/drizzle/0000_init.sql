CREATE TABLE "intake_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "intake_attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "intake_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scam_type" text NOT NULL,
	"other_scam_type" text,
	"amount_lost" text NOT NULL,
	"incident_date" date NOT NULL,
	"country" text NOT NULL,
	"contact_channels" text[] NOT NULL,
	"payment_methods" text[] NOT NULL,
	"institution_name" text,
	"report_status" text,
	"existing_report_ref" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"preferred_contact" text,
	"timezone" text,
	"best_time_to_reach" text,
	"case_summary" text NOT NULL,
	"evidence_details" text,
	"consent_at" timestamp with time zone NOT NULL,
	"team_email_sent_at" timestamp with time zone,
	"client_email_sent_at" timestamp with time zone,
	"email_error" text,
	CONSTRAINT "intake_cases_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "intake_cases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "intake_attachments" ADD CONSTRAINT "intake_attachments_case_id_intake_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."intake_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intake_attachments_case_id_idx" ON "intake_attachments" USING btree ("case_id");