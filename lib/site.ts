// The site's public address. Set NEXT_PUBLIC_SITE_URL once the domain is bought;
// until then the suggested domain is used. TODO(Padraig): domain.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://padraigmiddleton.com").replace(
  /\/$/,
  "",
);
