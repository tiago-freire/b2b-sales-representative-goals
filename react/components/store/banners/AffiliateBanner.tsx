import React from 'react'
import { useQuery } from 'react-apollo'
import { Query } from 'ssesandbox04.affiliates-banners'
import GET_AFFILIATE_BANNER_BY_SLUG from '../../../graphql/getBannerAffiliateBySlug.graphql'

const getSlug = () => {
  const splitPathname = window.location?.pathname.split('/')
  return splitPathname && splitPathname[splitPathname.length - 1]
}

const AffiliateBanner = () => {
  const slug = getSlug()
  const { data } = useQuery<Query>(GET_AFFILIATE_BANNER_BY_SLUG, {
    variables: { slug },
  })

  const banner = data?.getBannerAffiliateBySlug?.banner

  if (banner) {
    return <img src={banner} alt={slug} />
  }

  return null
}

export default AffiliateBanner
