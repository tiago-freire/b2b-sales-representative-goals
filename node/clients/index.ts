import { IOClients } from '@vtex/api'

import ExternalSheet from './externalSheet'

export class Clients extends IOClients {
  public get externalSheet() {
    return this.getOrSet('externalSheet', ExternalSheet)
  }
}
