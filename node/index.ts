import type { Cached, ClientsConfig } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import { fetchSalesRepresentativeGoal } from './handlers/fetchSalesRepresentativeGoal'
import { formatResponse } from './handlers/formatResponse'
import { validateOrganizationId } from './handlers/validateOrganizationId'

const TIMEOUT_MS = 4 * 1000
const CONCURRENCY = 10
const memoryCache = new LRUCache<string, Cached>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 100,
      retries: 10,
      timeout: TIMEOUT_MS,
      concurrency: CONCURRENCY,
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
