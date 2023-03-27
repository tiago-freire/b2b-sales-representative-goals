import { UserInputError } from '@vtex/api'

export async function validateOrganizationId(ctx: Context, next: Next) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { organizationId } = params

  if (!organizationId) {
    throw new UserInputError('organizationId is required')
  }

  ctx.body = { organizationId }

  await next()
}
