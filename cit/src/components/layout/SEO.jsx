import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, schema }) => {
  const fullTitle = `${title} | Code i Technology`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;