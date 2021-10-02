hexo.extend.tag.register('members', (args, content) => {
  const id = `member-gallery-${Date.now()}`
  let exportText = `<section class="gallery" id="${id}">`
  const options = JSON.parse(content)
  for (let person of options) {
    exportText += `
<div class="gallery-item" @mouseenter.prevent="enter" @mouseleave.prevent="leave">
  <div class="face">
    <img class="face-back" src="${person.face}" />
    <div class="sushi">
      <img src="/assets/team/sushi/maguro.svg" />
      Maguro
    </div>
  </div>
  <h3>${person.name}</h3>
  <p class="profile-bio">
    College of Arts and Sciences, Year 1
  </p>
  <p class="profile-bio">
    Appeared in wiki draft
  </p>
  <p class="profile-voice">
    Figma no default ni haitte itayo.<br />
    I think dogs are as cute as cats.
  </p>
</div>
    `
  }
  exportText += `
<script>
const transforms = {
  // top
  0: 'translateY(-100%)',
  // right
  1: 'translateX(100%)',
  // bottom
  2: 'translateY(100%)',
  // left
  3: 'translateX(-100%)',
}
new Vue({
  el: '#${id}',
  methods: {
    enter(e) {
      this.animate(e)
    },
    leave(e) {
      this.animate(e, true)
    },
    animate(e, isReverse = false) {
      const rect = e.target.getBoundingClientRect()
      const distances = [e.offsetY, rect.width - e.offsetX, rect.height - e.offsetY, e.offsetX]
      const edge = distances.indexOf(Math.min(...distances))
      // if we use \`reverse\` option, easing will also be reversed, and the animation will be awkward.
      const transition = !isReverse ? [transforms[edge], 'none'] : ['none', transforms[edge]]
      console.log(e.target)
      e.target.querySelector('.sushi').animate({
        transform: transition
      }, {
        duration: 500,
        easing: 'ease',
        fill: 'forwards'
      })
    }
  }
})
</script>
  `
  return exportText
}, { ends: true })
