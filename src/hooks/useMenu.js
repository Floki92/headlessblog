// src/hooks/useMenu.js
import { useState, useEffect } from 'react';
import { wordpressService } from '../services/wordpressService';

export const useMenu = (menuLocation) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const query = `
          query GetMenu($location: MenuLocationEnum!) {
            menuItems(where: {location: $location}) {
              nodes {
                id
                label
                url
                path
                childItems {
                  nodes {
                    id
                    label
                    url
                    path
                  }
                }
              }
            }
          }
        `;

        const data = await wordpressService.graphqlRequest(query, { 
          location: menuLocation.toUpperCase() 
        });
        setMenu(data.menuItems?.nodes || []);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuLocation]);

  return { menu, loading };
};