// src/hooks/useSiteSettings.js
import { useState, useEffect } from 'react';
import { wordpressService } from '../services/wordpressService';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const query = `
          query SiteSettings {
            themeOptions {
              siteSettings {
                logo {
                  sourceUrl
                  altText
                }
                phoneNumber
                email
                socialMedia {
                  platform
                  url
                }
                companyAddress
              }
            }
          }
        `;

        const data = await wordpressService.graphqlRequest(query);
        setSettings(data.themeOptions?.siteSettings || {});
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};