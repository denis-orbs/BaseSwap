import styled from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@magikswap/sdk'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  token: Token
  quoteToken: Token
  quantum?: boolean
  classic?: boolean
  narrow?: boolean
  wide?: boolean
  isNew?: boolean
  stable?: boolean
  isCore?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  token,
  quoteToken,
  quantum,
  classic,
  narrow,
  wide,
  isNew,
  stable,
  isCore,
}) => {
  const { t } = useTranslation()

  let quantumText = ''
  if (quantum && wide) {
    quantumText = 'WIDE'
  } else if (quantum && narrow) {
    quantumText = 'NARROW'
  } else if (quantum && stable) {
    quantumText = 'STABLE'
  } else if (classic && isCore) {
    quantumText = 'BASESWAP'
  }

  // add in stable props

  return (
    <Wrapper justifyContent="space-between" marginX="12px" alignItems="flex-start" mb="8px">
      <TokenPairImage
        mt="0px"
        marginLeft="6px"
        variant="inverted"
        primaryToken={token}
        secondaryToken={quoteToken}
        width={80}
        height={80}
      />
      <Flex flexDirection="column" alignItems="flex-end" justifyContent="flex-start">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>

        {quantumText && (
          <div
            style={{
              padding: '3px 6px',
              marginTop: '0px',
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0px',
              marginBottom: '0px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '2px solid #7303c0',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {quantumText}
          </div>
        )}
        {classic && (
          <div
            style={{
              padding: '3px 6px',
              marginTop: '0px',
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0px',
              marginBottom: '0px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '2px solid #F86C0D',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {t('CLASSIC')}
          </div>
        )}
        {isNew && (
          <div
            style={{
              padding: '3px 6px',
              marginTop: '2px',
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0px',
              marginBottom: '0px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '2px solid #33F',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {t('NEW')}
          </div>
        )}
        {/* {stable && (
          <div
            style={{
              padding: '6px 6px',
              marginTop: 8,
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '2px',
              marginBottom: '0px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '2px solid #33F',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {t('STABLE')}
          </div>
        )} */}

        {/* {narrow && (
          <div
            style={{
              padding: '6px 6px',
              marginTop: '4px',
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '1px',
              marginBottom: '2px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '1.5px solid #fff',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {t('NARROW')}
          </div>
        )}

        {wide && (
          <div
            style={{
              padding: '6px 6px',
              marginTop: '4px',
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '4px',
              marginBottom: '2px',
              background: 'linear-gradient(45deg, #000, #000)',
              border: '1.5px solid #fff',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            {t('WIDE')}
          </div>
        )} */}

        {/* <Flex justifyContent="center"> 
          {/* {isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />} 
          {multiplier ? (
            // <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
            // <div>{multiplier}</div>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
          </Flex>  */}
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
