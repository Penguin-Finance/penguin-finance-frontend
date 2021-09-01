import React, { useMemo } from 'react'
import { Card, CardBody, CommunityIcon, Flex, Heading, Text } from 'penguinfinance-uikit2'
import shuffle from 'lodash/shuffle'
import { useTeams } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import useProfileCreation from './contexts/hook'

interface Team {
  name: string
  description: string
  isJoinable: boolean
}

const Team: React.FC = () => {
  const { teamId: currentTeamId, actions } = useProfileCreation()
  const TranslateString = useI18n()
  const { teams } = useTeams()
  const handleTeamSelection = (value: string) => actions.setTeamId(parseInt(value, 10))
  const teamValues = useMemo(() => shuffle(Object.values(teams)), [teams])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${3}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(826, 'Join a Team')}
      </Heading>
      <Text as="p" mb="24px">
        {TranslateString(828, 'It won’t be possible to undo the choice you make for the foreseeable future!')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(826, 'Join a Team')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(
              830,
              'There’s currently no big difference between teams, and no benefit of joining one team over another for now. So pick whichever one you like!',
            )}
          </Text>
          {teamValues &&
            teamValues.map((team) => {
              return (
                <SelectionCard
                  key={team.name}
                  name="teams-selection"
                  value={team.id}
                  isChecked={currentTeamId === team.id}
                  image={`/images/teams/${team.images.md}`}
                  onChange={handleTeamSelection}
                  disabled={!team.isJoinable}
                >
                  <Text bold>{team.name}</Text>
                  <Flex>
                    <CommunityIcon mr="8px" />
                    <Text>{team.users.toLocaleString()}</Text>
                  </Flex>
                </SelectionCard>
              )
            })}
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={currentTeamId === null}>
        {TranslateString(798, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Team
