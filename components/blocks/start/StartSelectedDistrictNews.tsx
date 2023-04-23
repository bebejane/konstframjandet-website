import { StartSelectionContainer, StartSelectionCard } from '/components'

export type Props = {
  data: StartSelectedDistrictNewsRecord
  selectedInDistricts: StartModelSelectedInDistrictsField[]
}

export default function StartSelectedDistrictNews({ data: { id }, selectedInDistricts }: Props) {

  return (
    <StartSelectionContainer>
      {selectedInDistricts.map((item, idx) =>
        <StartSelectionCard key={idx} item={item} />
      )}
    </StartSelectionContainer>
  )
}