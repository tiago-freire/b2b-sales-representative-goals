import type { ClientsConfig } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { fetchSalesRepresentativeGoal } from './handlers/fetchSalesRepresentativeGoal'
import { formatResponse } from './handlers/formatResponse'
import { validateOrganizationId } from './handlers/validateOrganizationId'

const TIMEOUT_MS = 3000
const memoryCache = new LRUCache<string, never>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

async function keepAlive(ctx: Context) {
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = `${process.env.VTEX_APP_ID ?? 'App'} is alive!`
  ctx.status = 200
}

export default new Service({
  clients,
  routes: {
    salesRepresentativeGoal: method({
      OPTIONS: [
        validateOrganizationId,
        fetchSalesRepresentativeGoal,
        formatResponse,
      ],
      GET: [
        validateOrganizationId,
        fetchSalesRepresentativeGoal,
        formatResponse,
      ],
    }),
    'keep-alive': method({
      GET: keepAlive,
    }),
  },
})
