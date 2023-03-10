import { TypedDocumentNode } from "@apollo/client/core";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllDistricsDocument, DistrictBySubdomainDocument } from '/graphql';
import type { ApiQueryOptions } from "dato-nextjs-utils/api";
import React from "react";

export const isServer = typeof window === 'undefined';

export const breakpoints = {
  mobile: 320,
  tablet: 740,
  desktop: 980,
  wide: 1441,
  navBreak: 1368
}

export const primarySubdomain = 'forbundet'
export const pageSize = 10;

export const chunkArray = (array: any[] | React.ReactNode[], chunkSize: number) => {
  const newArr = []
  for (let i = 0; i < array.length; i += chunkSize)
    newArr.push(array.slice(i, i + chunkSize));
  return newArr
}

export const parseDatoError = (err: any) => {
  const apiError = err.response?.body?.data;
  if (!apiError) return err?.message ?? err

  const error = {
    _error: apiError,
    message: apiError.map(({ attributes: { details } }) => {
      const { messages } = details
      const m = !messages ? undefined : (!Array.isArray(messages) ? [messages] : messages).join('. ')
      const d = (!Array.isArray(details) ? [details] : details)?.map(({ field_label, field_type, code, extraneous_attributes }) =>
        extraneous_attributes ? `Error fields: ${extraneous_attributes.join(', ')}` : `${field_label} (${field_type}): ${code}`
      )
      return `${m ?? ''} ${d ?? ''}`
    }),
    codes: apiError.map(({ attributes: { code } }) => code),
  }
  return error
}

export const pingEndpoint = async (path: string | string[], method: 'GET' | 'POST' = 'POST') => {
  path = !Array.isArray(path) ? [path] : path;
  path.forEach(p =>
    fetch(p, { method, body: JSON.stringify({ ping: true }) })
      .then(() => console.log(`pinged ${path} endpoint`))
      .catch(err => console.error(`Failed: ping ${path} endpoint`, err))
  )
}

export const recordToSlug = (record: any): string => {

  let href;

  if (!record) {
    throw new Error('recordToSlug: Record  is empty')
  }

  if (typeof record === 'string')
    return record
  else {
    const { __typename, slug, _allReferencingProjects, url } = record
    switch (__typename) {
      case 'AboutRecord':
        href = `/om/${slug}`
        break;
      case 'NewsRecord':
        href = `/aktuellt/${slug}`
        break;
      case 'ProjectRecord':
        href = `/projekt/${slug}`
        break;
      case 'ProjectSubpageRecord':
        href = `/projekt/${_allReferencingProjects[0].slug}/${slug}`
        break;
      case 'ExternalLinkRecord':
        href = url
        break;
      default:
        throw Error(`${__typename} is unknown record slug!`)
    }
  }

  return href
}

export const isEmail = (string: string): boolean => {
  if (!string) return false
  const matcher = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (string.length > 320) return false;
  return matcher.test(string);
}

export const truncateParagraph = (s: string, sentances: number = 1, ellipsis: boolean = true, minLength = 200): string => {
  if (!s || s.length < minLength)
    return s;

  let dotIndex = s.split('.')?.slice(0, sentances + 1).join('.').lastIndexOf('.')
  let qIndex = s.split('? ')?.slice(0, sentances + 1).join('? ').lastIndexOf('? ')
  const isQuestion = qIndex !== -1 && qIndex < dotIndex || (dotIndex === -1 && qIndex > -1)

  if (dotIndex === -1 && qIndex === -1) {
    dotIndex = minLength - 1
    ellipsis = true
  }

  let str = s.substring(0, isQuestion ? qIndex : dotIndex) //`${s.substring(0, minLength - 1)}${s.substring(minLength - 1).split('.').slice(0, sentances).join('. ')}`
  return `${str}${ellipsis ? '...' : isQuestion ? '?' : '.'}`;
}

export const isEmptyObject = (obj: any) => Object.keys(obj).filter(k => obj[k] !== undefined).length === 0

export const capitalize = (str: string, lower: boolean = false) => {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}

export const sleep = (ms: number) => new Promise((resolve, refject) => setTimeout(resolve, ms))

export const apiQueryAll = async (doc: TypedDocumentNode, opt: ApiQueryOptions = {}): Promise<any> => {

  const results = {}
  let size = 100;
  let skip = 0;
  const res = await apiQuery(doc, { variables: { ...opt.variables, first: size, skip } });

  if (res.pagination?.count === undefined)
    throw new Error('Not a pagable query')

  const { count } = res.pagination

  const mergeProps = (res) => {
    const props = Object.keys(res);

    for (let i = 0; i < props.length; i++) {
      const k = props[i]
      const el = res[props[i]];
      if (Array.isArray(el)) {
        results[k] = !results[k] ? el : results[k].concat(el)
      } else
        results[k] = el;
    }
  }

  const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
    input.status === 'rejected'

  const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
    input.status === 'fulfilled'

  mergeProps(res)

  let reqs = []
  for (let skip = size; skip < count; skip += size) {
    if (reqs.length < 50 && skip + size < count) {
      reqs.push(apiQuery(doc, { variables: { ...opt.variables, first: size, skip } }))
    } else {

      reqs.push(apiQuery(doc, { variables: { ...opt.variables, first: size, skip } }))
      const data = await Promise.allSettled(reqs)
      const error = data.find(isRejected)?.reason
      if (error)
        throw new Error(error)

      for (let x = 0; x < data.length; x++) {
        //@ts-ignore
        mergeProps(data[x].value);
      }
      await sleep(100)
      reqs = []
    }
  }
  return results
}
export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function getStaticDistrictPaths(doc: TypedDocumentNode, segment: string) {

  const res = await apiQueryAll(doc)
  const data = res[Object.keys(res)[0]];
  const paths = []
  const districts = await allDistricts()

  districts.forEach(({ id, subdomain }) => {
    const items = data.filter(({ district }) => district && district?.id === id)
    paths.push.apply(paths, items.map(i => ({ params: { district: subdomain, [segment]: i.slug } })))
  })

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function allDistricts() {
  const { districts } = await apiQuery(AllDistricsDocument)
  return districts
}

export async function mainDistrict() {
  const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain: primarySubdomain } })
  return district
}