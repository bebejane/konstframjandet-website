import s from './StartProject.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import { ProjectContainer, ProjectCard } from '/components'
import Link from 'next/link'

export type Props = {
  data: StartProjectRecord
}

export default function StartProject({ data: { projects } }: Props) {

  return (
    <section className={s.container}>
      <header className="mid">
        <h2>Aktuella projekt</h2>
        <Link href={'/projekt'} className="mid">Visa alla</Link>
      </header>
      <ProjectContainer>
        {projects.map(item =>
          <ProjectCard key={item.id} project={item} />
        )}
      </ProjectContainer>
    </section >
  )
}