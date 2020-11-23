const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const slugify = require('slugify')

const POSTS = require(`./tmp/posts.json`)
const TESTIMONIALS = require(`./tmp/testimonials.json`)
const PAGES = ['index', 'about', 'inspiration']

const urlify = content => slugify(content, {lower: true, strict: true})
const urlifyPost = content => `${urlify(content.title)}.html`
const urlifyTestimonial = content => `${urlify(content.testimonial_name)}.html`

const pageFactory = name => new HtmlWebpackPlugin({
  template: `./src/${name}.pug`,
  filename: `${name}.html`,
  posts: POSTS.map(e => ({page_link: urlifyPost(e), ...e})),
  testimonials: TESTIMONIALS.map(e => ({page_link: urlifyTestimonial(e), ...e})),
})

const postFactory = content => new HtmlWebpackPlugin({
  template: `./src/post.pug`,
  filename: urlifyPost(content),
  ...content
})

const testimonialFactory = (content) => new HtmlWebpackPlugin({
  template: `./src/testimonial.pug`,
  filename: urlifyTestimonial(content),
  ...content
})

module.exports = {
  entry: './src/index.js',
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
        test: /\.(otf|ttf)$/i,
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
