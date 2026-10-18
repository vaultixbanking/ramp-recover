import { Resend } from 'resend';

export type Email = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string | string[];
  /** Stops Resend sending the same email twice if a request is retried. */
  idempotencyKey?: string;
};

export interface Mailer {
  send(email: Email): Promise<void>;
}

export function createMailer(apiKey: string, from: string): Mailer {
  const resend = new Resend(apiKey);

  return {
    async send({ idempotencyKey, ...email }) {
      const { error } = await resend.emails.send({ from, ...email }, idempotencyKey ? { idempotencyKey } : undefined);
      if (error) throw new Error(`Resend: ${error.message}`);
    },
  };
}
