var Arena = require('are.na')
var fs = require('fs')
var path = require('path')

var arena = new Arena()

var PER = 20
var SLUG = 'ambient-product-design'

var outputDir = path.join(__dirname, 'output')

function writeBlocks(blocks) {
  var ws = fs.createWriteStream(path.join(outputDir, 'ambient-product-design.md'))
  
  blocks.forEach(function (block) {
    if (block.base_class === 'Block') {
      var content = block.content
      
      if (block.title && !content.startsWith('**') && !content.startsWith('##')) {
        content = block.title + '\n' + content
      }

      ws.write(content + '\n\n---\n\n')
    }
  })

  ws.on('finish', function () {
    console.log('Finished.')
  })

  ws.end()
}

!fs.existsSync(outputDir) && fs.mkdirSync(outputDir)

arena.channel(SLUG)
  .get()
  .then(function (channel) {
    var pages = Math.ceil(channel.length / PER)

    return Promise.all(range(pages).map(function (page) {
      console.log(`Fetching page ${page + 1}/${pages}...`)
      return arena.channel(SLUG)
        .contents({ page: page + 1, per: PER })
    }))
  })
  .then(chunks => chunks.flat())
  .then(writeBlocks)
  .catch(function (err) {
    console.error('Something went wrong', err)

  })
  
function range (n) {
  return Array.from(Array(n).keys())
}
  
