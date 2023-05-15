import { salesRepresentativeGoalStore } from '../store/salesRepresentativeGoalStore'
import type { ExternalSheetClientResponse } from '../typings/organizations'
import { convertStringCurrencyToNumber } from '../util/util'

const EXPIRATION_CACHE_TIMEOUT_MS = 1000

export async function fetchSalesRepresentativeGoal(ctx: Context, next: Next) {
  const {
    clients: { externalSheet, apps },
    body,
  } = ctx

  let sheetResponse: ExternalSheetClientResponse | undefined
  let errorMessage: string | undefined

  const appSettings = await apps.getAppSettings(process.env.VTEX_APP_ID ?? '')
  const googleSheetId = appSettings?.google_sheet_id as string
  const tabTitle = appSettings?.tab_title as string
  const defaultGoal = convertStringCurrencyToNumber(
    (appSettings?.default_goal as string) ?? '0'
  )

  const apiCredentials: Record<string, string> = JSON.parse(
    appSettings?.service_account_credentials_json as string
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
      if (!sheetResponse.errorMessage) {
        if (cacheGoalFromStoreExpired) {
          sheetResponse.expirationCache =
            Date.now() + EXPIRATION_CACHE_TIMEOUT_MS
          salesRepresentativeGoalStore[body.organizationId] = sheetResponse
        }
      } else {
        errorMessage = sheetResponse.errorMessage
      }
    }
  } else {
    errorMessage = 'Credentials not provided on app settings'
  }

  if (!sheetResponse?.goal && !errorMessage) {
    if (defaultGoal) {
      sheetResponse = {
        ...sheetResponse,
        organizationId: body.organizationId,
        goal: defaultGoal,
      }
    } else {
      errorMessage = 'Goal not found'
    }
  }

  ctx.state.sheetClientResponse = {
    ...sheetResponse,
    errorMessage,
    organizationId: body.organizationId,
  }

  await next()
}
