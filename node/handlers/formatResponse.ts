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

  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response
  ctx.status = 200
}
