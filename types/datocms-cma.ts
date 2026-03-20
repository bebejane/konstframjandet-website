import type { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'en';
};
export type District = ItemTypeDefinition<
  EnvironmentSettings,
  '1452375',
  {
    intro: {
      type: 'text';
    };
    content: {
      type: 'rich_text';
      blocks:
        | Image
        | StartProject
        | StartSelectedNews
        | ImageShortcut
        | StartImageGallery
        | StartSelectedDistrictNews
        | StartText
        | StartLatestNews;
    };
    name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    content_contact: {
      type: 'structured_text';
      blocks: Image | Video | Logo | ImageGallery | Button | Audio;
    };
    dropcap: {
      type: 'boolean';
    };
    subdomain: {
      type: 'string';
    };
    english_shortcut: {
      type: 'boolean';
    };
    facebook: {
      type: 'string';
    };
    color: {
      type: 'color';
    };
    instagram: {
      type: 'string';
    };
  }
>;
export type About = ItemTypeDefinition<
  EnvironmentSettings,
  '1452553',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Image
        | Video
        | Logo
        | ImageGallery
        | Button
        | DownloadPdf
        | Audio;
    };
    dropcap: {
      type: 'boolean';
    };
    slug: {
      type: 'slug';
    };
    district: {
      type: 'link';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type News = ItemTypeDefinition<
  EnvironmentSettings,
  '1452565',
  {
    where: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    address: {
      type: 'string';
    };
    subtitle: {
      type: 'string';
    };
    date: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    time: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    misc: {
      type: 'string';
    };
    price: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Image
        | Video
        | Logo
        | ImageGallery
        | Button
        | DownloadPdf
        | Audio;
    };
    external_link: {
      type: 'string';
    };
    extra: {
      type: 'structured_text';
    };
    dropcap: {
      type: 'boolean';
    };
    slug: {
      type: 'slug';
    };
    district: {
      type: 'link';
    };
  }
>;
export type Project = ItemTypeDefinition<
  EnvironmentSettings,
  '1452646',
  {
    title: {
      type: 'string';
    };
    subtitle: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    color: {
      type: 'color';
    };
    color_option: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Image
        | Video
        | Logo
        | ImageGallery
        | Button
        | DownloadPdf
        | Audio;
    };
    dropcap: {
      type: 'boolean';
    };
    subpage: {
      type: 'links';
    };
    webpage: {
      type: 'string';
    };
    completed: {
      type: 'boolean';
    };
    slug: {
      type: 'slug';
    };
    district: {
      type: 'link';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  '1545634',
  {
    image: {
      type: 'file';
    };
    layout: {
      type: 'string';
    };
  }
>;
export type Video = ItemTypeDefinition<
  EnvironmentSettings,
  '1564471',
  {
    video: {
      type: 'video';
    };
    caption: {
      type: 'string';
    };
  }
>;
export type ProjectSubpage = ItemTypeDefinition<
  EnvironmentSettings,
  '1564479',
  {
    title: {
      type: 'string';
    };
    subtitle: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    image: {
      type: 'file';
    };
    color_option: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Image
        | Video
        | Logo
        | ImageGallery
        | Button
        | DownloadPdf
        | Audio;
    };
    dropcap: {
      type: 'boolean';
    };
    district: {
      type: 'link';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type Logo = ItemTypeDefinition<
  EnvironmentSettings,
  '1564488',
  {
    logotypes: {
      type: 'gallery';
    };
  }
>;
export type ImageGallery = ItemTypeDefinition<
  EnvironmentSettings,
  '1564490',
  {
    images: {
      type: 'gallery';
    };
  }
>;
export type Button = ItemTypeDefinition<
  EnvironmentSettings,
  '1564492',
  {
    text: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
  }
>;
export type StartProject = ItemTypeDefinition<
  EnvironmentSettings,
  '1564499',
  {
    projects: {
      type: 'links';
    };
  }
>;
export type StartSelectedNews = ItemTypeDefinition<
  EnvironmentSettings,
  '1564614',
  {
    news: {
      type: 'links';
    };
  }
>;
export type ImageShortcut = ItemTypeDefinition<
  EnvironmentSettings,
  '1564615',
  {
    image: {
      type: 'file';
    };
    layout: {
      type: 'string';
    };
    headline: {
      type: 'string';
    };
    text: {
      type: 'string';
    };
    link: {
      type: 'link';
    };
  }
>;
export type Start = ItemTypeDefinition<
  EnvironmentSettings,
  '1564616',
  {
    selected_in_districts: {
      type: 'links';
    };
  }
>;
export type ExternalLink = ItemTypeDefinition<
  EnvironmentSettings,
  '1564656',
  {
    title: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    intro: {
      type: 'text';
    };
  }
>;
export type StartImageGallery = ItemTypeDefinition<
  EnvironmentSettings,
  '1565451',
  {
    links: {
      type: 'links';
    };
  }
>;
export type StartSelectedDistrictNews = ItemTypeDefinition<
  EnvironmentSettings,
  '1565744',
  {}
>;
export type StartText = ItemTypeDefinition<
  EnvironmentSettings,
  '1565844',
  {
    text: {
      type: 'text';
    };
    link: {
      type: 'link';
    };
  }
>;
export type InternalLink = ItemTypeDefinition<
  EnvironmentSettings,
  '1565855',
  {
    title: {
      type: 'string';
    };
    record: {
      type: 'link';
    };
  }
>;
export type DownloadPdf = ItemTypeDefinition<
  EnvironmentSettings,
  '1566040',
  {
    text: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
  }
>;
export type Audio = ItemTypeDefinition<
  EnvironmentSettings,
  '1566587',
  {
    url: {
      type: 'string';
    };
  }
>;
export type StartLatestNews = ItemTypeDefinition<
  EnvironmentSettings,
  '1653222',
  {
    count: {
      type: 'integer';
    };
  }
>;
export type AnyBlock =
  | Image
  | Video
  | Logo
  | ImageGallery
  | Button
  | StartProject
  | StartSelectedNews
  | ImageShortcut
  | StartImageGallery
  | StartSelectedDistrictNews
  | StartText
  | DownloadPdf
  | Audio
  | StartLatestNews;
export type AnyModel =
  | District
  | About
  | News
  | Project
  | ProjectSubpage
  | Start
  | ExternalLink
  | InternalLink;
export type AnyBlockOrModel = AnyBlock | AnyModel;
