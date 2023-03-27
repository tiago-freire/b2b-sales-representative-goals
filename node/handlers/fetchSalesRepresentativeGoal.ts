import { NotFoundError } from '@vtex/api'

import { salesRepresentativeGoalStore } from '../store/salesRepresentativeGoalStore'
import type { ExternalSheetClientResponse } from '../typings/organizations'

export async function fetchSalesRepresentativeGoal(ctx: Context, next: Next) {
  const {
    clients: { externalSheet, apps },
    body,
  } = ctx

  let sheetResponse: ExternalSheetClientResponse | undefined

  const appSettings = await apps.getAppSettings(process.env.VTEX_APP_ID ?? '')
  const googleSheetId = appSettings?.google_sheet_id
  const tabTitle = appSettings?.tab_title
  const apiCredentials: Record<string, string> = JSON.parse(
    appSettings?.service_account_credentials_json
  )

  if (googleSheetId && apiCredentials) {
    const goalFromStore = salesRepresentativeGoalStore[body.organizationId]
    const cacheGoalFromStoreExpired =
      (goalFromStore?.expirationCache ?? 0) <= Date.now()

    if (!cacheGoalFromStoreExpired) {
      sheetResponse = { ...goalFromStore }
    } else {
      sheetResponse = await externalSheet.getGoal(
        { organizationId: body.organizationId },
        {
          apiCredentials,
          googleSheetId,
          tabTitle,
        }
      )
    }

    if (sheetResponse) {
      if (cacheGoalFromStoreExpired) {
        sheetResponse.expirationCache = Date.now() + 30 * 1000
        salesRepresentativeGoalStore[body.organizationId] = sheetResponse
      }
    }
  }

  if (!sheetResponse) {
    const error = new NotFoundError('Organization not found')

    ctx.vtex.logger.error({
      message: 'App_No_Oganization',
      error,
    })

    throw error
  }

  ctx.state.sheetClientResponse = {
    ...sheetResponse,
    organizationId: body.organizationId,
  }

  await next()
}
