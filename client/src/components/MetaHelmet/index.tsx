import { Helmet } from 'react-helmet-async';
import { META_INFO } from 'src/constants/meta';

interface MetaHelmetProps {
  title: string;
}

// TODO: 페이지별 다른 title 적용하도록 할 것
function MetaHelmet({ title }: MetaHelmetProps) {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={META_INFO.description} />
      <meta name="keywords" content={META_INFO.keywords} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={META_INFO.title} />
      <meta property="og:site_name" content={META_INFO.title} />
      <meta property="og:type" content={META_INFO.type} />
      <meta property="og:description" content={META_INFO.description} />
      <meta property="og:image" content={META_INFO.image} />
      <meta property="og:url" content={META_INFO.url} />

      <meta name="twitter:title" content={META_INFO.title} />
      <meta name="twitter:description" content={META_INFO.description} />
      <meta name="twitter:image" content={META_INFO.image} />

      <link rel="canonical" href={META_INFO.url} />
    </Helmet>
  );
}
export default MetaHelmet;
