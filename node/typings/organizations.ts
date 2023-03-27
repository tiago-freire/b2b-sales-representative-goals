import type { Maybe } from '@vtex/api'

export type ExternalSheetClientResponse = {
  organizationId: string
  goal: number
  errorMessage?: string
  expirationCache?: number
}

export type SalesRepresentativeGoalInput = {
  organizationId: string
}

export type Goal = {
  message: string
  organizationId: string
  goal: Maybe<number>
}

export type GoogleSheetsParams = {
  apiCredentials: Record<string, string>
  googleSheetId: string
  tabTitle?: string
}
