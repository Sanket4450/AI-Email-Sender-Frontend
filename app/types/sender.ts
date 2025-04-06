export interface Sender {
  id: string
  displayName: string
  name: string
  email: string
  esp: ESP
  priority: number
  target: number
  sentCount: number
  createdAt: string
}

export type ESP =
  | 'sendgrid'
  | 'mailgun'
  | 'postmark'
  | 'brevo'
  | 'elastic-email'
  | 'mailjet'