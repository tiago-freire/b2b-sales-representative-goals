export async function validateOrganizationId(ctx: Context, next: Next) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { organizationId } = params

  let errorMessage: string | undefined

  if (!organizationId) {
    errorMessage = 'organizationId is required'
  }

  ctx.body = { errorMessage, organizationId }

  await next()
}
