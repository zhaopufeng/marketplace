import React from 'react'
import { Header, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { utils } from 'decentraland-commons'

import ParcelName from 'components/ParcelName'
import Mana from 'components/Mana'
import Expiration from 'components/Expiration'
import ParcelTags from 'components/ParcelTags'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelDescription from './ParcelDescription'
import ParcelTransactionHistory from './ParcelTransactionHistory'
import ParcelMortgage from './ParcelMortgage'
import {
  parcelType,
  districtType,
  publicationType,
  mortgageType
} from 'components/types'
import { getDistrict, getOpenPublication } from 'shared/asset'
import { t } from 'modules/translation/utils'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType),
    districts: PropTypes.objectOf(districtType).isRequired,
    onBuy: PropTypes.func.isRequired,
    mortgage: mortgageType
  }

  getDescription() {
    const { parcel, districts } = this.props
    const district = getDistrict(parcel, districts)

    if (district) {
      return district.description
    }
    if (parcel.data.description) {
      return parcel.data.description
    }

    return null
  }

  render() {
    const { parcel, districts, publications, isOwner, mortgage } = this.props

    const description = this.getDescription()
    const publication = getOpenPublication(parcel, publications)

    return (
      <div className="ParcelDetail">
        <Grid columns={2} stackable>
          <Grid.Row className="parcel-detail-row">
            <Grid.Column>
              <Header size="large">
                <ParcelName parcel={parcel} />
              </Header>
              <ParcelDescription description={description} />
            </Grid.Column>
            <Grid.Column className="parcel-owner-container">
              <ParcelOwner
                parcel={parcel}
                districts={districts}
                isOwner={isOwner}
              />
            </Grid.Column>
          </Grid.Row>
          {publication || isOwner ? (
            <Grid.Row className="parcel-detail-row">
              {publication ? (
                <React.Fragment>
                  <Grid.Column width={4}>
                    <h3>{t('parcel_detail.publication.price')}</h3>
                    <Mana
                      amount={parseFloat(publication.price)}
                      size={20}
                      className="mana-price-icon"
                    />
                  </Grid.Column>
                  <Grid.Column width={4} className="time-left">
                    <h3>{t('global.time_left')}</h3>
                    <Expiration
                      expiresAt={parseInt(publication.expires_at, 10)}
                      className={'PublicationExpiration'}
                    />
                  </Grid.Column>
                </React.Fragment>
              ) : null}
              <Grid.Column
                className="parcel-actions-container"
                width={publication ? 8 : 16}
              >
                <ParcelActions
                  parcel={parcel}
                  mortgage={mortgage}
                  publications={publications}
                  isOwner={isOwner}
                />
              </Grid.Column>
            </Grid.Row>
          ) : null}
        </Grid>

        {mortgage && <ParcelMortgage mortgage={mortgage} />}

        {utils.isEmptyObject(parcel.tags) ? null : (
          <Grid stackable className="parcel-detail-row">
            <Grid.Row>
              <Grid.Column>
                <h3>{t('parcel_detail.tags.title')}</h3>
                <ParcelTags parcel={parcel} showDetails={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        <ParcelTransactionHistory parcel={parcel} publications={publications} />
      </div>
    )
  }
}
