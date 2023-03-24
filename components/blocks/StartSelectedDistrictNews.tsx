import s from './StartSelectedDistrictNews.module.scss'
import cn from 'classnames'
import React from 'react'
import { NewsContainer, NewsCard, StartSelectionContainer, StartSelectionCard } from '/components'
import Link from 'next/link'

export type Props = {
  data: StartSelectedDistrictNewsRecord
  selectedInDistricts: StartModelSelectedInDistrictsField[]
}

export default function StartSelectedDistrictNews({ data: { id }, selectedInDistricts }: Props) {

  return <></>
  return (

    <StartSelectionContainer>
      {selectedInDistricts.map((item, idx) =>
        <StartSelectionCard key={idx} item={item} />
      )}
    </StartSelectionContainer>

  )
}