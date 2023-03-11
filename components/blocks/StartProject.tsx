import s from './StartProject.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import { ProjectContainer, ProjectCard } from '/components'

export type Props = {
  data: StartProjectRecord
}

export default function StartProject({ data: { projects } }: Props) {

  return (
    <section className={s.container}>
      <ProjectContainer>
        {projects.map(item =>
          <ProjectCard key={item.id} project={item} />
        )}
      </ProjectContainer>
    </section >
  )
}