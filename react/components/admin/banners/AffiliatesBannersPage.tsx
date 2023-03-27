import {
  createSystem,
  Page,
  PageContent,
  PageHeader,
  PageHeaderTitle,
  PageHeaderTop,
  ToastProvider
} from '@vtex/admin-ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { messages } from '../../../utils/messages'
import BannersManager from './BannersManager'

const AffiliatesBannersPage = function () {
  const [ThemeProvider] = createSystem()
  const intl = useIntl()

  return (
    <ThemeProvider>
      <ToastProvider>
        <Page>
          <PageHeader>
            <PageHeaderTop>
              <PageHeaderTitle>
                {intl.formatMessage(messages.bannersPageHeaderTitle)}
              </PageHeaderTitle>
            </PageHeaderTop>
          </PageHeader>
          <PageContent>
            <BannersManager />
          </PageContent>
        </Page>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default AffiliatesBannersPage
