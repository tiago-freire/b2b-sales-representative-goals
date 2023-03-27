import type { RecorderState, ServiceContext } from '@vtex/api'
import type { Clients } from '../clients'
import type {
  ExternalSheetClientResponse,
  SalesRepresentativeGoalInput,
} from './organizations'

declare global {
  type Context<TState extends State = State> = ServiceContext<Clients, TState>

  interface State extends RecorderState {
    sheetClientResponse?: ExternalSheetClientResponse
    body: SalesRepresentativeGoalInput
  }

  type Next = () => Promise<void>
}
