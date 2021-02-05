const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const slugify = require('slugify');
const CopyPlugin = require("copy-webpack-plugin");

const POSTS = require(`./tmp/posts.json`)
const TESTIMONIALS = require(`./tmp/testimonials.json`)
const PAGES = [
  {name: 'index', description: 'Studio Circule est un cabinet proposant plusieurs accompagnements : des soins énergétiques à distance pratiqués par magnétisme et radiesthésie.'},
  {name: 'about', description: 'Studio Circule est un cabinet proposant plusieurs accompagnements : des soins énergétiques à distance pratiqués par magnétisme et radiesthésie.'},
  {name: 'temoignages', description: 'Elles·ils ont testé la méthode Circule pour des soins énergétiques ou des séances de coaching et te racontent.'},
  {name: 'inspiration', description: 'Ici, c’est mon journal. Une section plus personnelle où je poste mes pensées et mes découvertes. Un blog nouvelle génération que je suis ravie de te partager !'},
]
const PAGE_TITLES = {
  index: 'Accueil',
  about: 'About',
  temoignages: 'Témoignages',
  inspiration: "Inspiration"
}

const urlify = content => slugify(content, {lower: true, strict: true})
const urlifyPost = content => `articles/${urlify(content.title)}`
const urlifyTestimonial = content => `temoignages/${urlify(content.testimonial_name)}`

const is_dev = process.env.REM_ENV === "develoment"
const endpoint = is_dev ? "http://localhost:9002" : "https://studiocircule.com"

const pageFactory = ({name, description}, index) => {
  let next_name = (PAGES[index + 1] || PAGES[0]).name
  console.log('page', name)
  return new HtmlWebpackPlugin({
    meta: {description: {property: 'description', content: description}},
    endpoint: endpoint,
    template: `./src/${name}.pug`,
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
    meta: {description: {property: 'description', content: content.title}},
    endpoint: endpoint,
    template: `./src/post.pug`,
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
    meta: {description: {property: 'description', content: content.testimonial_quote}},
    endpoint: endpoint,
    template: `./src/testimonial.pug`,
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
    ...TESTIMONIALS.map(testimonialFactory),
    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, "src", "api"), to: path.resolve(__dirname, "dist", "api")},
        {from: path.resolve(__dirname, "src", "assets", "images", "meta_image.jpg"), to: path.resolve(__dirname, "dist")},
        {from: path.resolve(__dirname, "src", "favicon.ico"), to: path.resolve(__dirname, "dist")},
      ],
    }),
  ],
}
