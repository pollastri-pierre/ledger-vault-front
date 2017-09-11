const API = {
  protocol: 'https',
  baseUrl: '147.135.130.117',
  getUrl: () => (API.protocol + '://' + API.baseUrl),
  getRoute: (route) => (API.getUrl() + '/' + route)
};


export default API;
