import { CONFIG } from '../config.js';
import { POSTS_QUERY, POST_BY_SLUG_QUERY, PAGES_QUERY, PAGE_BY_SLUG_QUERY } from '../graphql/queries.js';

class WordPressService {
  constructor() {
    this.baseURL = CONFIG.WP_URL;
    this.useGraphQL = CONFIG.USE_GRAPHQL;
  }

  async graphqlRequest(query, variables = {}) {
    try {
      const response = await fetch(`${this.baseURL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
      }

      return data.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // POSTS METHODS
  async fetchPosts(page = 1, perPage = CONFIG.POSTS_PER_PAGE) {
    if (!this.useGraphQL) {
      return this.fetchPostsREST(page, perPage);
    }

    const variables = {
      first: perPage,
    };

    const data = await this.graphqlRequest(POSTS_QUERY, variables);
    return {
      items: data.posts.nodes,
      total: data.posts.nodes.length,
      pageInfo: data.posts.pageInfo
    };
  }

  async fetchPostBySlug(slug) {
    if (!this.useGraphQL) {
      return this.fetchPostBySlugREST(slug);
    }

    const data = await this.graphqlRequest(POST_BY_SLUG_QUERY, { slug });
    return data.post;
  }

  // PAGES METHODS - NEW
  async fetchPages() {
    if (!this.useGraphQL) {
      return this.fetchPagesREST();
    }

    const data = await this.graphqlRequest(PAGES_QUERY);
    return {
      items: data.pages.nodes,
      total: data.pages.nodes.length
    };
  }

  async fetchPageBySlug(slug) {
    if (!this.useGraphQL) {
      return this.fetchPageBySlugREST(slug);
    }

    const data = await this.graphqlRequest(PAGE_BY_SLUG_QUERY, { slug });
    return data.page;
  }

  // REST API METHODS FOR POSTS
  async fetchPostsREST(page = 1, perPage = CONFIG.POSTS_PER_PAGE) {
    const url = new URL(`${this.baseURL}/wp-json/wp/v2/posts`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('_embed', '1');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`REST posts fetch failed: ${res.status}`);
    const items = await res.json();
    const total = Number(res.headers.get('X-WP-Total') || items.length);
    return { items, total };
  }

  async fetchPostBySlugREST(slug) {
    const url = `${this.baseURL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`REST post fetch failed: ${res.status}`);
    const items = await res.json();
    return items[0] || null;
  }

  // REST API METHODS FOR PAGES - NEW
  async fetchPagesREST() {
    const url = `${this.baseURL}/wp-json/wp/v2/pages?_embed=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`REST pages fetch failed: ${response.status}`);
    }
    
    const items = await response.json();
    return { items, total: items.length };
  }

  async fetchPageBySlugREST(slug) {
    const url = `${this.baseURL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`REST page fetch failed: ${response.status}`);
    }
    
    const items = await response.json();
    return items[0] || null;
  }
  // Add these methods to your WordPressService class

async fetchSiteInfo() {
  if (!this.useGraphQL) {
    return this.fetchSiteInfoREST();
  }

  const query = `
    query SiteInfo {
      generalSettings {
        title
        description
        url
      }
    }
  `;

  const data = await this.graphqlRequest(query);
  
  // For logo, we might need a separate query or use a custom option
  // This is a basic implementation - you might need to adjust based on your WordPress setup
  return {
    title: data.generalSettings?.title || 'YourSite',
    description: data.generalSettings?.description || '',
    url: data.generalSettings?.url || '',
    logo: null // We'll handle logo separately
  };
}

async fetchSiteInfoREST() {
  try {
    // Fetch site title from REST API
    const settingsResponse = await fetch(`${this.baseURL}/wp-json/wp/v2/settings`);
    if (!settingsResponse.ok) {
      throw new Error('Failed to fetch site settings');
    }
    
    const settings = await settingsResponse.json();
    
    return {
      title: settings?.name || 'YourSite',
      description: settings?.description || '',
      url: settings?.url || '',
      logo: null
    };
  } catch (error) {
    console.error('Error fetching site info:', error);
    return {
      title: 'YourSite',
      description: '',
      url: '',
      logo: null
    };
  }
}

// Optional: Method to fetch logo if you have a custom field or theme mod
async fetchSiteLogo() {
  if (!this.useGraphQL) {
    return this.fetchSiteLogoREST();
  }

  // This query depends on how your WordPress theme stores the logo
  // You might need to adjust this based on your setup
  const query = `
    query SiteLogo {
      themeMods {
        customLogo
      }
    }
  `;

  try {
    const data = await this.graphqlRequest(query);
    if (data.themeMods?.customLogo) {
      // You might need to construct the logo URL based on your setup
      return `${this.baseURL}/wp-content/uploads/${data.themeMods.customLogo}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site logo:', error);
    return null;
  }
}

async fetchSiteLogoREST() {
  try {
    // This depends on your WordPress theme and how it stores the logo
    // Many themes use theme mods or options
    const response = await fetch(`${this.baseURL}/wp-json/wp/v2/theme-mods`);
    if (response.ok) {
      const themeMods = await response.json();
      return themeMods?.custom_logo || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site logo:', error);
    return null;
  }
}

async submitContactForm(formId, formData) {
  const mutation = `
    mutation SubmitContactForm($input: SubmitFormInput!) {
      submitForm(input: $input) {
        clientMutationId
        message
        status
      }
    }
  `;

  const variables = {
    input: {
      clientMutationId: `contact-${formId}`,
      formId: parseInt(formId),
      data: Object.entries(formData).map(([key, value]) => ({
        key,
        value
      }))
    }
  };

  return await this.graphqlRequest(mutation, variables);
}

async createOrder(orderData) {
  const mutation = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        clientMutationId
        order {
          id
          orderNumber
          status
          total
        }
      }
    }
  `;

  return await this.graphqlRequest(mutation, { input: orderData });
}

async getProducts(variables = {}) {
  const query = `
    query Products($first: Int, $category: String) {
      products(first: $first, where: {category: $category}) {
        nodes {
          id
          name
          description
          price
          regularPrice
          salePrice
          stockStatus
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  const data = await this.graphqlRequest(query, {
    first: 12,
    ...variables
  });
  
  return {
    items: data.products?.nodes || [],
    total: data.products?.nodes?.length || 0
  };
}

// Update this method in your WordPressService class
async fetchPosts(page = 1, category = '') {
  if (!this.useGraphQL) {
    return this.fetchPostsREST(page, category);
  }

  let whereClause = '';
  if (category) {
    whereClause = `where: {categoryName: "${category}"}`;
  }

  const query = `
    query Posts($first: Int) {
      posts(first: $first, ${whereClause}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          excerpt
          date
          slug
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `;

  const variables = {
    first: CONFIG.POSTS_PER_PAGE,
  };

  try {
    const data = await this.graphqlRequest(query, variables);
    return {
      items: data.posts?.nodes || [],
      total: data.posts?.nodes?.length || 0,
      pageInfo: data.posts?.pageInfo || {}
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

}



export const wordpressService = new WordPressService();