import type {
  Goal,
  ExternalSheetClientResponse,
} from '../typings/organizations'

export async function formatResponse(ctx: Context) {
  const { state } = ctx
  const sheetResponse = state.sheetClientResponse as ExternalSheetClientResponse

  const response: Goal = {
    ...(sheetResponse.errorMessage
      ? {
          success: false,
          error: `Error fetching goal: ${sheetResponse.errorMessage}`,
        }
      : { success: true }),
    organizationId: sheetResponse.organizationId,
    goal: sheetResponse.goal,
  }

  /* configure context to receive requests from any host */
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', '*')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  ctx.set('Access-Control-Max-Age', '86400')
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Content-Type', 'application/json')
  ctx.status = 200
  ctx.body = response
}
