module.exports = {
  isProduction: process.env.ELEVENTY_ENV === 'production',
  title: 'Site Title',
  description: 'This is the site description',
  url: 'https://www.kurtnoble.com',
  author: 'Author Name',
  meta: {
    default_social_image: '/static/images/social-image.jpg',
    facebook: 'https://facebook.com/eastslopestudio',
    twitter: '@therealkni',
  },
  currentYear: new Date().getFullYear(),
}
