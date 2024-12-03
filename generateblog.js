const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');
const hljs = require('highlight.js');

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    return hljs.highlightAuto(code).value;
  }
});

function convertPostToHTML(markdownPath) {
  const content = fs.readFileSync(markdownPath, 'utf8');
  const { attributes, body } = frontMatter(content);
  
  const htmlContent = marked(body);
  
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attributes.title} - GraphFusion AI Blog</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/github.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white font-sans">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <article class="prose prose-invert">
            <h1 class="text-4xl font-bold mb-4 text-blue-400">${attributes.title}</h1>
            <div class="text-gray-400 mb-6">
                <span>Published on ${attributes.date}</span>
                <span class="ml-4">By ${attributes.author}</span>
            </div>
            ${htmlContent}
        </article>
        <div class="mt-8">
            <a href="/" class="text-blue-400 hover:underline">← Back to Blog</a>
        </div>
    </div>
</body>
</html>
  `;

  const outputFilename = path.basename(markdownPath, '.md') + '.html';
  fs.writeFileSync(path.join('blog', outputFilename), htmlTemplate);
}

// Process all posts
const postsDir = path.join(__dirname, '..', 'posts');
const blogDir = path.join(__dirname, '..', 'blog');

// Ensure blog directory exists
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir);
}

fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .forEach(file => {
    convertPostToHTML(path.join(postsDir, file));
  });

console.log('Blog posts generated successfully!');