const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const slugify = require('slugify')

const POSTS = require(`./tmp/posts.json`)
const TESTIMONIALS = require(`./tmp/testimonials.json`)
const PAGES = ['index', 'about', 'temoignages', 'inspiration']
const PAGE_TITLES = {
  index: 'Accueil',
  about: 'About',
  temoignages: 'Témoignages',
  inspiration: "Inspiration"
}

const urlify = content => slugify(content, {lower: true, strict: true})
const urlifyPost = content => `articles/${urlify(content.title)}.html`
const urlifyTestimonial = content => `temoignages/${urlify(content.testimonial_name)}.html`

const pageFactory = (name, index) => {
  let next_name = PAGES[index + 1] || PAGES[0]
  console.log('page', name)
  return new HtmlWebpackPlugin({
    template: `./src/${name}.pug`,
    favicon: './src/favicon.ico',
    filename: `${name}.html`,
    page_title: PAGE_TITLES[name],
    name,
    posts: POSTS.map(e => ({page_link: urlifyPost(e), ...e})),
    testimonials: TESTIMONIALS.map(e => ({page_link: urlifyTestimonial(e), ...e})),
    footer: {
      title: PAGE_TITLES[next_name],
      link: `${next_name}.html`,
      name: next_name
    }
  })
}

const postFactory = (content, index) => {
  let next_content = POSTS[index + 1] || POSTS[0]
  return new HtmlWebpackPlugin({
    template: `./src/post.pug`,
    favicon: './src/favicon.ico',
    filename: urlifyPost(content),
    publicPath: '../',
    page_title: 'Article',
    footer: {
      title: next_content.title,
      link: urlifyPost(next_content),
      img: next_content.cover.url
    },
    ...content
  })
}

const testimonialFactory = (content, index) => {
  let next_content = TESTIMONIALS[index + 1] || TESTIMONIALS[0]
  return new HtmlWebpackPlugin({
    template: `./src/testimonial.pug`,
    favicon: './src/favicon.ico',
    filename: urlifyTestimonial(content),
    publicPath: '../',
    page_title: 'Témoignage',
    footer: {
      title: next_content.testimonial_name,
      link: urlifyTestimonial(next_content),
      img: next_content.avatar.url
    },
    ...content
  })
}

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: /(node_modules|bower_components)/,
        use: ['pug-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader', options: {sourceMap: true}},
          {loader: 'postcss-loader', options: {sourceMap: true}},
          {loader: 'sass-loader', options: {sourceMap: true}},
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(otf|ttf|woff)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    ...PAGES.map(pageFactory),
    ...POSTS.map(postFactory),
    ...TESTIMONIALS.map(testimonialFactory)
  ],
}
