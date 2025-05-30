# Country Selection for William Travel

The country selection feature allows users to personalize their travel experience by selecting a country.
When a user first visits the site, they're presented with a country selection screen. After choosing a country, the home page and other content will be customized based on their selection.

## Implementation Details

1. When a user first visits the site, they're redirected to the country selection page
2. After selecting a country, they're directed to the home page with customized content
3. The selected country is stored in the browser's local storage for persistence
4. Users can change their selected country at any time using the country indicator in the header

## Flag Images

The `/public/flags` directory contains flag images for each supported country. If a flag image is missing, a placeholder is displayed instead.
