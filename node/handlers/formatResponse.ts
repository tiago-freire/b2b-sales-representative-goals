import type {
  ExternalSheetClientResponse,
  Goal,
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

  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', '*')
  ctx.set('Access-Control-Allow-Methods', '*')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Max-Age', '300')
  ctx.set('Content-Type', 'application/json')

  console.log('Goal response:', JSON.stringify(response, null, 2))

  ctx.status = 200
  ctx.body = response
}
