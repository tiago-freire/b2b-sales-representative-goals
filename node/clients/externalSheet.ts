import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import type {
  ExternalSheetClientResponse,
  GoogleSheetsParams,
  SalesRepresentativeGoalInput,
} from '../typings/organizations'
import { convertStringCurrencyToNumber } from '../util/util'

export interface ExternalSheetClient {
  getGoal: (
    item: SalesRepresentativeGoalInput,
    googleSheetsParams: GoogleSheetsParams
  ) => Promise<ExternalSheetClientResponse | undefined>
}

export default class ExternalSheet
  extends ExternalClient
  implements ExternalSheetClient
{
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  private async getSpreadsheet(
    apiCredentials: Record<string, string>,
    googleSheetId: string
  ) {
    const spreadsheet = new GoogleSpreadsheet(googleSheetId)

    await spreadsheet.useServiceAccountAuth({
      client_email: apiCredentials.client_email,
      private_key: apiCredentials.private_key.replace(/\\n/g, '\n'),
    })
    await spreadsheet.loadInfo()

    return spreadsheet
  }

  public async getGoal(
    input: SalesRepresentativeGoalInput,
    googleSheetsParams: GoogleSheetsParams
  ): Promise<ExternalSheetClientResponse | undefined> {
    const { apiCredentials, googleSheetId, tabTitle } = googleSheetsParams

    let spreadsheet: GoogleSpreadsheet | undefined
    let errorMessage: string | undefined

    try {
      spreadsheet = await this.getSpreadsheet(apiCredentials, googleSheetId)
    } catch (e) {
      errorMessage = `getSpreadsheet error: ${e.message}`
    }

    let sheet: GoogleSpreadsheetWorksheet | undefined

    if (tabTitle) {
      sheet = spreadsheet?.sheetsByTitle[tabTitle]
    } else {
      sheet = spreadsheet?.sheetsByIndex[0]
    }

    const rows = await sheet?.getRows()

    const selectedRow = rows?.find(
      (row) => row.organizationId === input.organizationId
    )

    const goal = selectedRow?.goal
      ? convertStringCurrencyToNumber(selectedRow?.goal ?? '0')
      : undefined

    return {
      errorMessage,
      goal,
      organizationId: input.organizationId,
    }
  }
}
