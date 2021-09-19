const fs = require('fs').promises
const yaml = require('js-yaml')
const rimraf = require('rimraf')

function isWiki() {
  return process.argv.includes('--wiki')
}
hexo.extend.filter.register('before_generate', async function() {
  if (!isWiki()) {
    return
  }
  console.log('wiki generate')
  try {
    const data = await fs.readFile(this.base_dir + '_config.wiki.yml', 'utf8')
    const wikiConfig = yaml.load(data)
    for (let key in wikiConfig) {
      this.config[key] = wikiConfig[key]
    }
  } catch (err) {
    if (err.errno === -4058) {
      console.log('no specific config for wiki')
    } else {
      reject(err)
    }
  }
})

hexo.extend.helper.register('isWiki', function() {
  return isWiki()
})

function removeFolder(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, err => {
      if (err) {
        reject(err)
        return
      }
      resolve(err)
    })
  })
}

const ignoreFiles = [
  '.git',
  '.github',
  'Team-UTokyo',
  'Template-UTokyo',
  'Team-UTokyo(index)',
  'upload.py',
  '.gitignore'
]

async function writeTemplate(path, content) {
  await fs.writeFile(
    path,
    '<!-- export --><html>' + content + '</html><!-- /export -->\n'
  )
}

async function writeLibTemplate(templatePath, name, content) {
  try {
    await fs.mkdir(templatePath + 'lib')
  } catch (e) { }
  await fs.writeFile(
    `${templatePath}lib/${name}`,
    `${content}\n`
  )
}

hexo.extend.filter.register('before_exit', async function() {
  if (!isWiki()) {
    return
  }
  // まずファイルの書き換えなど
  // await Promise.all([
  //   removeFolder(this.public_dir + 'archives'),
  //   removeFolder(this.public_dir + 'css'),
  //   removeFolder(this.public_dir + 'js')
  // ])
  // const fileNames = await fs.readdir(this.public_dir)
  // try {
  //   await fs.mkdir(this.public_dir + 'Team-UTokyo')
  // } catch (e) { }
  // await Promise.all(fileNames.map(fileName => {
  //   return (async() => {
  //     if (ignoreFiles.includes(fileName)) return
  //     if (fileName === 'index.html') {
  //       const newPath = this.public_dir + 'Team-UTokyo(index)'
  //       await fs.rename(this.public_dir + fileName, newPath)
  //     } else {
  //       const stat = await fs.stat(this.public_dir + fileName)
  //       if (!stat.isFile()) {
  //         console.log('folder detected: ' + fileName)
  //         await fs.rename(`${this.public_dir}${fileName}/index.html`, `${this.public_dir}Team-UTokyo/${fileName}`)
  //         await removeFolder(this.public_dir + fileName)
  //       } else {
  //         await fs.rename(this.public_dir + fileName, `${this.public_dir}Team-UTokyo/${fileName}`)
  //       }
  //     }
  //   })()
  // }))
  // const templatePath = this.public_dir + 'Template-UTokyo/'
  const templatePath = this.public_dir + 'template/'
  try {
    await fs.mkdir(templatePath)
  } catch (e) { }
  await Promise.all([(async () => {
    const header = await hexo.theme.getView('_partial/header.pug').render({
      config: this.config,
      theme: this.config.theme_config
    })
    await writeTemplate(templatePath + 'Header.html', header)
    console.log('header template written')
  })(), (async () => {
    const footer = await hexo.theme.getView('_partial/footer.pug').render({
      config: this.config,
      theme: this.config.theme_config
    })
    await writeTemplate(templatePath + 'Footer.html', footer)
    console.log('footer template written')
  })(), (async () => {
    const head = await hexo.theme.getView('_partial/head.pug').render({
      config: this.config,
      theme: this.config.theme_config
    })
    await writeTemplate(templatePath + 'Head.html', head)
    console.log('head template written')
  // })(), (async () => {
  //   const style = await hexo.render.render({
  //     path: this.theme_dir + 'source/css/style.styl'
  //   })
  //   await writeLibTemplate(templatePath, 'CSS', style)
  //   console.log('style template written')
  // })(), (async () => {
  //   const script = await hexo.render.render({
  //     path: this.theme_dir + 'source/js/home.js'
  //   })
  //   await writeLibTemplate(templatePath, 'home-js', script)
  //   console.log('home-js template written')
  })()])
})
