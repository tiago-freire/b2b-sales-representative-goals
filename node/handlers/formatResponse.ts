import type {
  Goal,
  ExternalSheetClientResponse,
} from '../typings/organizations'

export async function formatResponse(ctx: Context) {
  const { state } = ctx
  const sheetResponse = state.sheetClientResponse as ExternalSheetClientResponse

  const response: Goal = {
    message: sheetResponse.errorMessage
      ? 'Error fetching goal'
      : 'Goal retrieved successfully from a Google Sheet',
    organizationId: sheetResponse.organizationId,
    goal: sheetResponse.goal,
  }

  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response
  ctx.status = 200
}
